import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { IContext } from "@framework/types/IContext";
import { parseCurrency, validCurrencyRegex } from "@framework/util/numberHelper";
import { SaveClaimDetails } from "@server/features/claimDetails/saveClaimDetailsCommand";
import { configuration } from "@server/features/common/config";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { ClaimDetailDocumentsRoute } from "@ui/containers/pages/claims/claimDetailDocuments.page";
import {
  ClaimLineItemsParams,
  EditClaimLineItemsRoute,
} from "@ui/containers/pages/claims/claimLineItems/EditClaimLineItems.page";
import {
  EditClaimLineItemLineItemSchemaType,
  EditClaimLineItemsSchemaType,
  editClaimLineItemErrorMap,
  editClaimLineItemsSchema,
} from "@ui/containers/pages/claims/claimLineItems/editClaimLineItems.zod";
import { PrepareClaimRoute } from "@ui/containers/pages/claims/claimPrepare.page";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

const isNotEmptyField = (x: string | undefined | null) => typeof x === "string" && x.trim() !== "";

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

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<EditClaimLineItemsSchemaType>> {
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

    return {
      form: input.form,
      partnerId: input.partnerId,
      projectId: input.projectId,
      costCategoryId: input.costCategoryId,
      periodId: input.periodId,
      comments: input.comments,
      lineItems,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<EditClaimLineItemsSchemaType>;
    context: IContext;
    params: ClaimLineItemsParams;
  }): Promise<string> {
    const { projectId, partnerId, periodId, costCategoryId, comments, lineItems } = input;

    const mappedLineItems = lineItems.map(lineItem => {
      const numberComponent = validCurrencyRegex.exec(lineItem.value ?? "")?.[0] ?? "";

      return {
        ...lineItem,
        periodId,
        partnerId,
        costCategoryId,
        value: parseCurrency(numberComponent),
      };
    });

    await context.runCommand(
      new SaveClaimDetails(projectId, partnerId, periodId, costCategoryId, {
        comments,
        partnerId,
        periodId,
        costCategoryId,
        lineItems: mappedLineItems,
      } as unknown as ClaimDetailsDto),
    );

    if (input.form === FormTypes.ClaimLineItemSaveAndDocuments) {
      return ClaimDetailDocumentsRoute.getLink(params).path;
    }

    return PrepareClaimRoute.getLink(params).path;
  }
}

export { EditClaimLineItemsFormHandler };
