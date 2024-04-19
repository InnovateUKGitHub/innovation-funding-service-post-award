import { Authorisation } from "@framework/types/authorisation";
import { IAccessControlOptions } from "@framework/types/IAccessControlOptions";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { H1 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { defineRoute } from "@ui/containers/containerBase";
import { PageCrasher } from "./PageCrasher";

const PageCrasherPage = () => {
  return (
    <Page isActive pageTitle={<H1>Page Crasher</H1>}>
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
