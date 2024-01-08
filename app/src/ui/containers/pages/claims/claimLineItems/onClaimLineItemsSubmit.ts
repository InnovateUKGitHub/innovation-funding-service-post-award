import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { parseCurrency, validCurrencyRegex } from "@framework/util/numberHelper";
import { clientsideApiClient } from "@ui/apiClient";
import { EditClaimLineItemsSchemaType } from "@ui/containers/pages/claims/claimLineItems/editClaimLineItems.zod";
import { useRoutes } from "@ui/redux/routesProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";

export const useOnClaimLineItemsSubmit = <Inputs extends z.output<EditClaimLineItemsSchemaType>>() => {
  const navigate = useNavigate();
  const routes = useRoutes();

  return useOnUpdate<Inputs, unknown>({
    async req(data) {
      const { projectId, partnerId, periodId, costCategoryId, comments, lineItems } = data;
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

      await clientsideApiClient.claimDetails.saveClaimDetails({
        projectId,
        partnerId,
        periodId,
        costCategoryId,
        claimDetails: {
          comments,
          partnerId,
          periodId,
          costCategoryId,
          lineItems: mappedLineItems,
        } as unknown as ClaimDetailsDto,
      });
    },
    onSuccess(data) {
      const { projectId, partnerId, costCategoryId, periodId, form } = data;

      switch (form) {
        case FormTypes.ClaimLineItemSaveAndQuit:
          navigate(routes.prepareClaim.getLink({ projectId, partnerId, periodId }).path);
          break;
        case FormTypes.ClaimLineItemSaveAndDocuments:
          navigate(routes.claimDetailDocuments.getLink({ projectId, partnerId, periodId, costCategoryId }).path);
          break;
      }
    },
  });
};
