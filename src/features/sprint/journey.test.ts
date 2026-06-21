import type { JourneyEntry } from './journey';
import { mergeJourney } from './journey';

function entry(id: string, dateMs: number): JourneyEntry {
  return { id, kind: 'evidence', dateMs, title: id, detail: '' };
}

describe('mergeJourney', () => {
  it('flatten nhiều list + sort mới nhất trước', () => {
    const a = [entry('a', 100), entry('b', 300)];
    const b = [entry('c', 200)];
    const result = mergeJourney(a, b);
    expect(result.map(e => e.id)).toEqual(['b', 'c', 'a']);
  });

  it('list rỗng → []', () => {
    expect(mergeJourney([], [])).toEqual([]);
  });
});
