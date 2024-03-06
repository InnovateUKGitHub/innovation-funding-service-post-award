import { FragmentContextProvider } from "@gql/utils/fragmentContextHook";
import { useLazyLoadQuery } from "react-relay";
import { ProjectSuspensionMessageStandaloneProps } from "./ProjectSuspensionMessage.logic";
import { projectSuspensionMessageQuery } from "./ProjectSuspensionMessage.query";
import { ProjectSuspensionMessageWithFragment } from "./ProjectSuspensionMessage.withFragment";
import { ProjectSuspensionMessageQuery } from "./__generated__/ProjectSuspensionMessageQuery.graphql";

const ProjectSuspensionMessageStandalone = ({
  projectId,
  partnerId,
  queryOptions,
}: ProjectSuspensionMessageStandaloneProps) => {
  const data = useLazyLoadQuery<ProjectSuspensionMessageQuery>(
    projectSuspensionMessageQuery,
    { projectId },
    queryOptions,
  );

  return (
    <FragmentContextProvider fragment={data.salesforce.uiapi}>
      <ProjectSuspensionMessageWithFragment projectId={projectId} partnerId={partnerId} />
    </FragmentContextProvider>
  );
};

export { ProjectSuspensionMessageStandalone };
