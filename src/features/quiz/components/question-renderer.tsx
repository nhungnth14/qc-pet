import type { AnswerResult, Question } from '../question-types';
import { BugReportSurgeryView } from './formats/bug-report-surgery';
import { McqQuestionView } from './formats/mcq-question';
import { RewriteTheFailView } from './formats/rewrite-the-fail';
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
    default: {
      // Exhaustive guard — nếu thêm format mới mà quên xử lý, TS sẽ báo lỗi tại đây.
      const _exhaustive: never = question;
      throw new Error(
        `[QuestionRenderer] Format chưa được xử lý: ${JSON.stringify(_exhaustive)}`,
      );
    }
  }
}
