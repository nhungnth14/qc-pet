import type { AnswerResult, Question } from '../question-types';
import { BoundaryAttackView } from './formats/boundary-attack';
import { BugReportSurgeryView } from './formats/bug-report-surgery';
import { CompleteTestCaseView } from './formats/complete-test-case';
import { McqQuestionView } from './formats/mcq-question';
import { PrioritySeverityDuelView } from './formats/priority-severity-duel';
import { RewriteTheFailView } from './formats/rewrite-the-fail';
import { RiskRadarView } from './formats/risk-radar';
import { RootCauseChainView } from './formats/root-cause-chain';
import { SeveritySwipeView } from './formats/severity-swipe';
import { SpotTheDefectView } from './formats/spot-the-defect';

type Props = {
  question: Question;
  disabled: boolean;
  onAnswered: (result: AnswerResult) => void;
};

/**
 * Question Format Engine (Story 5.4) — switch theo `question.format` → component đúng.
 * KHÔNG tự quyết feedback/Story-Rule; chỉ emit `onAnswered`. Quiz player sở hữu pipeline.
 * `disabled` khoá tương tác sau khi đã trả lời (tránh submit 2 lần).
 */
export function QuestionRenderer({ question, disabled, onAnswered }: Props) {
  switch (question.format) {
    case 'mcq':
      return <McqQuestionView question={question} disabled={disabled} onAnswered={onAnswered} />;
    case 'severity_swipe':
      return <SeveritySwipeView question={question} disabled={disabled} onAnswered={onAnswered} />;
    case 'spot_the_defect':
      return <SpotTheDefectView question={question} disabled={disabled} onAnswered={onAnswered} />;
    case 'bug_report_surgery':
      return (
        <BugReportSurgeryView question={question} disabled={disabled} onAnswered={onAnswered} />
      );
    case 'rewrite_the_fail':
      return <RewriteTheFailView question={question} disabled={disabled} onAnswered={onAnswered} />;
    case 'priority_severity_duel':
      return (
        <PrioritySeverityDuelView question={question} disabled={disabled} onAnswered={onAnswered} />
      );
    case 'boundary_attack':
      return <BoundaryAttackView question={question} disabled={disabled} onAnswered={onAnswered} />;
    case 'root_cause_chain':
      return <RootCauseChainView question={question} disabled={disabled} onAnswered={onAnswered} />;
    case 'risk_radar':
      return <RiskRadarView question={question} disabled={disabled} onAnswered={onAnswered} />;
    case 'complete_test_case':
      return (
        <CompleteTestCaseView question={question} disabled={disabled} onAnswered={onAnswered} />
      );
    default: {
      // Exhaustive guard — nếu thêm format mới mà quên xử lý, TS sẽ báo lỗi tại đây.
      const _exhaustive: never = question;
      throw new Error(
        `[QuestionRenderer] Format chưa được xử lý: ${JSON.stringify(_exhaustive)}`,
      );
    }
  }
}
