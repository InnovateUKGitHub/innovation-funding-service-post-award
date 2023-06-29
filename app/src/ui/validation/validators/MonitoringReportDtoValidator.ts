import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { MonitoringReportQuestionDto, MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { Results } from "../results";
import * as Validation from "./common";

export class QuestionValidator extends Results<MonitoringReportQuestionDto> {
  constructor(
    readonly question: MonitoringReportQuestionDto,
    readonly answer: MonitoringReportQuestionDto,
    readonly show: boolean,
    readonly submit: boolean,
  ) {
    super({ model: question, showValidationErrors: show });
  }

  public readonly comments = Validation.all(
    this,
    () =>
      this.answer.comments
        ? Validation.required(
            this,
            this.answer.optionId,
            this.getContent(x =>
              x.validation.monitoringReportDtoValidator.scoreRequired({ name: this.question.title }),
            ),
          )
        : Validation.valid(this),
    () =>
      this.submit
        ? Validation.required(
            this,
            this.answer.comments,
            this.getContent(x =>
              x.validation.monitoringReportDtoValidator.commentRequired({ name: this.question.title }),
            ),
          )
        : Validation.valid(this),
  );

  public readonly score = this.question.isScored
    ? Validation.all(
        this,
        () =>
          this.submit
            ? Validation.required(
                this,
                this.answer.optionId,
                this.getContent(x =>
                  x.validation.monitoringReportDtoValidator.scoreRequired({ name: this.question.title }),
                ),
              )
            : Validation.valid(this),
        () =>
          Validation.isTrue(
            this,
            !this.answer.optionId || !!this.question.options.find(x => x.id === this.answer.optionId),
            this.getContent(x => x.validation.monitoringReportDtoValidator.scoreInvalidChoice),
          ),
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
    super({ model, showValidationErrors: show });
  }

  public readonly periodId = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.periodId,
        this.getContent(x => x.validation.monitoringReportDtoValidator.periodRequired),
      ),
    () =>
      Validation.integer(
        this,
        this.model.periodId,
        this.getContent(x => x.validation.monitoringReportDtoValidator.periodNotNumber),
      ),
    () =>
      Validation.isTrue(
        this,
        this.model.periodId > 0 && this.model.periodId <= this.totalProjectPeriods,
        this.getContent(x =>
          x.validation.monitoringReportDtoValidator.periodTooLarge({ count: this.totalProjectPeriods }),
        ),
      ),
  );

  public readonly responses = Validation.optionalChild(
    this,
    this.questions,
    q =>
      new QuestionValidator(
        q,
        (this.model.questions || []).find(x => x.displayOrder === q.displayOrder) ||
          ({} as MonitoringReportQuestionDto),
        this.showValidationErrors,
        this.submit,
      ),
    this.getContent(x => x.validation.monitoringReportDtoValidator.responsesInvalid),
  );

  private readonly editableStates = [
    MonitoringReportStatus.Draft,
    MonitoringReportStatus.Queried,
  ] as MonitoringReportStatus[];

  public readonly editable = Validation.all(this, () =>
    Validation.isTrue(
      this,
      this.editableStates.includes(this.model.status),
      this.getContent(x => x.validation.monitoringReportDtoValidator.dtoReadOnly),
    ),
  );

  // Limit the monitoring report comment to a max-length of 5000 characters.
  public readonly addComments = Validation.all(this, () => Validation.maxLength(this, this.model.addComments, 5000));
}
