import { Authorisation } from "@framework/types/authorisation";
import { IAccessControlOptions } from "@framework/types/IAccessControlOptions";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { H1 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { defineRoute } from "@ui/containers/containerBase";
import { UserSwitcher } from "./UserSwitcher";

const UserSwitcherPage = () => {
  return (
    <Page isActive pageTitle={<H1>User Switcher</H1>}>
      <UserSwitcher />
    </Page>
  );
};

export const DeveloperUserSwitcherPage = defineRoute({
  routeName: "userSwitcherPage",
  routePath: "/developer/userswitcher",
  container: UserSwitcherPage,
  getParams: () => ({}),
  accessControl: (auth: Authorisation, params: EmptyObject, options: IAccessControlOptions) => !options.ssoEnabled,
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.home.title),
});
