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
import { Dispatch, SetStateAction, useState } from "react";

interface ContactSetupAssociateParams {
  projectId: ProjectId;
}

const useContactSetupAssociatePageData = ({ projectId }: ContactSetupAssociateParams) => {
  const [fetchKey, setFetchKey] = useState(0);
  const data = useLazyLoadQuery<ContactSetupAssociateQuery>(
    contactSetupAssociateQuery,
    { projectId },
    {
      fetchPolicy: "network-only",
      fetchKey,
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

  return { project, contacts, setFetchKey };
};

const useOnContactSetupAssociateSubmit = ({
  projectId,
  setFetchKey,
}: ContactSetupAssociateParams & { setFetchKey: Dispatch<SetStateAction<number>> }) => {
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
      setFetchKey(n => n + 1);
      navigateTo(routes.projectDashboard.getLink({}).path);
    },
  });
};

export { ContactSetupAssociateParams, useContactSetupAssociatePageData, useOnContactSetupAssociateSubmit };
