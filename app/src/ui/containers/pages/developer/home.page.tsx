import { Authorisation } from "@framework/types/authorisation";
import { IAccessControlOptions } from "@framework/types/IAccessControlOptions";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page";
import { NavigationCardsGrid, NavigationCard } from "@ui/components/molecules/NavigationCard/navigationCard";
import { H1 } from "@ui/components/atoms/Heading/Heading.variants";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";

const DeveloperHomePageContainer = (props: BaseProps) => {
  const { getContent } = useContent();

  return (
    <Page isActive pageTitle={<H1>{getContent(x => x.pages.home.title)}</H1>}>
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
          route={DeveloperHomePage.getLink({})}
          qa="example-content"
          key="example-content"
          messages={[{ message: getContent(x => x.example.content), qa: "example-content-label" }]}
        />
      </NavigationCardsGrid>
    </Page>
  );
};

export const DeveloperHomePage = defineRoute({
  routeName: "home",
  routePath: "/",
  container: DeveloperHomePageContainer,
  getParams: () => ({}),
  accessControl: (auth: Authorisation, params: EmptyObject, options: IAccessControlOptions) => !options.ssoEnabled,
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.home.title),
});
