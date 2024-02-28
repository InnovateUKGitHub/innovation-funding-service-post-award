import { mapToContactDtoArray } from "@gql/dtoMapper/mapContactDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { useLazyLoadQuery } from "react-relay";
import { contactSetupAssociateQuery } from "./ContactSetupAssociate.query";
import { ContactSetupAssociateQuery } from "./__generated__/ContactSetupAssociateQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { ContactSetupAssociateSchemaType } from "./ContactSetupAssociate.zod";
import { z } from "zod";
import { clientsideApiClient } from "@ui/apiClient";

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
  return useOnUpdate<z.output<ContactSetupAssociateSchemaType>, unknown>({
    req(data) {
      console.log("wahwah", data);

      return clientsideApiClient.projectContacts.update({
        projectId,
        contacts: Object.entries(data.contacts).map(([key, value]) => ({
          id: key as ContactId,
          startDate: value?.startDate ?? null,
        })),
      });
    },
  });
};

export { ContactSetupAssociateParams, useContactSetupAssociatePageData, useOnContactSetupAssociateSubmit };
