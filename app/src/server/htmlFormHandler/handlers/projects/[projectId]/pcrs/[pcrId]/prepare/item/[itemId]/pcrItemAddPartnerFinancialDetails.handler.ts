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
  FinanceDetailsSchemaType,
  getFinanceDetailsSchema,
} from "@ui/containers/pages/pcrs/addPartner/steps/schemas/financialDetails.zod";
import { combineDate } from "@ui/components/atoms/Date";
import { parseCurrency } from "@framework/util/numberHelper";

export class PcrItemAddPartnerFinancialDetailsHandler extends ZodFormHandlerBase<
  FinanceDetailsSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerFinancialDetailsStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ input }: { input: AnyObject }) {
    return {
      schema: getFinanceDetailsSchema(input.markedAsComplete === "true"),
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<FinanceDetailsSchemaType>> {
    return {
      form: input.form,
      markedAsComplete: input.markedAsComplete,
      button_submit: input.button_submit,
      financialYearEndDate_month: input.financialYearEndDate_month,
      financialYearEndDate_year: input.financialYearEndDate_year,
      financialYearEndTurnover: input.financialYearEndTurnover,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<FinanceDetailsSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    await updatePcrItem({
      params,
      context,
      data: {
        financialYearEndDate: combineDate(input.financialYearEndDate_month, input.financialYearEndDate_year, false),
        financialYearEndTurnover: parseCurrency(input.financialYearEndTurnover),
      },
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
