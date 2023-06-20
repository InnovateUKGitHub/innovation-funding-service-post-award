import { Authorisation } from "@framework/types/authorisation";
import { IAccessControlOptions } from "@framework/types/IAccessControlOptions";
import { Page } from "@ui/components/layout/page";
import { H1 } from "@ui/components/typography/Heading.variants";
import { defineRoute } from "@ui/containers/containerBase";
import { UserSwitcher } from "./UserSwitcher";

const UserSwitcherPage = () => {
  return (
    <Page pageTitle={<H1>User Switcher</H1>}>
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
