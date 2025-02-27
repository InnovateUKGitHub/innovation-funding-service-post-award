import { clientsideApiClient } from "@ui/apiClient";
import { EditClaimLineItemsSchemaType } from "@ui/pages/claims/claimLineItems/editClaimLineItems.zod";
import { useRoutes } from "@ui/context/routesProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";

export const useOnClaimLineItemsSubmit = ({
  projectId,
  partnerId,
  periodId,
  costCategoryId,
}: {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
  costCategoryId: CostCategoryId;
}) => {
  const navigate = useNavigate();
  const routes = useRoutes();

  return useOnUpdate<z.output<EditClaimLineItemsSchemaType>, unknown>({
    async req(data) {
      await clientsideApiClient.claimDetails.updateClaimLineItems({
        projectId,
        partnerId,
        periodId,
        costCategoryId,
        claimDetails: data,
      });
    },
    onSuccess(data) {
      const { form } = data;

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
