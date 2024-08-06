import { ProjectRole } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import mutationChecksums from "./mutationChecksums.json";

type AccessControlParams = { projectId: ProjectId; partnerId: PartnerId };
type AccessControlTester = (auth: Authorisation, params: AccessControlParams) => boolean;
type AccessControl = Record<string, AccessControlTester>;

const allowPmForProject: AccessControlTester = (auth, { projectId }) =>
  auth.forProject(projectId).hasRole(ProjectRole.ProjectManager);

const allowPmOrFcForProjectAndPartner: AccessControlTester = (auth, { projectId, partnerId }) =>
  auth.forPartner(projectId, partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager);

export const accessControl = {
  [mutationChecksums.PcrModifyOptionsCreateHeaderMutation]: allowPmForProject,
  [mutationChecksums.PcrModifyOptionsCreateMutation]: allowPmForProject,
  [mutationChecksums.PcrModifyOptionsCreateMultipleMutation]: allowPmForProject,
  [mutationChecksums.PcrItemUpdateMutation]: allowPmForProject,
  [mutationChecksums.PartnerDetailsEditMutation]: allowPmOrFcForProjectAndPartner,
} satisfies AccessControl;

type MutationName = keyof typeof accessControl;

const isMatchedMutation = (mutationName: string | MutationName): mutationName is MutationName =>
  mutationName in accessControl;

export const hasAccess = (mutationName: string, auth: Authorisation, params: AccessControlParams) => {
  if (!mutationName) {
    return false;
  }

  if (isMatchedMutation(mutationName)) {
    return accessControl[mutationName](auth, params);
  }

  return false;
};
