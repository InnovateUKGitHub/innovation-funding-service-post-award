import { FragmentContextProvider } from "@gql/utils/fragmentContextHook";
import { useLazyLoadQuery } from "react-relay";
import { projectSuspensionMessageQuery } from "./ProjectSuspensionMessage.query";
import { ProjectSuspensionMessageWithFragment } from "./ProjectSuspensionMessage.withFragment";
import { ProjectSuspensionMessageWithFragmentProps } from "./ProjectSuspsensionMessage";
import { ProjectSuspensionMessageQuery } from "./__generated__/ProjectSuspensionMessageQuery.graphql";
import { QueryOptions } from "@testing-library/react";

interface ProjectSuspensionMessageStandaloneProps extends ProjectSuspensionMessageWithFragmentProps {
  queryOptions?: QueryOptions;
}

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
