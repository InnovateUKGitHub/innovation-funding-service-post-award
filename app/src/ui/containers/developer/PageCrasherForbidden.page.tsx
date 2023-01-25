import { defineRoute } from "@ui/containers/containerBase";

export const DeveloperPageCrasherForbiddenPage = defineRoute({
  routeName: "developerPageCrasherPage",
  routePath: "/developer/forbiddenCrash",
  container: () => null,
  getParams: () => ({}),
  accessControl: () => false,
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.home.title),
});
