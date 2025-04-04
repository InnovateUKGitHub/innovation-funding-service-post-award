import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { isNil } from "lodash";
import {
  RemovePartnerSchema,
  removePartnerSchema,
  removePartnerErrorMap,
} from "@ui/pages/pcrs/removePartner/removePartner.zod";
import { handlePcrItemStatus } from "@server/repositories/projectChangeRequestRepository";

export class PcrItemChangeRemovePartnerHandler extends ZodFormHandlerBase<
  RemovePartnerSchema,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrRemovePartnerStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({}: { params: ProjectChangeRequestPrepareItemParams }) {
    return {
      schema: removePartnerSchema,
      errorMap: removePartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<RemovePartnerSchema>> {
    return {
      numberOfPeriods: Number(input.numberOfPeriods),
      form: input.form,
      partnerId: input.partnerId ?? null,
      removalPeriod: input.removalPeriod || null,
      markedAsComplete: input.markedAsComplete === "on",
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<RemovePartnerSchema>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams & { step?: number };
  }): Promise<string> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: handlePcrItemStatus(
        FormTypes.PcrRemovePartnerSummary,
        input.markedAsComplete,
        input.form,
      ),
      Acc_RemovalPeriod__c: input.removalPeriod,
      Acc_Project_Participant__c: input.partnerId,
    });

    return PCRPrepareItemRoute.getLink({
      projectId: params.projectId,
      pcrId: params.pcrId,
      itemId: params.itemId,
      step: isNil(params.step) ? undefined : Number(params.step) + 1,
    }).path;
  }
}
