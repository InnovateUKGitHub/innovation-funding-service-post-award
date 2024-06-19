import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import {
  PCRPrepareItemRoute,
  ProjectChangeRequestPrepareItemParams,
} from "@ui/containers/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

import { addPartnerErrorMap } from "@ui/containers/pages/pcrs/addPartner/addPartnerSummary.zod";
import { getNextAddPartnerStep, updatePcrItem } from "./addPartnerUtils";
import {
  AwardRateSchemaType,
  getAwardRateSchema,
} from "@ui/containers/pages/pcrs/addPartner/steps/schemas/awardRate.zod";

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
    await updatePcrItem({ params, context, data: input });

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
