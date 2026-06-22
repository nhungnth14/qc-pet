// Static content registry — Metro bundler + resolveJsonModule allows static JSON imports.
// Add each new lesson/RBOTW here after running `node scripts/update-manifest.mjs`.
import type { ContentManifest, Lesson, RealBugOfTheWeek } from './lesson-types';

import BD1Json from '../../../content/lessons/BD-1.json';
import TA1Json from '../../../content/lessons/TA-1.json';
import ManifestJson from '../../../content/manifest.json';
import RBOTW001Json from '../../../content/real-bugs/RBOTW-001.json';

export const LESSON_REGISTRY: Record<string, Lesson> = {
  'BD-1': BD1Json as unknown as Lesson,
  'TA-1': TA1Json as unknown as Lesson,
};

export const RBOTW_REGISTRY: Record<string, RealBugOfTheWeek> = {
  'RBOTW-001': RBOTW001Json as unknown as RealBugOfTheWeek,
};

// Auto-updated by `node scripts/update-manifest.mjs` after content changes.
export const MANIFEST: ContentManifest = ManifestJson as unknown as ContentManifest;
