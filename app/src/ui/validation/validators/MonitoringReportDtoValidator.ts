import { MonitoringReportStatus } from "@framework/constants/monitoringReportStatus";
import { MonitoringReportQuestionDto, MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { Results } from "../results";
import * as Validation from "./common";
import { Result } from "../result";

export class QuestionValidator extends Results<MonitoringReportQuestionDto> {
  public readonly comments: Result;
  public readonly score: Result;

  constructor(
    readonly question: MonitoringReportQuestionDto,
    readonly answer: MonitoringReportQuestionDto,
    readonly show: boolean,
    readonly submit: boolean,
  ) {
    super({ model: question, showValidationErrors: show });

    this.comments = Validation.all(
      this,
      () =>
        answer.comments
          ? Validation.required(
              this,
              answer.optionId,
              this.getContent(x => x.validation.monitoringReportDtoValidator.scoreRequired({ name: question.title })),
              "comments",
            )
          : Validation.valid(this),
      () =>
        submit
          ? Validation.required(
              this,
              answer.comments,
              this.getContent(x => x.validation.monitoringReportDtoValidator.commentRequired({ name: question.title })),
              "comments",
            )
          : Validation.valid(this),
    );

    this.score = question.isScored
      ? Validation.all(
          this,
          () =>
            submit
              ? Validation.required(
                  this,
                  answer.optionId,
                  this.getContent(x =>
                    x.validation.monitoringReportDtoValidator.scoreRequired({ name: question.title }),
                  ),
                  "optionId",
                )
              : Validation.valid(this),
          () =>
            Validation.isTrue(
              this,
              !answer.optionId || !!question.options.find(x => x.id === answer.optionId),
              this.getContent(x => x.validation.monitoringReportDtoValidator.scoreInvalidChoice),
              "optionId",
            ),
        )
      : Validation.valid(this);
  }
}

export class MonitoringReportDtoValidator extends Results<MonitoringReportDto> {
  public readonly responses: Result;

  constructor(
    model: MonitoringReportDto,
    show: boolean,
    public readonly submit: boolean,
    private readonly questions: MonitoringReportQuestionDto[],
    private readonly totalProjectPeriods: number,
  ) {
    super({ model, showValidationErrors: show });
    this.responses = Validation.optionalChild(
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
      "questions",
    );
  }

  public readonly periodId = Validation.all(
    this,
    () =>
      Validation.required(
        this,
        this.model.periodId,
        this.getContent(x => x.validation.monitoringReportDtoValidator.periodRequired),
        "period",
      ),
    () =>
      Validation.integer(
        this,
        this.model.periodId,
        this.getContent(x => x.validation.monitoringReportDtoValidator.periodNotNumber),
        "period",
      ),
    () =>
      Validation.isTrue(
        this,
        this.model.periodId > 0 && this.model.periodId <= this.totalProjectPeriods,
        this.getContent(x =>
          x.validation.monitoringReportDtoValidator.periodTooLarge({ count: this.totalProjectPeriods }),
        ),
        "period",
      ),
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
  public readonly addComments = Validation.all(this, () =>
    Validation.maxLength(this, this.model.addComments, 5000, undefined, "addComments"),
  );
}
