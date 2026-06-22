import type { MissionCard } from './mission-board-types';
import type { SideQuestSubmission } from '@/features/side-quests/side-quest-types';
import {
  cardRotation,
  FULL_WALL_THRESHOLD,
  isFullWall,
  nextColumn,
  noteRotation,
  WALL_COLORS,
  wallColorFor,
} from './mission-board-types';
import { buildWallNotes } from './wall-notes';

describe('nextColumn (tap-to-move 1 chiều)', () => {
  it('todo → in_progress → done', () => {
    expect(nextColumn('todo')).toBe('in_progress');
    expect(nextColumn('in_progress')).toBe('done');
  });

  it('done giữ nguyên (không undo)', () => {
    expect(nextColumn('done')).toBe('done');
  });
});

describe('wallColorFor (cycle 4 màu)', () => {
  it('xoay vòng theo index', () => {
    expect(wallColorFor(0)).toBe(WALL_COLORS[0]);
    expect(wallColorFor(3)).toBe(WALL_COLORS[3]);
    expect(wallColorFor(4)).toBe(WALL_COLORS[0]);
    expect(wallColorFor(5)).toBe(WALL_COLORS[1]);
  });

  it('index âm vẫn an toàn', () => {
    expect(wallColorFor(-1)).toBe(WALL_COLORS[3]);
  });
});

describe('isFullWall', () => {
  it(`ngưỡng ${FULL_WALL_THRESHOLD}`, () => {
    expect(isFullWall(29)).toBe(false);
    expect(isFullWall(30)).toBe(true);
    expect(isFullWall(31)).toBe(true);
  });
});

describe('rotation (deterministic)', () => {
  it('noteRotation trong [-5, 5] và ổn định theo id', () => {
    const r = noteRotation('sq-abc');
    expect(r).toBe(noteRotation('sq-abc'));
    expect(r).toBeGreaterThanOrEqual(-5);
    expect(r).toBeLessThanOrEqual(5);
  });

  it('cardRotation trong [-3, 3]', () => {
    const r = cardRotation('lesson-1');
    expect(r).toBe(cardRotation('lesson-1'));
    expect(r).toBeGreaterThanOrEqual(-3);
    expect(r).toBeLessThanOrEqual(3);
  });
});

describe('buildWallNotes (merge + sort + màu)', () => {
  const sub = (o: { id: string; type: SideQuestSubmission['type']; title: string; createdAt: string }): SideQuestSubmission => ({
    id: o.id,
    type: o.type,
    createdAt: o.createdAt,
    payload: o.type === 'bug_hunt'
      ? { title: o.title, steps: 's', expected: 'e', actual: 'a', severity: 'low' }
      : { text: o.title },
  });

  const doneCard: MissionCard = {
    id: 'lesson-1',
    lessonName: 'Severity vs Priority',
    category: 'Bug Detective',
    status: 'done',
    completedAt: '2026-06-21T10:00:00.000Z',
  };

  it('gộp submissions + done cards, sort theo createdAt, colorIndex tuần tự', () => {
    const submissions = [
      sub({ id: 's2', type: 'peer_review', title: 'Nhận xét', createdAt: '2026-06-21T12:00:00.000Z' }),
      sub({ id: 's1', type: 'bug_hunt', title: 'Crash checkout', createdAt: '2026-06-21T09:00:00.000Z' }),
    ];
    const notes = buildWallNotes(submissions, [doneCard]);

    // Sort tăng dần: s1 (09:00) → mission lesson-1 (10:00) → s2 (12:00)
    expect(notes.map(n => n.id)).toEqual(['s1', 'mission-lesson-1', 's2']);
    expect(notes.map(n => n.colorIndex)).toEqual([0, 1, 2]);
    expect(notes[0].label).toBe('Crash checkout');
    expect(notes[0].kind).toBe('bug_hunt');
    expect(notes[1].kind).toBe('core_mission');
    expect(notes[2].kind).toBe('side_quest');
  });

  it('freeform (không có title) → label = tên quest', () => {
    const notes = buildWallNotes([sub({ id: 's3', type: 'repro_steps', title: 'abc', createdAt: '2026-06-21T08:00:00.000Z' })], []);
    expect(notes[0].label).toBe('Repro Steps'); // FreeformDraft không có title → fallback tên quest
    expect(notes[0].kind).toBe('side_quest');
  });

  it('rỗng → mảng rỗng', () => {
    expect(buildWallNotes([], [])).toEqual([]);
  });
});
