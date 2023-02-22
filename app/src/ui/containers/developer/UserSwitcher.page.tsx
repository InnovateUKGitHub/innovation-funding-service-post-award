import { Authorisation } from "@framework/types";
import { IAccessControlOptions } from "@framework/types/IAccessControlOptions";
import { H1, Page } from "@ui/components";
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
