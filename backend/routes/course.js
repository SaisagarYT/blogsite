const express = require("express");
const courseController = require("../controllers/courseController");

const router = express.Router();

router.post("/courses", courseController.createCourse);
router.get("/courses", courseController.listCourses);
router.get("/courses/:id", courseController.getCourseById);
router.put("/courses/:id", courseController.updateCourse);
router.delete("/courses/:id", courseController.deleteCourse);

router.get("/courses/:id/builder", courseController.getCourseBuilder);
router.post("/courses/:id/modules", courseController.addModule);
router.put("/courses/:id/modules/:moduleId", courseController.updateModule);
router.delete("/courses/:id/modules/:moduleId", courseController.deleteModule);
router.patch("/courses/:id/modules/reorder", courseController.reorderModules);

router.post("/courses/:id/modules/:moduleId/lessons", courseController.addLesson);
router.get("/courses/:id/modules/:moduleId/lessons/:lessonId", courseController.getLesson);
router.put("/courses/:id/modules/:moduleId/lessons/:lessonId", courseController.updateLesson);
router.patch("/courses/:id/modules/:moduleId/lessons/:lessonId/content", courseController.saveLessonContent);
router.delete("/courses/:id/modules/:moduleId/lessons/:lessonId", courseController.deleteLesson);
router.patch("/courses/:id/modules/:moduleId/lessons/reorder", courseController.reorderLessons);

module.exports = router;
