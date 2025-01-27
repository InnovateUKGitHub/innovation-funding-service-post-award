import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { getNextAddPartnerStep } from "./addPartnerUtils";
import { set } from "lodash";

import {
  AcademicCostsSchemaType,
  getAcademicCostsSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/academicCosts.zod";
import { parseCurrency } from "@framework/util/numberHelper";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class PcrItemAddPartnerAcademicCostsHandler extends ZodFormHandlerBase<
  AcademicCostsSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerAcademicCostsStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema({ input }: { input: AnyObject }) {
    return {
      schema: getAcademicCostsSchema(input.markedAsComplete === "true"),
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<AcademicCostsSchemaType>> {
    const data: {
      costs: {
        value: string;
        id: string;
        costCategory: string;
        costCategoryId: string;
        description: string;
      }[];
    } = {
      costs: [],
    };

    Object.keys(input)
      .filter(x => /costs/.test(x))
      .forEach(key => {
        const [, i, field] = key.split(".");
        let index: number;
        if (/\d+/.test(i)) {
          index = parseInt(i);
        } else {
          throw new Error("Unable to parse costs data");
        }

        set(data, `costs.${index}.${field}`, input[key]);
      });

    const costs = data.costs.map(x => ({
      ...x,
      costCategory: Number(x.costCategory),
      value: x.value,
    }));

    return {
      form: input.form,
      markedAsComplete: input.markedAsComplete === "true",
      tsbReference: input.tsbReference,
      button_submit: input.button_submit,
      costs,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<AcademicCostsSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    const newCostItems = input.costs
      .filter(x => !x.id)
      .map(x => ({ ...x, value: parseCurrency(x.value), pcrItemId: params.itemId }));
    const updatedCostItems = input.costs
      .filter(x => !!x.id)
      .map(x => ({ ...x, value: parseCurrency(x.value), pcrItemId: params.itemId, id: x.id as CostId }));

    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_TSBReference__c: input.tsbReference,
    });

    await context.repositories.pcrSpendProfile.insertSpendProfiles(newCostItems);
    await context.repositories.pcrSpendProfile.updateSpendProfiles(updatedCostItems);

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
