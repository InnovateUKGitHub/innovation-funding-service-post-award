import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import { useFragment } from "react-relay";
import { projectSuspensionMessageFragment } from "./ProjectSuspensionMessage.fragment";
import {
  ProjectSuspensionMessageFragment$key,
  ProjectSuspensionMessageFragment$data,
} from "./__generated__/ProjectSuspensionMessageFragment.graphql";
import { ProjectSuspensionMessage, ProjectSuspensionMessageWithFragmentProps } from "./ProjectSuspsensionMessage";
import { ProjectSuspensionMessageStandalone } from "./ProjectSuspensionMessage.standalone";

const ProjectSuspensionMessageWithFragment = ({ projectId, partnerId }: ProjectSuspensionMessageWithFragmentProps) => {
  const fragmentRef = useFragmentContext();

  if (!isValidFragmentKey<ProjectSuspensionMessageFragment$key>(fragmentRef, "ProjectSuspensionMessageFragment")) {
    throw new Error("Project Suspension Message is missing a ProjectSuspensionMessageFragment reference");
  }

  const fragment: ProjectSuspensionMessageFragment$data = useFragment(projectSuspensionMessageFragment, fragmentRef);

  const projectNode = getFirstEdge(fragment?.query?.ProjectSuspensionProject?.edges).node;

  const project = mapToProjectDto(projectNode, ["status", "roles"]);
  const partners = mapToPartnerDtoArray(
    projectNode?.Acc_ProjectParticipantsProject__r?.edges ?? [],
    ["id", "partnerStatus", "isFlagged"],
    {},
  );

  return <ProjectSuspensionMessage project={project} partners={partners} projectId={projectId} partnerId={partnerId} />;
};

const ProjectSuspensionMessageWithOptionalFragment = ({
  projectId,
  partnerId,
}: ProjectSuspensionMessageWithFragmentProps) => {
  const fragmentRef = useFragmentContext();

  if (isValidFragmentKey<ProjectSuspensionMessageFragment$key>(fragmentRef, "ProjectSuspensionMessageFragment")) {
    return <ProjectSuspensionMessageStandalone projectId={projectId} partnerId={partnerId} />;
  } else {
    return <ProjectSuspensionMessageWithFragment projectId={projectId} partnerId={partnerId} />;
  }
};

export { ProjectSuspensionMessageWithFragment, ProjectSuspensionMessageWithOptionalFragment };
