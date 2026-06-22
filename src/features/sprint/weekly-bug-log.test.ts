import { NO_BUGS_OUTCOME, OUTCOME_OPTIONS, PRIORITY_OPTIONS, SEVERITY_OPTIONS } from './weekly-bug-log';

describe('weekly bug log enums', () => {
  it('severity có 4 mức', () => {
    expect(SEVERITY_OPTIONS).toEqual(['Low', 'Medium', 'High', 'Critical']);
  });

  it('priority có 3 mức', () => {
    expect(PRIORITY_OPTIONS).toEqual(['Low', 'Medium', 'High']);
  });

  it('outcome có 4 lựa chọn', () => {
    expect(OUTCOME_OPTIONS).toHaveLength(4);
    expect(OUTCOME_OPTIONS).toContain('Fixed');
    expect(OUTCOME_OPTIONS).toContain('Still Open');
  });

  it('no-bugs outcome key', () => {
    expect(NO_BUGS_OUTCOME).toBe('no_bugs_this_week');
  });
});
