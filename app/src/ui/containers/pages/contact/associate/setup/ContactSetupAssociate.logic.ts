import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { mapToContactDtoArray } from "@gql/dtoMapper/mapContactDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { clientsideApiClient } from "@ui/apiClient";
import { useRoutes } from "@ui/redux/routesProvider";
import { useLazyLoadQuery } from "react-relay";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { contactSetupAssociateQuery } from "./ContactSetupAssociate.query";
import { ContactSetupAssociateSchemaType } from "./ContactSetupAssociate.zod";
import { ContactSetupAssociateQuery } from "./__generated__/ContactSetupAssociateQuery.graphql";

interface ContactSetupAssociateParams {
  projectId: ProjectId;
}

const useContactSetupAssociatePageData = ({ projectId }: ContactSetupAssociateParams) => {
  const data = useLazyLoadQuery<ContactSetupAssociateQuery>(
    contactSetupAssociateQuery,
    { projectId },
    {
      fetchPolicy: "store-and-network",
    },
  );

  const projectNode = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges).node;

  const project = mapToProjectDto(projectNode, ["projectNumber", "title", "startDate", "endDate"]);

  const contacts = mapToContactDtoArray(projectNode?.Project_Contact_Links__r?.edges ?? [], [
    "id",
    "email",
    "name",
    "startDate",
    "endDate",
  ]);

  return { project, contacts };
};

const useOnContactSetupAssociateSubmit = ({ projectId }: ContactSetupAssociateParams) => {
  const routes = useRoutes();
  const navigateTo = useNavigate();

  return useOnUpdate<z.output<ContactSetupAssociateSchemaType>, unknown>({
    req(data) {
      return clientsideApiClient.projectContacts.update({
        projectId,
        contacts: data.contacts,
      });
    },
    onSuccess() {
      navigateTo(routes.projectDashboard.getLink({}).path);
    },
  });
};

export { ContactSetupAssociateParams, useContactSetupAssociatePageData, useOnContactSetupAssociateSubmit };
