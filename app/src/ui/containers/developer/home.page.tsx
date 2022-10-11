import { Authorisation } from "@framework/types";
import * as ACC from "@ui/components";
import { H1, Page } from "@ui/components";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { UserChanger } from "./UserChanger";

const DeveloperHomePage = (props: BaseProps) => {
  const { getContent } = useContent();

  return (
    <Page pageTitle={<H1>Home</H1>}>
      <ACC.NavigationCardsGrid>
        <ACC.NavigationCard
          label={<ACC.Content value={x => x.home.projectsHeading} />}
          route={props.routes.projectDashboard.getLink({ search: undefined, arrayFilters: undefined })}
          qa="projects-dashboard"
          key="projects-dashboard"
          messages={[{ message: getContent(x => x.home.projectsDashboardHeading), qa: "projects-dashboard-label" }]}
        />
        <ACC.NavigationCard
          label={<ACC.Content value={x => x.home.exampleContentTitle} />}
          route={HomeRoute.getLink({})}
          qa="example-content"
          key="example-content"
          messages={[{ message: getContent(x => x.home.exampleContent), qa: "example-content-label" }]}
        />
      </ACC.NavigationCardsGrid>

      <UserChanger />
    </Page>
  );
};

export const HomeRoute = defineRoute({
  routeName: "home",
  routePath: "/",
  container: DeveloperHomePage,
  getParams: () => ({}),
  accessControl: (auth: Authorisation, params: {}, config: IClientConfig) => !config.ssoEnabled,
  getTitle: x => x.content.home.title(),
});
