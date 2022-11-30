import { Authorisation } from "@framework/types";
import { Content, H1, NavigationCard, NavigationCardsGrid, Page } from "@ui/components";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";
import { IClientConfig } from "@ui/redux/reducers/configReducer";

import { graphql } from "react-relay";
import { useQuery } from "relay-hooks";
import { homeSiteOptionsQuery } from "./__generated__/homeSiteOptionsQuery.graphql";

const SiteOptionsQuery = graphql`
  query homeSiteOptionsQuery {
    clientConfig {
      ifsRoot
    }
  }
`;

const DeveloperHomePage = (props: BaseProps) => {
  const { getContent } = useContent();
  const { data } = useQuery<homeSiteOptionsQuery>(SiteOptionsQuery, {});

  console.log(data?.clientConfig.ifsRoot);

  return (
    <Page pageTitle={<H1>{data?.clientConfig.ifsRoot ?? "Home"}</H1>}>
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
