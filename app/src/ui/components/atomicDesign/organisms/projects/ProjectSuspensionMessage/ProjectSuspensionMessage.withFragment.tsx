import { useFragmentContext } from "@gql/utils/fragmentContextHook";
import { isValidFragmentKey } from "@gql/utils/isValidFragmentKey";
import {
  ProjectSuspensionMessageWithFragmentProps,
  useProjectSuspensionMessageWithFragmentData,
} from "./ProjectSuspensionMessage.logic";
import { ProjectSuspensionMessageStandalone } from "./ProjectSuspensionMessage.standalone";
import { ProjectSuspensionMessage } from "./ProjectSuspsensionMessage";
import { ProjectSuspensionMessageFragment$key } from "./__generated__/ProjectSuspensionMessageFragment.graphql";

const ProjectSuspensionMessageWithFragment = ({ projectId, partnerId }: ProjectSuspensionMessageWithFragmentProps) => {
  const fragmentRef = useFragmentContext();
  const { project, partners } = useProjectSuspensionMessageWithFragmentData(fragmentRef);

  return <ProjectSuspensionMessage project={project} partners={partners} projectId={projectId} partnerId={partnerId} />;
};

const ProjectSuspensionMessageWithOptionalFragment = ({
  projectId,
  partnerId,
}: ProjectSuspensionMessageWithFragmentProps) => {
  const fragmentRef = useFragmentContext();

  if (isValidFragmentKey<ProjectSuspensionMessageFragment$key>(fragmentRef, "ProjectSuspensionMessageFragment")) {
    return <ProjectSuspensionMessageWithFragment projectId={projectId} partnerId={partnerId} />;
  } else {
    return <ProjectSuspensionMessageStandalone projectId={projectId} partnerId={partnerId} />;
  }
};

export { ProjectSuspensionMessageWithFragment, ProjectSuspensionMessageWithOptionalFragment };