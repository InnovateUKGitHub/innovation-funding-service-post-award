import { Authorisation } from "@framework/types/authorisation";
import { IAccessControlOptions } from "@framework/types/IAccessControlOptions";
import { Page } from "@ui/components/layout/page";
import { H1 } from "@ui/components/typography/Heading.variants";
import { defineRoute } from "@ui/containers/containerBase";
import { ProjectCreator } from "./ProjectCreator";

const ProjectCreatorPage = () => {
  return (
    <Page pageTitle={<H1>Project Creator</H1>}>
      <ProjectCreator />
    </Page>
  );
};

export const DeveloperProjectCreatorPage = defineRoute({
  routeName: "projectCreatorPage",
  routePath: "/developer/projectcreator",
  container: ProjectCreatorPage,
  getParams: () => ({}),
  accessControl: (auth: Authorisation, params: EmptyObject, options: IAccessControlOptions) => !options.ssoEnabled,
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.home.title),
});
