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
  OtherSourcesOfFundingSchemaType,
  otherSourcesOfFundingSchema,
} from "@ui/containers/pages/pcrs/addPartner/steps/schemas/otherSourcesOfFunding.zod";
import { set } from "lodash";
import { combineDate } from "@ui/components/atomicDesign/atoms/Date";
import { parseCurrency } from "@framework/util/numberHelper";
import { PcrSpendProfileDto } from "@framework/dtos/pcrSpendProfileDto";
import { GetPcrSpendProfilesQuery } from "@server/features/pcrs/getPcrSpendProfiles";

export class PcrItemAddPartnerOtherSourcesOfFundingHandler extends ZodFormHandlerBase<
  OtherSourcesOfFundingSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerOtherSourcesOfFundingStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: otherSourcesOfFundingSchema,
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<OtherSourcesOfFundingSchemaType>> {
    const data: {
      funds: {
        description: string;
        value: string;
        dateSecured_month: string;
        dateSecured_year: string;
        id: string;
        costCategory: number;
        costCategoryId: string;
      }[];
    } = {
      funds: [],
    };

    Object.keys(input)
      .filter(x => /funds/.test(x))
      .forEach(key => {
        const [, i, field] = key.split(".");
        let index: number;
        if (/\d+/.test(i)) {
          index = parseInt(i);
        } else {
          throw new Error("Unable to parse funds data");
        }

        set(data, `funds.${index}.${field}`, input[key]);
      });

    const funds = data.funds
      .filter(x => !!x.description || !!x.value || !!x.dateSecured_month || !!x.dateSecured_year)
      .map(x => ({
        ...x,
        costCategory: Number(x.costCategory),
        value: parseCurrency(x.value),
        dateSecured: combineDate(x.dateSecured_month, x.dateSecured_year, false),
      }));

    return {
      form: input.form,
      itemsLength: input.itemsLength,
      button_submit: input.button_submit,
      funds,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<OtherSourcesOfFundingSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    const spendProfile = await context.runQuery(new GetPcrSpendProfilesQuery(params.projectId, params.itemId));

    await updatePcrItem({
      params,
      context,
      data: {
        spendProfile: {
          ...spendProfile,
          funds: input.funds.map(x => ({ ...x, value: Number(x.value) })) as PcrSpendProfileDto["funds"],
        },
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
