import { useServerInput } from "@framework/api-helpers/useZodErrors";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { mapToContactDtoArray, ProjectContactDtoGql } from "@gql/dtoMapper/mapContactDto";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { getDay, getMonth, getYear } from "@ui/components/atoms/Date";
import { useFetchKey } from "@ui/context/FetchKeyProvider";
import { useMemo } from "react";
import { FieldValues } from "react-hook-form";
import { useLazyLoadQuery } from "react-relay";
import { ManageTeamMembersQuery } from "./__generated__/ManageTeamMembersQuery.graphql";
import { manageTeamMembersQuery } from "./ManageTeamMembers.query";
import { ManageTeamMemberMethod } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/dtos/projectContactDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";

const ManageTeamMemberRoles = [
  ProjectRole.PROJECT_MANAGER,
  ProjectRole.FINANCE_CONTACT,
  ProjectRole.MAIN_COMPANY_CONTACT,
  ProjectRole.ASSOCIATE,
  ProjectRole.KNOWLEDGE_BASE_ADMINISTRATOR,
];

type ManageTeamMemberRole =
  | ProjectRole.PROJECT_MANAGER
  | ProjectRole.FINANCE_CONTACT
  | ProjectRole.MAIN_COMPANY_CONTACT
  | ProjectRole.ASSOCIATE
  | ProjectRole.KNOWLEDGE_BASE_ADMINISTRATOR;

interface ManageTeamMemberProps {
  projectId: ProjectId;
  pclId?: ProjectContactLinkId | "undefined"; // When JS is disabled, we get "undefined" as a string.
  role: ManageTeamMemberRole;
}

interface ManageTeamMemberData {
  method:
    | ManageTeamMemberMethod.CREATE
    | ManageTeamMemberMethod.REPLACE
    | ManageTeamMemberMethod.UPDATE
    | ManageTeamMemberMethod.DELETE;
}

interface ManageTeamMemberCreateProps extends ManageTeamMemberProps {
  pclId: undefined;
}

interface ManageTeamMemberReplaceProps extends ManageTeamMemberProps {
  pclId: ProjectContactLinkId | undefined;
}

interface ManageTeamMemberUpdateDeleteProps extends ManageTeamMemberProps {
  pclId: ProjectContactLinkId;
}

const getManageTeamMember = ({
  pclId,
  collated,
  method,
  role,
  partners,
  defaults,
}: {
  pclId?: ProjectContactLinkId;
  collated: Map<ProjectContactLinkId, ManageTeamMembersTableData>;
  method: ManageTeamMemberMethod;
  role: ProjectRole;
  partners: Pick<PartnerDto, "id" | "accountId" | "name" | "type">[];
  defaults: FieldValues | null;
}) => {
  const memberToManage = pclId && collated.get(pclId);

  let defaultProjectContactLink: ProjectContactLinkId | undefined = undefined;
  let defaultFirstName: string | undefined = undefined;
  let defaultLastName: string | undefined = undefined;
  let defaultProjectParticipantId: PartnerId | undefined = undefined;
  let defaultEmail: string | undefined;
  let defaultStartDay: string | undefined;
  let defaultStartMonth: string | undefined;
  let defaultStartYear: string | undefined;
  let hideBottomSection = false;
  let filteredPartners = partners;

  switch (method) {
    case ManageTeamMemberMethod.CREATE:
      {
        defaultFirstName = defaults?.firstName ?? undefined;
        defaultLastName = defaults?.lastName ?? undefined;
        defaultProjectParticipantId = defaults?.partnerId ?? undefined;
        defaultEmail = defaults?.email ?? undefined;
        defaultStartDay =
          defaults?.startDate && "day" in defaults?.startDate ? defaults?.startDate.day : getDay(defaults?.startDate);
        defaultStartMonth =
          defaults?.startDate && "month" in defaults?.startDate
            ? defaults?.startDate.month
            : getMonth(defaults?.startDate);
        defaultStartYear =
          defaults?.startDate && "year" in defaults?.startDate
            ? defaults?.startDate.year
            : getYear(defaults?.startDate);
        if (role === ProjectRole.ASSOCIATE || role === ProjectRole.KNOWLEDGE_BASE_ADMINISTRATOR) {
          filteredPartners = filteredPartners.filter(x => x.type === "Knowledge base");
        }
        if (role === ProjectRole.MAIN_COMPANY_CONTACT) {
          filteredPartners = filteredPartners.filter(x => x.type !== "Knowledge base");
        }
      }
      break;
    case ManageTeamMemberMethod.REPLACE:
      {
        defaultProjectContactLink = defaults?.pclId ?? memberToManage?.pclId ?? undefined;
        defaultFirstName = defaults?.firstName ?? undefined;
        defaultLastName = defaults?.lastName ?? undefined;
        defaultEmail = defaults?.email ?? undefined;

        // Can only submit if there is a member to manage;
        hideBottomSection = !memberToManage;
      }
      break;
    case ManageTeamMemberMethod.UPDATE:
      {
        defaultFirstName = defaults?.firstName ?? memberToManage?.pcl.firstName;
        defaultLastName = defaults?.lastName ?? memberToManage?.pcl?.lastName;
      }
      break;
  }

  return {
    memberToManage,
    defaults: {
      pclId: defaultProjectContactLink,
      firstName: defaultFirstName,
      lastName: defaultLastName,
      projectParticipantId: defaultProjectParticipantId,
      email: defaultEmail,
      startDay: defaultStartDay,
      startMonth: defaultStartMonth,
      startYear: defaultStartYear,
    },
    hideBottomSection,
    filteredPartners,
  };
};

const useManageTeamMembers = ({
  pclId,
  collated,
  method,
  role,
  partners,
}: {
  pclId?: ProjectContactLinkId;
  collated: Map<ProjectContactLinkId, ManageTeamMembersTableData>;
  method: ManageTeamMemberMethod;
  role: ProjectRole;
  partners: Pick<PartnerDto, "id" | "accountId" | "name" | "type">[];
}) => {
  const defaults = useServerInput();
  return useMemo(
    () => getManageTeamMember({ pclId, collated, method, partners, role, defaults }),
    [pclId, collated, method, defaults],
  );
};

type PclData = Pick<
  ProjectContactDtoGql,
  "accountId" | "contactId" | "id" | "name" | "role" | "email" | "firstName" | "lastName"
>;
type PartnerData = Pick<PartnerDto, "accountId" | "id" | "name">;

interface ManageTeamMembersTableData {
  pclId: ProjectContactLinkId;
  pcl: PclData;
  partner: PartnerData;
  role: ProjectRole;
}

const useManageTeamMembersQuery = ({ projectId }: { projectId: ProjectId }) => {
  const [fetchKey] = useFetchKey();
  const data = useLazyLoadQuery<ManageTeamMembersQuery>(
    manageTeamMembersQuery,
    { projectId },
    {
      fetchPolicy: "network-only",
      fetchKey,
    },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const partnersGql = projectNode?.Acc_ProjectParticipantsProject__r?.edges ?? [];
  const contactsGql = projectNode?.Project_Contact_Links__r?.edges ?? [];

  const project = mapToProjectDto(projectNode, ["competitionType"]);
  const partners = mapToPartnerDtoArray(partnersGql, ["id", "name", "accountId", "type"], {});

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
            cats.projectManagers.push({ ...data, role: ProjectRole.PROJECT_MANAGER });
            collated.set(pcl.id, { ...data, role: ProjectRole.PROJECT_MANAGER });
            break;
          case "Finance contact":
            cats.financeContacts.push({ ...data, role: ProjectRole.FINANCE_CONTACT });
            collated.set(pcl.id, { ...data, role: ProjectRole.FINANCE_CONTACT });
            break;
          case "Associate":
            cats.associates.push({ ...data, role: ProjectRole.ASSOCIATE });
            collated.set(pcl.id, { ...data, role: ProjectRole.ASSOCIATE });
            break;
          case "Main Company Contact":
            cats.mainCompanyContacts.push({ ...data, role: ProjectRole.MAIN_COMPANY_CONTACT });
            collated.set(pcl.id, { ...data, role: ProjectRole.MAIN_COMPANY_CONTACT });
            break;
          case "KB Admin":
            cats.knowledgeBaseAdministrators.push({ ...data, role: ProjectRole.KNOWLEDGE_BASE_ADMINISTRATOR });
            collated.set(pcl.id, { ...data, role: ProjectRole.KNOWLEDGE_BASE_ADMINISTRATOR });
            break;
        }
      }
    }

    return { collated, categories: cats };
  }, [pcls, partners]);

  return { project, partners, pcls, categories, collated, fragmentRef: data?.salesforce?.uiapi };
};

export {
  getManageTeamMember as getManageTeamMember,
  ManageTeamMemberCreateProps,
  ManageTeamMemberData,
  ManageTeamMemberProps,
  ManageTeamMemberReplaceProps,
  ManageTeamMemberRoles,
  ManageTeamMemberRole,
  ManageTeamMembersTableData,
  ManageTeamMemberUpdateDeleteProps,
  useManageTeamMembers,
  useManageTeamMembersQuery,
};
