import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { getNextAddPartnerStep } from "./addPartnerUtils";
import { AwardRateSchemaType, getAwardRateSchema } from "@ui/pages/pcrs/addPartner/steps/schemas/awardRate.zod";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class PcrItemAddPartnerAwardRateHandler extends ZodFormHandlerBase<
  AwardRateSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerAwardRateStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ input }: { input: AnyObject }) {
    return {
      schema: getAwardRateSchema(input.markedAsComplete === "true"),
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<AwardRateSchemaType>> {
    return {
      form: input.form,
      button_submit: input.button_submit,
      markedAsComplete: input.markedAsComplete,
      awardRate: input.awardRate,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<AwardRateSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_AwardRate__c: input.awardRate,
    });

    return await getNextAddPartnerStep({
      projectId: params.projectId,
      pcrId: params.pcrId,
      pcrItemId: params.itemId,
      context,
      toSummary: input.button_submit === "returnToSummary",
      stepNumber: params.step,
    });
  }
}
