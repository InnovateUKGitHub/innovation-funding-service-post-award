import { IContext } from "@framework/types/IContext";
import { Clock } from "@framework/util/clock";
import { parseCurrency } from "@framework/util/numberHelper";
import { configuration } from "@server/features/common/config";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { ClaimDetailDocumentsRoute } from "@ui/pages/claims/claimDetailDocuments.page";
import { ClaimLineItemsParams, EditClaimLineItemsRoute } from "@ui/pages/claims/claimLineItems/EditClaimLineItems.page";
import {
  EditClaimLineItemLineItemSchemaType,
  EditClaimLineItemsSchemaType,
  editClaimLineItemErrorMap,
  editClaimLineItemsSchema,
} from "@ui/pages/claims/claimLineItems/editClaimLineItems.zod";
import { PrepareClaimRoute } from "@ui/pages/claims/claimPrepare.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

type ExistingItem = {
  id: ClaimId;
  description: string;
  value: string | null;
};

type NewItem = {
  id: null | undefined | "";
  description: string;
  value: string | null;
};

const isNotEmptyField = (x: string | undefined | null) => typeof x === "string" && x.trim() !== "";

const clock = new Clock();

class EditClaimLineItemsFormHandler extends ZodFormHandlerBase<EditClaimLineItemsSchemaType, ClaimLineItemsParams> {
  constructor() {
    super({
      routes: [EditClaimLineItemsRoute],
      forms: [FormTypes.ClaimLineItemSaveAndQuit, FormTypes.ClaimLineItemSaveAndDocuments],
    });
  }

  public readonly acceptFiles = false;

  public async getZodSchema() {
    return {
      schema: editClaimLineItemsSchema,
      errorMap: editClaimLineItemErrorMap,
    };
  }

  protected async mapToZod({
    input,
    context,
    params,
  }: {
    input: AnyObject;
    context: IContext;
    params: ClaimLineItemsParams;
  }): Promise<z.input<EditClaimLineItemsSchemaType>> {
    const initialLineItemsFromSf = await context.repositories.claimLineItems.getAllForCategory(
      params.partnerId,
      params.costCategoryId,
      params.periodId,
    );
    const initialLineItems = initialLineItemsFromSf.map(x => ({
      id: x.Id,
      description: x.Acc_LineItemDescription__c,
      value: String(x.Acc_LineItemCost__c),
      createdDate: clock.parseRequiredSalesforceDateTime(x.CreatedDate),
    }));

    const lineItems: z.input<EditClaimLineItemLineItemSchemaType>[] = [];

    // Loop until we cannot find line items, or we reach the claim line item limit
    for (let i = 0; i < configuration.options.maxClaimLineItems; i++) {
      const id = input[`lineItems.${i}.id`];
      const description = input[`lineItems.${i}.description`];
      const value = input[`lineItems.${i}.value`];

      if (isNotEmptyField(description) || isNotEmptyField(value)) {
        lineItems.push({
          id,
          description,
          value,
        });
      }

      // If we find an invalid claim line item, we don't break, in case
      // the item afterwards is valid.
    }

    const deletedClaimItems = initialLineItems
      .filter(x => !lineItems.find(y => x.id == y.id))
      .map(x => x.id) as ClaimId[];

    return {
      id: input.id || null,
      form: input.form,
      comments: input.comments,
      lineItems,
      deletedClaimItems,
      initialLineItems,
    };
  }

  private isExistingItem = (item: ExistingItem | NewItem): item is ExistingItem => !!item.id;

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<EditClaimLineItemsSchemaType>;
    context: IContext;
    params: ClaimLineItemsParams;
  }): Promise<string> {
    const updatedLineItems = input.lineItems
      .filter(this.isExistingItem)
      .filter(x => {
        const matchedItem = input.initialLineItems.find(y => y.id === x.id);
        return matchedItem?.description !== x.description || matchedItem?.value !== x.value;
      })
      .map(x => ({
        Id: x.id as ClaimId,
        Acc_LineItemDescription__c: x.description,
        Acc_LineItemCost__c: parseCurrency(x.value),
      }));

    const newLineItems = input.lineItems
      .filter(x => !this.isExistingItem(x))
      .map(x => ({
        Acc_LineItemDescription__c: x.description,
        Acc_LineItemCost__c: parseCurrency(x.value),
        Acc_ProjectParticipant__c: params.partnerId,
        Acc_ProjectPeriodNumber__c: params.periodId,
        Acc_CostCategory__c: params.costCategoryId,
      }));

    await Promise.all([
      !!input.id
        ? context.repositories.claimDetails.update({
            Acc_ReasonForDifference__c: input.comments,
            Id: input.id,
          })
        : context.repositories.claimDetails.insert({
            Acc_ReasonForDifference__c: input.comments,
            Acc_ProjectParticipant__r: {
              Id: params.partnerId,
              Acc_ProjectId__c: params.projectId,
            },
            Acc_ProjectPeriodNumber__c: params.periodId,
            Acc_CostCategory__c: params.costCategoryId,
            Acc_PeriodCostCategoryTotal__c: 0,
          }),
      context.repositories.claimLineItems.update(updatedLineItems),
      context.repositories.claimLineItems.insert(newLineItems),
      context.repositories.claimLineItems.delete(input.deletedClaimItems),
    ]);

    if (input.form === FormTypes.ClaimLineItemSaveAndDocuments) {
      return ClaimDetailDocumentsRoute.getLink(params).path;
    }
    return PrepareClaimRoute.getLink(params).path;
  }
}

export { EditClaimLineItemsFormHandler };
