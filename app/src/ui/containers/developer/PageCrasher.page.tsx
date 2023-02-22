import { Authorisation } from "@framework/types";
import { IAccessControlOptions } from "@framework/types/IAccessControlOptions";
import { H1, Page } from "@ui/components";
import { defineRoute } from "@ui/containers/containerBase";
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
  accessControl: (auth: Authorisation, params: EmptyObject, options: IAccessControlOptions) => !options.ssoEnabled,
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.home.title),
});
