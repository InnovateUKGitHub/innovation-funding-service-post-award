import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import {
  ProjectSuspensionSchema,
  pcrProjectSuspensionErrorMap,
  projectSuspensionSchema,
} from "@ui/pages/pcrs/suspendProject/suspendProject.zod";
import { combineDate } from "@ui/components/atoms/Date";
import { GetByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { Clock } from "@framework/util/clock";

const clock = new Clock();
export class PcrItemPutProjectOnHoldHandler extends ZodFormHandlerBase<
  ProjectSuspensionSchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrProjectSuspensionStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: projectSuspensionSchema,
      errorMap: pcrProjectSuspensionErrorMap,
    };
  }

  protected async mapToZod({
    input,
    context,
    params,
  }: {
    input: AnyObject;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<z.input<ProjectSuspensionSchema>> {
    const project = await context.runQuery(new GetByIdQuery(params.projectId));

    return {
      form: input.form,
      suspensionStartDate_month: input.suspensionStartDate_month,
      suspensionStartDate_year: input.suspensionStartDate_year,
      suspensionEndDate_month: input.suspensionEndDate_month,
      suspensionEndDate_year: input.suspensionEndDate_year,
      suspensionEndDate: "",
      suspensionStartDate: "",
      markedAsComplete: input.markedAsComplete === "on",
      projectEndDate: project.endDate,
      projectStartDate: project.startDate,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<ProjectSuspensionSchema>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_SuspensionStarts__c: clock.formatOptionalSalesforceDate(
        combineDate(input.suspensionStartDate_month, input.suspensionStartDate_year, true),
      ),
      Acc_SuspensionEnds__c: clock.formatOptionalSalesforceDate(
        combineDate(input.suspensionEndDate_month, input.suspensionEndDate_year, false),
      ),
    });

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      step: undefined,
    }).path;
  }
}
