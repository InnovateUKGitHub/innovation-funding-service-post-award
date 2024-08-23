import { mapToContactDtoArray, ProjectContactDtoGql } from "@gql/dtoMapper/mapContactDto";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { ManageTeamMembersQuery } from "./__generated__/ManageTeamMembersQuery.graphql";
import { manageTeamMembersQuery } from "./ManageTeamMembers.query";
import { useMemo } from "react";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ManageTeamMemberRole } from "./BaseManageTeamMember.logic";

type PclData = Pick<
  ProjectContactDtoGql,
  "accountId" | "contactId" | "id" | "name" | "role" | "email" | "firstName" | "lastName"
>;
type PartnerData = Pick<PartnerDto, "accountId" | "id" | "name">;

interface ManageTeamMembersTableData {
  pclId: ProjectContactLinkId;
  pcl: PclData;
  partner: PartnerData;
  role: ManageTeamMemberRole;
}

const useManageTeamMembersQuery = ({ projectId }: { projectId: ProjectId }) => {
  const data = useLazyLoadQuery<ManageTeamMembersQuery>(
    manageTeamMembersQuery,
    { projectId },
    {
      fetchPolicy: "store-and-network",
    },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const partnersGql = projectNode?.Acc_ProjectParticipantsProject__r?.edges ?? [];
  const contactsGql = projectNode?.Project_Contact_Links__r?.edges ?? [];

  const partners = mapToPartnerDtoArray(partnersGql, ["id", "name", "accountId"], {});

  const pcls = mapToContactDtoArray(contactsGql, [
    "accountId",
    "contactId",
    "id",
    "role",
    "name",
    "email",
    "firstName",
    "lastName",
  ]);

  const { collated, categories } = useMemo(() => {
    const cats = {
      projectManagers: [] as ManageTeamMembersTableData[],
      financeContacts: [] as ManageTeamMembersTableData[],
      associates: [] as ManageTeamMembersTableData[],
      mainCompanyContacts: [] as ManageTeamMembersTableData[],
      knowledgeBaseAdministrators: [] as ManageTeamMembersTableData[],
    } satisfies Record<ManageTeamMemberRole, ManageTeamMembersTableData[]>;
    const collated = new Map<ProjectContactLinkId, ManageTeamMembersTableData>();

    const accountToProjectParticipantMap = new Map<AccountId, PartnerData>();

    for (const partner of partners) {
      accountToProjectParticipantMap.set(partner.accountId, partner);
    }

    for (const pcl of pcls) {
      const partner = pcl.accountId && accountToProjectParticipantMap.get(pcl.accountId);

      if (partner) {
        const data = {
          pclId: pcl.id,
          pcl,
          partner,
        };

        switch (pcl.role) {
          case "Project Manager":
            cats.projectManagers.push({ ...data, role: ManageTeamMemberRole.PROJECT_MANAGER });
            collated.set(pcl.id, { ...data, role: ManageTeamMemberRole.PROJECT_MANAGER });
            break;
          case "Finance contact":
            cats.financeContacts.push({ ...data, role: ManageTeamMemberRole.FINANCE_CONTACT });
            collated.set(pcl.id, { ...data, role: ManageTeamMemberRole.FINANCE_CONTACT });
            break;
          case "Associate":
            cats.associates.push({ ...data, role: ManageTeamMemberRole.ASSOCIATE });
            collated.set(pcl.id, { ...data, role: ManageTeamMemberRole.ASSOCIATE });
            break;
          case "Main Company Contact":
            cats.mainCompanyContacts.push({ ...data, role: ManageTeamMemberRole.MAIN_COMPANY_CONTACT });
            collated.set(pcl.id, { ...data, role: ManageTeamMemberRole.MAIN_COMPANY_CONTACT });
            break;
          case "KB Admin":
            cats.knowledgeBaseAdministrators.push({ ...data, role: ManageTeamMemberRole.KNOWLEDGE_BASE_ADMINISTRATOR });
            collated.set(pcl.id, { ...data, role: ManageTeamMemberRole.KNOWLEDGE_BASE_ADMINISTRATOR });
            break;
        }
      }
    }

    return { collated, categories: cats };
  }, [pcls, partners]);

  return { partners, pcls, categories, collated, fragmentRef: data?.salesforce?.uiapi };
};

export { useManageTeamMembersQuery, ManageTeamMembersTableData };
