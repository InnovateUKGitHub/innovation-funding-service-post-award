import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { getNextAddPartnerStep } from "./addPartnerUtils";
import {
  OtherSourcesOfFundingSchemaType,
  otherSourcesOfFundingSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/otherSourcesOfFunding.zod";
import { set } from "lodash";
import { combineDate } from "@ui/components/atoms/Date";
import { parseCurrency } from "@framework/util/numberHelper";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class PcrItemAddPartnerOtherSourcesOfFundingHandler extends ZodFormHandlerBase<
  OtherSourcesOfFundingSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  deletedIds: CostId[] = [];
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
        costId: string;
        costCategory: number;
        costCategoryId: string;
        id: "";
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

    this.deletedIds = data.funds
      .filter(x => !!x.costId && (!x.description || !x.value || !x.dateSecured_month || !x.dateSecured_year))
      .map(x => x.costId as CostId);

    const funds = data.funds
      .filter(x => !!x.description || !!x.value || !!x.dateSecured_month || !!x.dateSecured_year)
      .map(x => ({
        ...x,
        id: "",
        costCategory: Number(x.costCategory),
        value: x.value,
        dateSecured: combineDate(x.dateSecured_month, x.dateSecured_year, false),
      }));

    return {
      form: input.form,
      button_submit: input.button_submit,
      deletedCostsOrFunds: [],
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
    const newFundItems = input.funds
      .filter(x => !x.costId)
      .map(x => ({
        ...x,
        value: parseCurrency(x.value),
        pcrItemId: params.itemId,
        dateOtherFundingSecured: combineDate(x.dateSecured_month, x.dateSecured_year, false)?.toISOString(),
      }));

    const updatedFundItems = input.funds
      .filter(x => !!x.costId)
      .map(x => ({
        ...x,
        value: parseCurrency(x.value),
        pcrItemId: params.itemId,
        dateOtherFundingSecured: combineDate(x.dateSecured_month, x.dateSecured_year, false)?.toISOString(),
        id: x.costId,
      }));

    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
    });

    await context.repositories.pcrSpendProfile.insertSpendProfiles(newFundItems);
    await context.repositories.pcrSpendProfile.updateSpendProfiles(updatedFundItems);
    await context.repositories.pcrSpendProfile.deleteSpendProfiles(this.deletedIds);

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
