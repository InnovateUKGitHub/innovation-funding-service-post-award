import * as Validation from "./common";
import { Results } from "../validation/results";
import { MonitoringReportDto, MonitoringReportQuestionDto } from "@framework/dtos";

export class QuestionValidator extends Results<MonitoringReportQuestionDto> {
  constructor(
    readonly question: MonitoringReportQuestionDto,
    readonly answer: MonitoringReportQuestionDto,
    readonly show: boolean,
    readonly submit: boolean,
  ) {
    super(question, show);
  }

  public readonly comments = Validation.all(this,
    () => this.answer.comments ? Validation.required(this, this.answer.optionId, `Enter a score for ${this.question.title.toLocaleLowerCase()}`) : Validation.valid(this),
    () => this.submit ? Validation.required(this, this.answer.comments, `Enter comments for ${this.question.title.toLocaleLowerCase()}`) : Validation.valid(this)
  );

  public readonly score = this.question.isScored ?
    Validation.all(this,
      () => this.submit ? Validation.required(this, this.answer.optionId, `Enter a score for ${this.question.title.toLocaleLowerCase()}`) : Validation.valid(this),
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
    private readonly totalProjectPeriods: number,
  ) {
    super(model, show);
  }

  public readonly periodId = Validation.all(this,
    () => Validation.required(this, this.model.periodId, "Period is required"),
    () => Validation.integer(this, this.model.periodId, "Period must be a whole number, like 3"),
    () => Validation.isTrue(this, (this.model.periodId > 0 && this.model.periodId <= this.totalProjectPeriods), `Period must be ${this.totalProjectPeriods} or fewer`)
  );

  public readonly responses = Validation.optionalChild(
    this,
    this.questions,
    q => new QuestionValidator(q, (this.model.questions || []).find(x => x.displayOrder === q.displayOrder) || {} as MonitoringReportQuestionDto, this.showValidationErrors, this.submit),
    "There are invalid responses."
  );
}
