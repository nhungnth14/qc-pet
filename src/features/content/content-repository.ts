import type { Category, ContentManifest, Lesson, ManifestEntry, RealBugOfTheWeek } from './lesson-types';
import { LESSON_REGISTRY, MANIFEST, RBOTW_REGISTRY } from './content-index';

class ContentRepository {
  getManifest(): ContentManifest {
    return MANIFEST;
  }

  getLesson(id: string): Lesson | null {
    return LESSON_REGISTRY[id] ?? null;
  }

  getLessonsByCategory(category: Category): Lesson[] {
    return Object.values(LESSON_REGISTRY)
      .filter(l => l.category === category)
      .sort((a, b) => (a.dependency_order ?? Infinity) - (b.dependency_order ?? Infinity));
  }

  getAllPublishedLessons(): ManifestEntry[] {
    return MANIFEST.lessons.filter(e => e.is_published && e.id in LESSON_REGISTRY);
  }

  getRealBug(id: string): RealBugOfTheWeek | null {
    return RBOTW_REGISTRY[id] ?? null;
  }
}

export const contentRepository = new ContentRepository();
