import { ExamItem, CourseSheet } from "../types";

const CACHE_EXAMS_KEY = "eduai_cache_exams_v1";
const CACHE_COURSES_KEY = "eduai_cache_courses_v1";
const MAX_CACHE_ITEMS = 25;

export interface CachedItemMeta<T> {
  data: T;
  cachedAt: string;
  sizeBytes: number;
}

export interface CacheStats {
  examCount: number;
  courseCount: number;
  approximateSizeKB: number;
  lastUpdated: string;
}

/**
 * Safe local storage reader
 */
function readStorage<T>(key: string): Record<string, CachedItemMeta<T>> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn("Erreur lecture cache local:", err);
    return {};
  }
}

/**
 * Safe local storage writer
 */
function writeStorage<T>(key: string, data: Record<string, CachedItemMeta<T>>) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn("Erreur écriture cache local:", err);
  }
}

/**
 * Cache an exam and its solution for offline access
 */
export function cacheExam(exam: ExamItem): boolean {
  try {
    const store = readStorage<ExamItem>(CACHE_EXAMS_KEY);
    const serialized = JSON.stringify(exam);

    // Keep cache bounded
    const keys = Object.keys(store);
    if (keys.length >= MAX_CACHE_ITEMS && !store[exam.id]) {
      // Remove oldest
      delete store[keys[0]];
    }

    store[exam.id] = {
      data: exam,
      cachedAt: new Date().toISOString(),
      sizeBytes: new Blob([serialized]).size,
    };

    writeStorage(CACHE_EXAMS_KEY, store);
    return true;
  } catch (err) {
    console.warn("Impossible de mettre en cache l'examen:", err);
    return false;
  }
}

/**
 * Cache a revision course sheet for offline access
 */
export function cacheCourse(course: CourseSheet): boolean {
  try {
    const store = readStorage<CourseSheet>(CACHE_COURSES_KEY);
    const serialized = JSON.stringify(course);

    const keys = Object.keys(store);
    if (keys.length >= MAX_CACHE_ITEMS && !store[course.id]) {
      delete store[keys[0]];
    }

    store[course.id] = {
      data: course,
      cachedAt: new Date().toISOString(),
      sizeBytes: new Blob([serialized]).size,
    };

    writeStorage(CACHE_COURSES_KEY, store);
    return true;
  } catch (err) {
    console.warn("Impossible de mettre en cache le cours:", err);
    return false;
  }
}

/**
 * Retrieve all cached exams
 */
export function getCachedExams(): ExamItem[] {
  const store = readStorage<ExamItem>(CACHE_EXAMS_KEY);
  return Object.values(store)
    .sort((a, b) => new Date(b.cachedAt).getTime() - new Date(a.cachedAt).getTime())
    .map((item) => item.data);
}

/**
 * Retrieve all cached courses
 */
export function getCachedCourses(): CourseSheet[] {
  const store = readStorage<CourseSheet>(CACHE_COURSES_KEY);
  return Object.values(store)
    .sort((a, b) => new Date(b.cachedAt).getTime() - new Date(a.cachedAt).getTime())
    .map((item) => item.data);
}

/**
 * Check if a specific exam is cached
 */
export function isExamCached(id: string): boolean {
  const store = readStorage<ExamItem>(CACHE_EXAMS_KEY);
  return Boolean(store[id]);
}

/**
 * Check if a specific course is cached
 */
export function isCourseCached(id: string): boolean {
  const store = readStorage<CourseSheet>(CACHE_COURSES_KEY);
  return Boolean(store[id]);
}

/**
 * Remove an exam from cache
 */
export function removeCachedExam(id: string) {
  const store = readStorage<ExamItem>(CACHE_EXAMS_KEY);
  if (store[id]) {
    delete store[id];
    writeStorage(CACHE_EXAMS_KEY, store);
  }
}

/**
 * Remove a course from cache
 */
export function removeCachedCourse(id: string) {
  const store = readStorage<CourseSheet>(CACHE_COURSES_KEY);
  if (store[id]) {
    delete store[id];
    writeStorage(CACHE_COURSES_KEY, store);
  }
}

/**
 * Clear all cached items
 */
export function clearAllCache() {
  localStorage.removeItem(CACHE_EXAMS_KEY);
  localStorage.removeItem(CACHE_COURSES_KEY);
}

/**
 * Calculate total cache stats
 */
export function getCacheStats(): CacheStats {
  const examsStore = readStorage<ExamItem>(CACHE_EXAMS_KEY);
  const coursesStore = readStorage<CourseSheet>(CACHE_COURSES_KEY);

  let totalBytes = 0;
  Object.values(examsStore).forEach((e) => (totalBytes += e.sizeBytes || 0));
  Object.values(coursesStore).forEach((c) => (totalBytes += c.sizeBytes || 0));

  return {
    examCount: Object.keys(examsStore).length,
    courseCount: Object.keys(coursesStore).length,
    approximateSizeKB: Math.round(totalBytes / 1024),
    lastUpdated: new Date().toLocaleTimeString("fr-FR"),
  };
}
