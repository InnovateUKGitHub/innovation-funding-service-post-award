import { useLazyLoadQuery } from "react-relay";
import { projectSetupSpendProfileQuery } from "./ProjectSetupSpendProfile.query";
import { ProjectSetupSpendProfileQuery } from "./__generated__/ProjectSetupSpendProfileQuery.graphql";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { head } from "lodash";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { useNavigate } from "react-router-dom";
import { useRoutes } from "@ui/context/routesProvider";
import { z } from "zod";
import { clientsideApiClient } from "@ui/apiClient";
import { SetupSpendProfileSchemaType } from "./projectSetupSpendProfile.zod";

const useProjectSetupSpendProfileData = ({ partnerId, projectId }: { partnerId: PartnerId; projectId: ProjectId }) => {
  const data = useLazyLoadQuery<ProjectSetupSpendProfileQuery>(
    projectSetupSpendProfileQuery,
    { partnerId, projectId },
    { fetchPolicy: "network-only" },
  );

  const partnerPage = head(
    mapToPartnerDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges ?? [],
      ["spendProfileStatus"],
      {},
    ),
  );

  return {
    partnerPage,
    fragmentRef: data?.salesforce.uiapi,
  };
};

export const useOnInitialForecastUpdate = ({
  projectId,
  partnerId,
  refresh,
}: {
  projectId: ProjectId;
  partnerId: PartnerId;
  refresh?: () => Promise<void>;
}) => {
  const navigate = useNavigate();
  const routes = useRoutes();

  return useOnUpdate<z.output<SetupSpendProfileSchemaType>, boolean, null>({
    async req(data) {
      return await clientsideApiClient.initialForecastDetails.update({
        projectId,
        partnerId,
        forecasts: data,
      });
    },
    async onSuccess() {
      await refresh?.();

      navigate(routes.projectSetup.getLink({ projectId, partnerId }).path);
    },
  });
};

export { useProjectSetupSpendProfileData };
