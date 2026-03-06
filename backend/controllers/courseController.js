const mongoose = require("mongoose");
const Course = require("../models/Course");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value || ""));

const slugify = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const toCourseStatus = (value = "") => {
  const status = String(value || "").toLowerCase().trim();
  if (["draft", "published", "archived", "review"].includes(status)) return status;
  return "draft";
};

const ensureUniqueSlug = async (candidate, excludeId = null) => {
  const base = slugify(candidate || "course") || "course";
  let slug = base;
  let suffix = 1;

  while (true) {
    const existing = await Course.findOne({ slug }).select("_id").lean();
    if (!existing) return slug;
    if (excludeId && String(existing._id) === String(excludeId)) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
};

const countLessons = (modules = []) =>
  modules.reduce((total, moduleItem) => total + (Array.isArray(moduleItem.lessons) ? moduleItem.lessons.length : 0), 0);

const mapCourseCard = (courseDoc) => {
  const course = courseDoc.toObject ? courseDoc.toObject() : courseDoc;
  const modules = Array.isArray(course.modules) ? course.modules : [];
  const status = String(course.status || "draft");

  return {
    _id: course._id,
    title: course.title,
    slug: course.slug,
    thumbnail_url: course.thumbnail_url || "",
    modules_count: modules.length,
    lessons_count: countLessons(modules),
    students_count: Number(course.students_count || 0),
    status,
    status_label: status.charAt(0).toUpperCase() + status.slice(1),
    category: course.category || "",
    difficulty: course.difficulty || "beginner",
    tags: course.tags || [],
    estimated_duration: course.estimated_duration || "",
    updatedAt: course.updatedAt,
    createdAt: course.createdAt,
  };
};

const getCourseOr404 = async (id, res) => {
  if (!isObjectId(id)) {
    res.status(400).json({ success: false, error: "Invalid course id" });
    return null;
  }

  const course = await Course.findById(id);
  if (!course) {
    res.status(404).json({ success: false, error: "Course not found" });
    return null;
  }

  return course;
};

const sortModulesAndLessons = (course) => {
  course.modules = (course.modules || [])
    .sort((a, b) => Number(a.order_index) - Number(b.order_index))
    .map((moduleItem) => {
      moduleItem.lessons = (moduleItem.lessons || []).sort((a, b) => Number(a.order_index) - Number(b.order_index));
      return moduleItem;
    });
  return course;
};

exports.uploadCourseThumbnail = async (req, res) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(500).json({
        success: false,
        error: "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
      });
    }

    const { image, folder = "courses" } = req.body || {};
    if (!image || typeof image !== "string") {
      return res.status(400).json({ success: false, error: "image is required as a base64 data URL" });
    }

    const trimmedFolder = String(folder || "courses").trim() || "courses";
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: trimmedFolder,
      resource_type: "image",
      transformation: [{ width: 1600, height: 900, crop: "limit", quality: "auto", fetch_format: "auto" }],
    });

    return res.status(201).json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to upload thumbnail" });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      category,
      difficulty,
      tags = [],
      thumbnail_url,
      estimated_duration,
      publish_now,
      status,
      instructor_id,
      modules = [],
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: "title is required" });
    }

    if (instructor_id && !isObjectId(instructor_id)) {
      return res.status(400).json({ success: false, error: "Invalid instructor_id" });
    }

    const finalSlug = await ensureUniqueSlug(slug || title);
    const finalStatus = publish_now ? "published" : toCourseStatus(status || "draft");

    const preparedModules = Array.isArray(modules)
      ? modules.map((moduleItem, moduleIndex) => ({
          name: moduleItem?.name || `Module ${moduleIndex + 1}`,
          order_index: Number(moduleItem?.order_index ?? moduleIndex),
          lessons: Array.isArray(moduleItem?.lessons)
            ? moduleItem.lessons.map((lesson, lessonIndex) => ({
                title: lesson?.title || `Lesson ${lessonIndex + 1}`,
                slug: slugify(lesson?.slug || lesson?.title || `lesson-${lessonIndex + 1}`),
                lesson_type: lesson?.lesson_type || "article",
                reading_time: lesson?.reading_time || "",
                status: toCourseStatus(lesson?.status || "draft"),
                order_index: Number(lesson?.order_index ?? lessonIndex),
                editor_data: lesson?.editor_data || { time: Date.now(), version: "2.29.0", blocks: [] },
              }))
            : [],
        }))
      : [];

    const course = await Course.create({
      title,
      slug: finalSlug,
      description: description || "",
      category: category || "",
      difficulty: String(difficulty || "beginner").toLowerCase(),
      tags: Array.isArray(tags) ? [...new Set(tags.map((tag) => String(tag).trim()).filter(Boolean))] : [],
      thumbnail_url: thumbnail_url || "",
      estimated_duration: estimated_duration || "",
      status: finalStatus,
      instructor_id: instructor_id || null,
      modules: preparedModules,
    });

    return res.status(201).json({
      success: true,
      course: mapCourseCard(course),
      builder: sortModulesAndLessons(course.toObject()),
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to create course" });
  }
};

exports.listCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status = "all", instructor_id } = req.query;

    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(50, Math.max(1, Number(limit) || 10));

    const query = {};
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { slug: { $regex: search, $options: "i" } }];
    }

    if (status && String(status).toLowerCase() !== "all") {
      query.status = toCourseStatus(status);
    }

    if (instructor_id) {
      if (!isObjectId(instructor_id)) {
        return res.status(400).json({ success: false, error: "Invalid instructor_id" });
      }
      query.instructor_id = instructor_id;
    }

    const [courses, total] = await Promise.all([
      Course.find(query)
        .sort({ updatedAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber),
      Course.countDocuments(query),
    ]);

    return res.json({
      success: true,
      courses: courses.map(mapCourseCard),
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages: Math.max(1, Math.ceil(total / limitNumber)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to get courses" });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    return res.json({ success: true, course: sortModulesAndLessons(course.toObject()) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to get course" });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    const payload = { ...req.body };

    if (payload.slug || payload.title) {
      payload.slug = await ensureUniqueSlug(payload.slug || payload.title, course._id);
    }

    if (payload.difficulty) {
      payload.difficulty = String(payload.difficulty).toLowerCase();
    }

    if (payload.status || typeof payload.publish_now !== "undefined") {
      payload.status = payload.publish_now ? "published" : toCourseStatus(payload.status || course.status);
    }

    if (payload.instructor_id && !isObjectId(payload.instructor_id)) {
      return res.status(400).json({ success: false, error: "Invalid instructor_id" });
    }

    if (Array.isArray(payload.tags)) {
      payload.tags = [...new Set(payload.tags.map((tag) => String(tag).trim()).filter(Boolean))];
    }

    Object.assign(course, payload);
    await course.save();

    return res.json({ success: true, course: sortModulesAndLessons(course.toObject()) });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to update course" });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    await Course.deleteOne({ _id: course._id });
    return res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to delete course" });
  }
};

exports.getCourseBuilder = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    const sorted = sortModulesAndLessons(course.toObject());
    return res.json({
      success: true,
      course: {
        _id: sorted._id,
        title: sorted.title,
        slug: sorted.slug,
        description: sorted.description,
        thumbnail_url: sorted.thumbnail_url,
        category: sorted.category,
        difficulty: sorted.difficulty,
        status: sorted.status,
        estimated_duration: sorted.estimated_duration,
      },
      module_structure: sorted.modules,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to get course builder data" });
  }
};

exports.addModule = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: "name is required" });
    }

    course.modules.push({
      name,
      order_index: course.modules.length,
      lessons: [],
    });

    await course.save();
    return res.status(201).json({ success: true, modules: sortModulesAndLessons(course.toObject()).modules });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to add module" });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    const moduleItem = course.modules.id(req.params.moduleId);
    if (!moduleItem) return res.status(404).json({ success: false, error: "Module not found" });

    if (req.body.name) moduleItem.name = req.body.name;
    if (typeof req.body.order_index !== "undefined") moduleItem.order_index = Number(req.body.order_index);

    await course.save();
    return res.json({ success: true, module: moduleItem });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to update module" });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    const moduleItem = course.modules.id(req.params.moduleId);
    if (!moduleItem) return res.status(404).json({ success: false, error: "Module not found" });

    moduleItem.deleteOne();
    course.modules.forEach((item, index) => {
      item.order_index = index;
    });

    await course.save();
    return res.json({ success: true, modules: course.modules });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to delete module" });
  }
};

exports.reorderModules = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    const moduleIds = Array.isArray(req.body.module_ids) ? req.body.module_ids.map(String) : [];
    if (!moduleIds.length) return res.status(400).json({ success: false, error: "module_ids is required" });

    const byId = new Map(course.modules.map((moduleItem) => [String(moduleItem._id), moduleItem]));
    course.modules = moduleIds
      .map((moduleId, index) => {
        const moduleItem = byId.get(moduleId);
        if (!moduleItem) return null;
        moduleItem.order_index = index;
        return moduleItem;
      })
      .filter(Boolean);

    await course.save();
    return res.json({ success: true, modules: sortModulesAndLessons(course.toObject()).modules });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to reorder modules" });
  }
};

exports.addLesson = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    const moduleItem = course.modules.id(req.params.moduleId);
    if (!moduleItem) return res.status(404).json({ success: false, error: "Module not found" });

    const { title, slug, lesson_type, reading_time, status } = req.body;
    if (!title) return res.status(400).json({ success: false, error: "title is required" });

    moduleItem.lessons.push({
      title,
      slug: slugify(slug || title),
      lesson_type: lesson_type || "article",
      reading_time: reading_time || "",
      status: toCourseStatus(status || "draft"),
      order_index: moduleItem.lessons.length,
      editor_data: { time: Date.now(), version: "2.29.0", blocks: [] },
    });

    await course.save();
    return res.status(201).json({ success: true, module: moduleItem });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to add lesson" });
  }
};

exports.getLesson = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    const moduleItem = course.modules.id(req.params.moduleId);
    if (!moduleItem) return res.status(404).json({ success: false, error: "Module not found" });

    const lesson = moduleItem.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, error: "Lesson not found" });

    return res.json({ success: true, lesson });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to get lesson" });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    const moduleItem = course.modules.id(req.params.moduleId);
    if (!moduleItem) return res.status(404).json({ success: false, error: "Module not found" });

    const lesson = moduleItem.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, error: "Lesson not found" });

    const payload = { ...req.body };
    if (payload.slug || payload.title) payload.slug = slugify(payload.slug || payload.title);
    if (payload.status) payload.status = toCourseStatus(payload.status);

    Object.assign(lesson, payload);

    await course.save();
    return res.json({ success: true, lesson });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to update lesson" });
  }
};

exports.saveLessonContent = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    const moduleItem = course.modules.id(req.params.moduleId);
    if (!moduleItem) return res.status(404).json({ success: false, error: "Module not found" });

    const lesson = moduleItem.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, error: "Lesson not found" });

    const { editor_data, status, reading_time, lesson_type, title, slug } = req.body;

    if (editor_data) lesson.editor_data = editor_data;
    if (status) lesson.status = toCourseStatus(status);
    if (reading_time) lesson.reading_time = String(reading_time);
    if (lesson_type) lesson.lesson_type = lesson_type;
    if (title) lesson.title = title;
    if (slug || title) lesson.slug = slugify(slug || title || lesson.slug);

    await course.save();

    return res.json({
      success: true,
      message: "Lesson content saved",
      lesson,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to save lesson content" });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    const moduleItem = course.modules.id(req.params.moduleId);
    if (!moduleItem) return res.status(404).json({ success: false, error: "Module not found" });

    const lesson = moduleItem.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ success: false, error: "Lesson not found" });

    lesson.deleteOne();
    moduleItem.lessons.forEach((item, index) => {
      item.order_index = index;
    });

    await course.save();
    return res.json({ success: true, lessons: moduleItem.lessons });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to delete lesson" });
  }
};

exports.reorderLessons = async (req, res) => {
  try {
    const course = await getCourseOr404(req.params.id, res);
    if (!course) return;

    const moduleItem = course.modules.id(req.params.moduleId);
    if (!moduleItem) return res.status(404).json({ success: false, error: "Module not found" });

    const lessonIds = Array.isArray(req.body.lesson_ids) ? req.body.lesson_ids.map(String) : [];
    if (!lessonIds.length) return res.status(400).json({ success: false, error: "lesson_ids is required" });

    const byId = new Map(moduleItem.lessons.map((lesson) => [String(lesson._id), lesson]));
    moduleItem.lessons = lessonIds
      .map((lessonId, index) => {
        const lesson = byId.get(lessonId);
        if (!lesson) return null;
        lesson.order_index = index;
        return lesson;
      })
      .filter(Boolean);

    await course.save();
    return res.json({ success: true, lessons: moduleItem.lessons });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || "Failed to reorder lessons" });
  }
};
