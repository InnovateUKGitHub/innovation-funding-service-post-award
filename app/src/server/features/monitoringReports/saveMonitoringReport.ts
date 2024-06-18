import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { ProjectRole } from "@framework/constants/project";
import { MonitoringReportDto } from "@framework/dtos/monitoringReportDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ISalesforceMonitoringReportHeader } from "@server/repositories/monitoringReportHeaderRepository";
import { ISalesforceMonitoringReportResponse } from "@server/repositories/monitoringReportResponseRepository";
import { BadRequestError, ValidationError } from "../common/appError";
import { ZodCommandBase } from "../common/zodCommandBase";
import { noop } from "lodash";
import {
  monitoringReportSummaryErrorMap,
  monitoringReportSummarySchema,
} from "@ui/containers/pages/monitoringReports/workflow/monitoringReportSummary.zod";
import { convertZodErrorsToResultsFormat } from "@framework/util/errorHelpers";
import { z } from "zod";
import { Results } from "@ui/validation/results";

export class SaveMonitoringReport extends ZodCommandBase<boolean, typeof monitoringReportSummarySchema> {
  constructor(
    private readonly monitoringReportDto: PickRequiredFromPartial<
      MonitoringReportDto,
      "projectId" | "periodId" | "headerId"
    >,
    private readonly submit: boolean,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    // need to abort if the user does not have the right role
    return auth.forProject(this.monitoringReportDto.projectId).hasRole(ProjectRole.MonitoringOfficer);
  }

  private async updateHeader(context: IContext) {
    // get period id
    const periodId = this.monitoringReportDto.periodId;

    // get profile for period
    const profile = await context.repositories.profileTotalPeriod
      .getByProjectIdAndPeriodId(this.monitoringReportDto.projectId, periodId)
      // all the profiles for this period will have the same start and end dates so it doesn't matter which one we use
      .then(profiles => profiles[0]);

    if (!profile) {
      throw new BadRequestError("Invalid profile specified");
    }

    // convert updatable to SOQL
    const update: Updatable<ISalesforceMonitoringReportHeader> = {
      Id: this.monitoringReportDto.headerId,
      Acc_ProjectPeriodNumber__c: periodId,
      Acc_PeriodStartDate__c: profile.Acc_ProjectPeriodStartDate__c,
      Acc_PeriodEndDate__c: profile.Acc_ProjectPeriodEndDate__c,
      Acc_AddComments__c: this.monitoringReportDto.addComments,
    };

    // add status and comments if is submit action
    if (this.submit) {
      update.Acc_MonitoringReportStatus__c = "Awaiting IUK Approval";
      update.Acc_AddComments__c = "";
    }

    // update header
    await context.repositories.monitoringReportHeader.update(update);
  }

  private async insertStatusChange(context: IContext): Promise<void> {
    // if submitting, then create a status change with header and comments
    if (!this.submit) return;
    await context.repositories.monitoringReportStatusChange.createStatusChange({
      Acc_MonitoringReport__c: this.monitoringReportDto.headerId,
      Acc_ExternalComment__c: this.monitoringReportDto.addComments,
    });
  }

  private async updateMonitoringReport(context: IContext): Promise<void> {
    // get existing monitoring report for the header
    const existing =
      (await context.repositories.monitoringReportResponse.getAllForHeader(this.monitoringReportDto.headerId)) || [];

    // get updatable items
    const updateDtos = this.monitoringReportDto?.questions?.filter(x => x.responseId && x.optionId);
    // get insertable items
    const insertDtos = this.monitoringReportDto?.questions?.filter(x => !x.responseId && x.optionId);

    // get the ids of the updatable items
    const persistedIds = updateDtos?.map(x => x.responseId);
    // get the ids of the items to be deleted
    const deleteItems = existing.filter(x => persistedIds?.indexOf(x.Id) === -1).map(x => x.Id);

    // convert updatable items to SOQL
    const updateItems = updateDtos?.map<Updatable<ISalesforceMonitoringReportResponse>>(updateDto => ({
      Id: updateDto.responseId ?? "",
      Acc_Question__c: updateDto.optionId ?? "",
      Acc_QuestionComments__c: updateDto.comments,
    }));

    // convert insertable items to SOQL
    const insertItems = insertDtos?.map<Partial<ISalesforceMonitoringReportResponse>>(insertDto => ({
      Acc_MonitoringHeader__c: this.monitoringReportDto.headerId,
      Acc_Question__c: insertDto.optionId ?? "",
      Acc_QuestionComments__c: insertDto.comments,
    }));

    // run the repository updates
    await Promise.all<AnyObject>([
      updateItems ? context.repositories.monitoringReportResponse.update(updateItems) : noop,
      insertItems ? context.repositories.monitoringReportResponse.insert(insertItems) : noop,
      deleteItems ? context.repositories.monitoringReportResponse.delete(deleteItems) : noop,
    ]);
  }

  protected async getZodSchema() {
    return { schema: monitoringReportSummarySchema, errorMap: monitoringReportSummaryErrorMap };
  }

  protected async mapToZod(dto: MonitoringReportDto): Promise<z.input<typeof monitoringReportSummarySchema>> {
    return {
      questions: dto.questions.map(x => ({
        optionId: x.optionId ?? "",
        comments: x.comments,
        title: x.title,
      })),
      button_submit: this.submit ? "submit" : "saveAndReturnToSummary",
      addComments: this.monitoringReportDto.addComments ?? "",
      periodId: dto.periodId,
    };
  }

  protected async run(context: IContext) {
    // fetch existing header
    const header = await context.repositories.monitoringReportHeader.getById(this.monitoringReportDto.headerId);

    // reject if the header does not match the project id
    if (header.Acc_Project__c !== this.monitoringReportDto.projectId) {
      throw new BadRequestError("Invalid request");
    }

    // check that the status is appropriate for updating the monitoring report (is this necessary, or can this be done salesforce side?)
    if (
      header.Acc_MonitoringReportStatus__c !== "Draft" &&
      header.Acc_MonitoringReportStatus__c !== "New" &&
      header.Acc_MonitoringReportStatus__c !== "IUK Queried"
    ) {
      throw new BadRequestError("Report has already been submitted");
    }

    // as we can save a queried by IUK report should this be dependent on the status of the report?
    // discussed with Jamie and it is unlikely -  not something to consider at the moment
    // user can always create a new report to sort this!
    // const questions = await context.runQuery(new GetMonitoringReportActiveQuestions());
    // const project = await context.runQuery(new GetByIdQuery(this.monitoringReportDto.projectId));
    // validate the data as sent back from the UI using the legacy validator
    // const validationResult = new MonitoringReportDtoValidator(
    //   this.monitoringReportDto as MonitoringReportDto,
    //   true,
    //   this.submit,
    //   questions,
    //   project.periodId,
    // );
    // if (!validationResult.isValid) {
    //   throw new ValidationError(validationResult);
    // }

    const { schema } = await this.getZodSchema();
    const data = await this.mapToZod(this.monitoringReportDto);

    const validationResult = schema.safeParse(data);

    if (!validationResult.success) {
      console.log("validationResult.error", validationResult.error);
      const combinedErrors = convertZodErrorsToResultsFormat(validationResult?.error);
      console.log("combinederrors", combinedErrors);
      const errorResults = new Results({ model: {}, showValidationErrors: true, results: combinedErrors });
      throw new ValidationError(errorResults);
    }

    await this.updateMonitoringReport(context);
    await this.updateHeader(context);
    await this.insertStatusChange(context);
    return true;
  }
}

// z.object({
//   button_submit: z.literal("submit"),
//   questions: z.array(
//     z
//       .object({
//         optionId: z.string(),
//         comments: z.string().max(32_000),
//         title: z.string(),
//       })
//       .superRefine((data, ctx) => {
//         if (data.optionId.length < 1 && !sectionsWithoutOptionId.includes(data.title)) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.too_small,
//             minimum: 1,
//             type: "string",
//             inclusive: true,
//             path: ["optionId"],
//           });
//         }
//         // need to use super refine to ensure title is in the scope for i18n
//         if (data.comments.length < 1) {
//           ctx.addIssue({
//             code: z.ZodIssueCode.too_small,
//             minimum: 1,
//             type: "string",
//             inclusive: true,
//             path: ["comments"],
//           });
//         }
//       }),
//   ),
//   periodId: z.number(),
//   addComments: z.string().max(5000).optional(),
// }),
// z.object({
//   button_submit: z.literal("saveAndReturnToSummary"),
//   questions: z.array(
//     z.object({
//       optionId: z.string().optional(),
//       comments: z.string().max(32_000).optional(),
//     }),
//   ),
//   periodId: z.number(),
//   addComments: z.string().max(5000),
// }),

// this.monitoringReportDto {
//   headerId: 'a07Ad00000IOd21IAD',
//   endDate: 2024-03-31T00:00:00.000Z,
//   lastUpdated: 2024-06-14T13:45:12.000Z,
//   periodId: 1,
//   startDate: 2024-03-01T00:00:00.000Z,
//   statusName: 'Draft',
//   projectId: 'a0EAd000002H9iVMAS',
//   status: 20,
//   addComments: null,
//   questions: [
//     {
//       title: 'Scope',
//       displayOrder: 1,
//       optionId: 'a0926000004WYHuAAO',
//       responseId: 'a07Ad00000IOZxkIAH',
//       comments: 'banana',
//       description: 'For each question score the project against the criteria from 1 to 5, providing a comment explaining your reason. Your Monitoring Portfolio Executive will return the report to you otherwise.',
//       isScored: true,
//       options: [Array]
//     },
//     {
//       title: 'Time',
//       displayOrder: 2,
//       optionId: 'a0926000004WYI0AAO',
//       responseId: null,
//       comments: 'cheese',
//       description: null,
//       isScored: true,
//       options: [Array]
//     },
//     {
//       title: 'Cost',
//       displayOrder: 3,
//       optionId: '',
//       responseId: null,
//       comments: '',
//       description: null,
//       isScored: true,
//       options: [Array]
//     },
//     {
//       title: 'Exploitation',
//       displayOrder: 4,
//       optionId: '',
//       responseId: null,
//       comments: '',
//       description: null,
//       isScored: true,
//       options: [Array]
//     },
//     {
//       title: 'Risk management',
//       displayOrder: 5,
//       optionId: '',
//       responseId: null,
//       comments: '',
//       description: null,
//       isScored: true,
//       options: [Array]
//     },
//     {
//       title: 'Project planning',
//       displayOrder: 6,
//       optionId: '',
//       responseId: null,
//       comments: '',
//       description: null,
//       isScored: true,
//       options: [Array]
//     },
//     {
//       title: 'Summary',
//       displayOrder: 7,
//       optionId: 'a0926000004WYIMAA4',
//       responseId: 'a07Ad00000IOln3IAD',
//       comments: '',
//       description: "Please summarise the project's key achievements and the key issues and risks that it faces.",
//       isScored: false,
//       options: [Array]
//     },
//     {
//       title: 'Issues and actions',
//       displayOrder: 8,
//       optionId: 'a0926000004WYINAA4',
//       responseId: 'a07Ad00000IOln4IAD',
//       comments: '',
//       description: 'Please confirm any specific issues that require Technology Strategy Board intervention - e.g. apparent scope change, partner changes, budget virements or time extensions.',
//       isScored: false,
//       options: [Array]
//     }
//   ]
// }
// this.submit false
