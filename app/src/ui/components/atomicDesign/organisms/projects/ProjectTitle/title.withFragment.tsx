import { useFragmentContext } from "@gql/fragmentContextHook";
import { Title as TitleComponent } from "./title";
import { isValidFragmentKey } from "@gql/isValidFragmentKey";
import { TitleFragment$data, TitleFragment$key } from "./__generated__/TitleFragment.graphql";
import { useFragment } from "react-relay";
import { titleFragment } from "./Title.fragment";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";

export const Title = ({ heading }: { heading?: string }) => {
  const fragmentRef = useFragmentContext();
  if (!isValidFragmentKey<TitleFragment$key>(fragmentRef, "ProjectTitleFragment")) {
    throw new Error("Title is missing a ProjectTitleFragment reference");
  }

  const fragment: TitleFragment$data = useFragment(titleFragment, fragmentRef);

  const { node: projectNode } = getFirstEdge(fragment?.query?.Title_Project?.edges);

  const project = mapToProjectDto(projectNode, ["projectNumber", "title"]);

  return <TitleComponent projectNumber={project.projectNumber} title={project.title} heading={heading} />;
};
