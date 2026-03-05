import axios from "axios";
import API_BASE_URL from "../config/api";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/course`,
  withCredentials: true,
});

export const listCoursesApi = async (params = {}) => {
  const { data } = await api.get("/courses", { params });
  return data;
};

export const createCourseApi = async (payload) => {
  const { data } = await api.post("/courses", payload);
  return data;
};

export const getCourseBuilderApi = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}/builder`);
  return data;
};

export const addModuleApi = async (courseId, payload) => {
  const { data } = await api.post(`/courses/${courseId}/modules`, payload);
  return data;
};

export const addLessonApi = async (courseId, moduleId, payload) => {
  const { data } = await api.post(`/courses/${courseId}/modules/${moduleId}/lessons`, payload);
  return data;
};

export const getLessonApi = async (courseId, moduleId, lessonId) => {
  const { data } = await api.get(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
  return data;
};

export const saveLessonContentApi = async (courseId, moduleId, lessonId, payload) => {
  const { data } = await api.patch(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/content`, payload);
  return data;
};
