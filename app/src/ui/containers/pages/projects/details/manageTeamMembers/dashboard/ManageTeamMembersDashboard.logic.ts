import { mapToContactDtoArray } from "@gql/dtoMapper/mapContactDto";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { ManageTeamMembersDashboardQuery } from "./__generated__/ManageTeamMembersDashboardQuery.graphql";
import { manageTeamMembersDashboardQuery } from "./ManageTeamMembersDashboard.query";
import { useMemo } from "react";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { PartnerDto } from "@framework/dtos/partnerDto";

interface ManageTeamMembersDashboardParams {
  projectId: ProjectId;
}

type PclData = Pick<ProjectContactDto, "accountId" | "contactId" | "id" | "name" | "role">;
type PartnerData = Pick<PartnerDto, "accountId" | "id" | "name">;

interface ManageTeamMembersDashboardTableData {
  pclId: ProjectContactLinkId;
  pcl: PclData;
  partner: PartnerData;
}

const useManageTeamMembersDashboardQuery = ({ projectId }: { projectId: ProjectId }) => {
  const data = useLazyLoadQuery<ManageTeamMembersDashboardQuery>(
    manageTeamMembersDashboardQuery,
    { projectId },
    {
      fetchPolicy: "store-and-network",
    },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const partnersGql = projectNode?.Acc_ProjectParticipantsProject__r?.edges ?? [];
  const contactsGql = projectNode?.Project_Contact_Links__r?.edges ?? [];

  const partners = mapToPartnerDtoArray(partnersGql, ["id", "name", "accountId"], {});

  const pcls = mapToContactDtoArray(contactsGql, ["accountId", "contactId", "id", "role", "name"]);

  const categories = useMemo(() => {
    const cats = {
      pm: [] as ManageTeamMembersDashboardTableData[],
      fc: [] as ManageTeamMembersDashboardTableData[],
      ass: [] as ManageTeamMembersDashboardTableData[],
      mcc: [] as ManageTeamMembersDashboardTableData[],
    };

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
            cats.pm.push(data);
            break;
          case "Finance contact":
            cats.fc.push(data);
            break;
          case "Associate":
            cats.ass.push(data);
            break;
          case "Main Company Contact":
            cats.mcc.push(data);
            break;
        }
      }
    }

    return cats;
  }, [pcls, partners]);

  return { partners, pcls, categories, fragmentRef: data?.salesforce?.uiapi };
};

export { ManageTeamMembersDashboardParams, useManageTeamMembersDashboardQuery, ManageTeamMembersDashboardTableData };
