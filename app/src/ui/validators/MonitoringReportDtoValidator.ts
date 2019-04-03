import * as Validation from "./common";
import { Results } from "../validation/results";
import { MonitoringReportDto, MonitoringReportQuestionDto } from "../../types/dtos/monitoringReportDto";
import { MonitoringReportStatus } from "../../types/constants/monitoringReportStatus";

class QuestionValidator extends Results<MonitoringReportQuestionDto> {
  constructor(
    readonly question: MonitoringReportQuestionDto,
    readonly answer: MonitoringReportQuestionDto,
    readonly show: boolean,
    readonly submit: boolean,
  ) {
    super(question, show);
  }

  public readonly comments = Validation.all(this,
    () => this.submit ? Validation.required(this, this.answer.comments, "Comments are required.") : Validation.valid(this),
    () => this.answer.comments ? Validation.required(this, this.answer.optionId, "Score must be selected to submit a comment.") : Validation.valid(this)
  );

  public readonly score = this.question.options && this.question.options.length ?
    Validation.all(this,
      () => this.submit ? Validation.required(this, this.answer.optionId) : Validation.valid(this),
      () => Validation.isTrue(this, !this.answer.optionId || !!this.question.options.find(x => x.id === this.answer.optionId), "Select a value from the list.")
    )
    : Validation.valid(this);
}

export class MonitoringReportDtoValidator extends Results<MonitoringReportDto> {
  constructor(
    model: MonitoringReportDto,
    show: boolean,
    public readonly submit: boolean,
    private readonly questions: MonitoringReportQuestionDto[],
  ) {
    super(model, show);
  }

  public readonly responses = Validation.optionalChild(this, this.questions,
    q => (
      new QuestionValidator(
        q,
        this.model.questions.find(x => x.displayOrder === q.displayOrder) || {} as MonitoringReportQuestionDto,
        this.showValidationErrors,
        this.submit
      )), "There are invalid responses.");
}
