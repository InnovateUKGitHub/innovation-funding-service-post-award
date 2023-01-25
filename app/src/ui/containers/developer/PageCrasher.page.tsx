import { Authorisation } from "@framework/types";
import { H1, Page } from "@ui/components";
import { defineRoute } from "@ui/containers/containerBase";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { PageCrasher } from "./PageCrasher";

const PageCrasherPage = () => {
  return (
    <Page pageTitle={<H1>Page Crasher</H1>}>
      <PageCrasher />
    </Page>
  );
};

export const DeveloperPageCrasherPage = defineRoute({
  routeName: "developerPageCrasherPage",
  routePath: "/developer/crash",
  container: PageCrasherPage,
  getParams: () => ({}),
  accessControl: (auth: Authorisation, params: EmptyObject, config: IClientConfig) => !config.ssoEnabled,
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.home.title),
});
