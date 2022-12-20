import { projectRolesQuery } from "@gql/query/ProjectRolesQuery";
import { ProjectRolesQuery } from "@gql/query/__generated__/ProjectRolesQuery.graphql";
import { useQuery } from "relay-hooks";

interface IRoleInfo {
  isMo: boolean;
  isFc: boolean;
  isPm: boolean;
}

interface AllRoles {
  [key: string]: ProjectRoles | undefined;
}

interface ProjectRoles {
  projectRoles: IRoleInfo;
  partnerRoles: {
    [key: string]: IRoleInfo | undefined;
  };
}

const useProjectRolesFragment = (): AllRoles => {
  const { data, isLoading } = useQuery<ProjectRolesQuery>(projectRolesQuery);

  const roles: AllRoles = {};

  if (isLoading || !data) {
    return roles;
  }

  /**
   * The default value for isMo, isFc and isPm is true if we are the system user.
   */
  const defaultValue = data.currentUser.isSystemUser;

  for (const project of data.accProjectCustom) {
    const projectRole: ProjectRoles = {
      projectRoles: {
        isMo: defaultValue,
        isFc: defaultValue,
        isPm: defaultValue,
      },
      partnerRoles: {},
    };

    if (project.projectContactLinksReference) {
      for (const partner of project.projectContactLinksReference) {
        if (partner?.accAccountIdCustom?.id) {
          const partnerId = partner.accAccountIdCustom.id;

          // Initialise the partnerRoles for this project if required.
          // Otherwise, reuse the existing one.
          projectRole.partnerRoles[partnerId] = projectRole.partnerRoles[partnerId] ?? {
            isMo: defaultValue,
            isFc: defaultValue,
            isPm: defaultValue,
          };

          if (partner.accContactIdCustom?.email === data.currentUser.email) {
            switch (partner.accRoleCustom) {
              case "Monitoring officer":
                projectRole.projectRoles.isMo = true;
                break;
              case "Finance contact":
                projectRole.projectRoles.isFc = true;
                break;
              case "Project Manager":
                projectRole.projectRoles.isPm = true;
                break;
            }
          }
        }
      }
    }

    if (project.accProjectParticipantsProjectReference) {
      // For each project participant of the project...
      for (const participant of project.accProjectParticipantsProjectReference) {
        if (participant?.accAccountIdCustom?.id) {
          const partnerId = participant.accAccountIdCustom.id;
          const partnerRoles = projectRole.partnerRoles[partnerId];

          if (partnerRoles) {
            if (projectRole.projectRoles.isFc) {
              partnerRoles.isFc = true;
            }
            if (projectRole.projectRoles.isPm && participant.accProjectRoleCustom === "Lead") {
              partnerRoles.isPm = true;
            }
          }
        }
      }
    }

    roles[project.id] = projectRole;
  }

  return roles;
};

export { useProjectRolesFragment };
export type { AllRoles, ProjectRoles };
