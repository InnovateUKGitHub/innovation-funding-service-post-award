import { graphql, useFragment } from "relay-hooks";
import { ProjectContactLinksFragment$key } from "./__generated__/ProjectContactLinksFragment.graphql";

const fragment = graphql`
  fragment ProjectContactLinksFragment on accProjectCustom {
    name
  }
`;

const useProjectContactLinksFragment = (project: ProjectContactLinksFragment$key) => {
  return useFragment(fragment, project);
};

export { useProjectContactLinksFragment };
