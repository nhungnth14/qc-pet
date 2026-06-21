// Pure Weekly Bug Log enums (Story 7.3). App KHÔNG validate nội dung — honor system.

export type BugSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type BugPriority = 'Low' | 'Medium' | 'High';
export type BugOutcome = 'Fixed' | 'Won\'t Fix' | 'Deferred' | 'Still Open';

export const SEVERITY_OPTIONS: BugSeverity[] = ['Low', 'Medium', 'High', 'Critical'];
export const PRIORITY_OPTIONS: BugPriority[] = ['Low', 'Medium', 'High'];
export const OUTCOME_OPTIONS: BugOutcome[] = ['Fixed', 'Won\'t Fix', 'Deferred', 'Still Open'];

/** Outcome đặc biệt khi user bỏ qua tuần (không gặp bug). */
export const NO_BUGS_OUTCOME = 'no_bugs_this_week';

export type WeeklyBugLogInput = {
  description: string;
  severity: BugSeverity;
  priority: BugPriority;
  outcome: BugOutcome;
};
