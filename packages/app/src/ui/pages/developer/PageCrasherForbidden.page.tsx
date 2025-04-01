import { defineRoute } from "@ui/app/containerBase";

export const DeveloperPageCrasherForbiddenPage = defineRoute({
  allowUnauthenticatedAccess: false,
  routeName: "developerPageCrasherPage",
  routePath: "/developer/forbiddenCrash",
  container: () => null,
  getParams: () => ({}),
  accessControl: () => false,
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.home.title),
});
