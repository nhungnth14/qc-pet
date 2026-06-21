import type { Lesson } from './lesson-types';
import { LESSON_REGISTRY } from './content-index';
import { contentRepository } from './content-repository';

describe('contentRepository', () => {
  describe('getLesson', () => {
    it('returns lesson for known ID', () => {
      const lesson = contentRepository.getLesson('BD-1');
      expect(lesson).not.toBeNull();
      expect(lesson?.id).toBe('BD-1');
      expect(lesson?.category).toBe('BD');
    });

    it('returns null for unknown ID', () => {
      expect(contentRepository.getLesson('ZZ-99')).toBeNull();
    });
  });

  describe('getLessonsByCategory', () => {
    it('returns only lessons matching category', () => {
      const bd = contentRepository.getLessonsByCategory('BD');
      expect(bd.every(l => l.category === 'BD')).toBe(true);
      expect(bd.length).toBeGreaterThanOrEqual(1);
    });

    it('sorts by dependency_order ascending', () => {
      const bd = contentRepository.getLessonsByCategory('BD');
      for (let i = 1; i < bd.length; i++) {
        expect((bd[i].dependency_order ?? 0) >= (bd[i - 1].dependency_order ?? 0)).toBe(true);
      }
    });

    it('lessons without dependency_order sort after lessons with it', () => {
      // Temporarily add a BD lesson with no dependency_order to verify Infinity fallback
      const reg = LESSON_REGISTRY as Record<string, Lesson>;
      reg['BD-SORT-TEST'] = { id: 'BD-SORT-TEST', category: 'BD' } as Lesson;
      try {
        const bd = contentRepository.getLessonsByCategory('BD');
        const bd1Index = bd.findIndex(l => l.id === 'BD-1');
        const testIndex = bd.findIndex(l => l.id === 'BD-SORT-TEST');
        expect(bd1Index).toBeLessThan(testIndex); // dep=1 before undefined (sorts last)
      }
      finally {
        delete reg['BD-SORT-TEST'];
      }
    });

    it('returns empty array for category with no lessons', () => {
      expect(contentRepository.getLessonsByCategory('AT')).toHaveLength(0);
    });
  });

  describe('getAllPublishedLessons', () => {
    it('returns only is_published:true entries', () => {
      const published = contentRepository.getAllPublishedLessons();
      expect(published.every(e => e.is_published)).toBe(true);
    });

    it('returns ManifestEntry shape (id, version, category, bloom_level, title)', () => {
      const published = contentRepository.getAllPublishedLessons();
      expect(published.length).toBeGreaterThanOrEqual(1);
      const entry = published[0];
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('version');
      expect(entry).toHaveProperty('category');
      expect(entry).toHaveProperty('bloom_level');
      expect(entry).toHaveProperty('title');
    });
  });

  describe('getManifest', () => {
    it('returns manifest with content_version string', () => {
      const manifest = contentRepository.getManifest();
      expect(typeof manifest.content_version).toBe('string');
      expect(manifest.content_version.length).toBeGreaterThan(0);
    });

    it('manifest lessons array is non-empty', () => {
      expect(contentRepository.getManifest().lessons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getRealBug', () => {
    it('returns RBOTW for known ID', () => {
      const rb = contentRepository.getRealBug('RBOTW-001');
      expect(rb).not.toBeNull();
      expect(rb?.type).toBe('REAL_BUG_OF_THE_WEEK');
    });

    it('returns null for unknown RBOTW ID', () => {
      expect(contentRepository.getRealBug('RBOTW-999')).toBeNull();
    });
  });
});
