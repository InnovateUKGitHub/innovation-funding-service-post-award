import { useServerInput } from "@framework/api-helpers/useZodErrors";
import { FormTypes } from "@ui/zod/FormTypes";
import { useMemo } from "react";
import { ManageTeamMembersTableData } from "./ManageTeamMember.logic";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { BaseManageTeamMemberValidatorSchema } from "./BaseManageTeamMember.zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useRoutes } from "@ui/context/routesProvider";
import { FieldValues } from "react-hook-form";
import { clientsideApiClient } from "@ui/apiClient";
import { useFetchKey } from "@ui/context/FetchKeyProvider";

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

interface BaseManageTeamMemberProps {
  projectId: ProjectId;
  pcrId: PcrId;
  pclId?: ProjectContactLinkId;
  role: ManageTeamMemberRole;
}

interface BaseManageTeamMemberData {
  method: ManageTeamMemberMethod;
}

interface ManageTeamMemberCreateProps extends BaseManageTeamMemberProps {
  pclId: undefined;
}

interface ManageTeamMemberReplaceProps extends BaseManageTeamMemberProps {
  pclId: ProjectContactLinkId | undefined;
}

interface ManageTeamMemberUpdateDeleteProps extends BaseManageTeamMemberProps {
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

const useOnBaseManageTeamMemberSubmit = ({ projectId, pcrId }: { projectId: ProjectId; pcrId: PcrId }) => {
  const navigate = useNavigate();
  const routes = useRoutes();
  const [, setFetchKey] = useFetchKey();

  return useOnUpdate<z.output<BaseManageTeamMemberValidatorSchema>, unknown, EmptyObject>({
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
            contact: {
              contactId: data.contactId,
              id: data.pclId,
              firstName: data.firstName,
              lastName: data.lastName,
              form: data.form,
            },
          });
        }

        case FormTypes.ProjectManageTeamMembersDelete:
          {
          }
          break;
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

export {
  BaseManageTeamMemberData,
  BaseManageTeamMemberProps,
  ManageTeamMemberCreateProps,
  ManageTeamMemberMethod,
  ManageTeamMemberMethods,
  ManageTeamMemberReplaceProps,
  ManageTeamMemberRole,
  ManageTeamMemberRoles,
  ManageTeamMemberUpdateDeleteProps,
  useManageTeamMembersDefault,
  useOnBaseManageTeamMemberSubmit,
};
