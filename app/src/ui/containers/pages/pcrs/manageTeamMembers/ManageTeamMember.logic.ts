import { mapToContactDtoArray, ProjectContactDtoGql } from "@gql/dtoMapper/mapContactDto";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useLazyLoadQuery } from "react-relay";
import { ManageTeamMembersQuery } from "./__generated__/ManageTeamMembersQuery.graphql";
import { manageTeamMembersQuery } from "./ManageTeamMembers.query";
import { useMemo } from "react";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { useFetchKey } from "@ui/context/FetchKeyProvider";
import { useServerInput } from "@framework/api-helpers/useZodErrors";
import { FormTypes } from "@ui/zod/FormTypes";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { ManageTeamMemberValidatorSchema } from "./ManageTeamMember.zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useRoutes } from "@ui/context/routesProvider";
import { FieldValues } from "react-hook-form";
import { clientsideApiClient } from "@ui/apiClient";

/**
 * You know, CRUD...
 */
enum ManageTeamMemberMethod {
  CREATE = FormTypes.ProjectManageTeamMembersCreate,
  REPLACE = FormTypes.ProjectManageTeamMembersReplace,
  UPDATE = FormTypes.ProjectManageTeamMembersUpdate,
  DELETE = FormTypes.ProjectManageTeamMembersDelete,
}

enum ManageTeamMemberRole {
  PROJECT_MANAGER = "projectManagers",
  FINANCE_CONTACT = "financeContacts",
  MAIN_COMPANY_CONTACT = "mainCompanyContacts",
  ASSOCIATE = "associates",
  KNOWLEDGE_BASE_ADMINISTRATOR = "knowledgeBaseAdministrators",
}

const ManageTeamMemberMethods = [
  ManageTeamMemberMethod.CREATE,
  ManageTeamMemberMethod.REPLACE,
  ManageTeamMemberMethod.UPDATE,
  ManageTeamMemberMethod.DELETE,
];
const ManageTeamMemberRoles = [
  ManageTeamMemberRole.PROJECT_MANAGER,
  ManageTeamMemberRole.FINANCE_CONTACT,
  ManageTeamMemberRole.MAIN_COMPANY_CONTACT,
  ManageTeamMemberRole.ASSOCIATE,
  ManageTeamMemberRole.KNOWLEDGE_BASE_ADMINISTRATOR,
];

interface ManageTeamMemberProps {
  projectId: ProjectId;
  pcrId: PcrId;
  pclId?: ProjectContactLinkId;
  role: ManageTeamMemberRole;
}

interface ManageTeamMemberData {
  method: ManageTeamMemberMethod;
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

const getManageTeamMemberDefaults = ({
  pclId,
  collated,
  method,
  defaults,
}: {
  pclId?: ProjectContactLinkId;
  collated: Map<ProjectContactLinkId, ManageTeamMembersTableData>;
  method: ManageTeamMemberMethod;
  defaults: FieldValues | null;
}) => {
  const memberToManage = pclId && collated.get(pclId);

  let defaultProjectContactLink: ProjectContactLinkId | undefined = undefined;
  let defaultFirstName: string | undefined = undefined;
  let defaultLastName: string | undefined = undefined;
  let defaultProjectParticipantId: PartnerId | undefined = undefined;
  let defaultEmail: string | undefined;
  let hideBottomSection = false;

  switch (method) {
    case ManageTeamMemberMethod.CREATE:
      {
        defaultFirstName = defaults?.firstName ?? undefined;
        defaultLastName = defaults?.lastName ?? undefined;
        defaultProjectParticipantId = defaults?.partnerId ?? undefined;
        defaultEmail = defaults?.email ?? undefined;
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
    },
    hideBottomSection,
  };
};

const useManageTeamMembersDefault = ({
  pclId,
  collated,
  method,
}: {
  pclId?: ProjectContactLinkId;
  collated: Map<ProjectContactLinkId, ManageTeamMembersTableData>;
  method: ManageTeamMemberMethod;
}) => {
  const defaults = useServerInput();
  return useMemo(
    () => getManageTeamMemberDefaults({ pclId, collated, method, defaults }),
    [pclId, collated, method, defaults],
  );
};

const useOnManageTeamMemberSubmit = ({ projectId, pcrId }: { projectId: ProjectId; pcrId: PcrId }) => {
  const navigate = useNavigate();
  const routes = useRoutes();
  const [, setFetchKey] = useFetchKey();

  return useOnUpdate<z.output<ManageTeamMemberValidatorSchema>, unknown, EmptyObject>({
    req: async data => {
      switch (data.form) {
        case FormTypes.ProjectManageTeamMembersCreate:
          {
          }
          break;
        case FormTypes.ProjectManageTeamMembersReplace:
          {
          }
          break;
        case FormTypes.ProjectManageTeamMembersUpdate: {
          return await clientsideApiClient.projectContacts.updateContactDetails({
            projectId,
            pcrId: pcrId,
            contact: {
              contactId: data.contactId,
              id: data.pclId,
              firstName: data.firstName,
              lastName: data.lastName,
              form: data.form,
            },
          });
        }

        case FormTypes.ProjectManageTeamMembersDelete: {
          return await clientsideApiClient.projectContacts.removeContact({
            projectId,
            pcrId: pcrId,
            contact: {
              form: data.form,
              id: data.pclId,
            },
          });
        }
        default:
          throw new Error("Invalid manage team member action");
      }
    },
    onSuccess() {
      setFetchKey(x => x + 1);

      navigate(routes.manageTeamMembersConfirmationRoute.getLink({ projectId, pcrId }).path);
    },
  });
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
  role: ManageTeamMemberRole;
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

export {
  ManageTeamMemberData,
  ManageTeamMemberProps,
  ManageTeamMemberCreateProps,
  ManageTeamMemberMethod,
  ManageTeamMemberMethods,
  ManageTeamMemberReplaceProps,
  ManageTeamMemberRole,
  ManageTeamMemberRoles,
  ManageTeamMemberUpdateDeleteProps,
  useManageTeamMembersDefault,
  useOnManageTeamMemberSubmit,
  useManageTeamMembersQuery,
  ManageTeamMembersTableData,
};
