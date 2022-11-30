import { Authorisation } from "@framework/types";
import { Content, H1, NavigationCard, NavigationCardsGrid, Page } from "@ui/components";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";
import { IClientConfig } from "@ui/redux/reducers/configReducer";

const DeveloperHomePage = (props: BaseProps) => {
  const { getContent } = useContent();

  return (
    <Page pageTitle={<H1>{getContent(x => x.pages.home.title)}</H1>}>
      <NavigationCardsGrid>
        <NavigationCard
          label={<Content value={x => x.pages.home.projectsHeading} />}
          route={props.routes.projectDashboard.getLink({ search: undefined, arrayFilters: undefined })}
          qa="projects-dashboard"
          key="projects-dashboard"
          messages={[
            { message: getContent(x => x.pages.home.projectsDashboardHeading), qa: "projects-dashboard-label" },
          ]}
        />
        <NavigationCard
          label={<Content value={x => x.example.contentTitle} />}
          route={HomeRoute.getLink({})}
          qa="example-content"
          key="example-content"
          messages={[{ message: getContent(x => x.example.content), qa: "example-content-label" }]}
        />
      </NavigationCardsGrid>
    </Page>
  );
};

export const HomeRoute = defineRoute({
  routeName: "home",
  routePath: "/",
  container: DeveloperHomePage,
  getParams: () => ({}),
  accessControl: (auth: Authorisation, params: EmptyObject, config: IClientConfig) => !config.ssoEnabled,
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.home.title),
});
