// fixtures.ts
import { test as base } from "playwright-bdd";
import { DeveloperHomepage } from "./pages/DeveloperHomepage";
import { ProjectDashboard } from "./pages/ProjectDashboard";
import { AccProjectBase } from "./projectFactory/AccProjectBase";
import { ProjectFactoryHelloWorld } from "./projectFactory/ProjectFactoryHelloWorld";
import { AccNavigation } from "./AccNavigation";
import { ProjectState } from "./projectFactory/ProjectState";
import { ProjectOverview } from "./pages/ProjectOverview";
import { ProjectForecasts } from "./pages/ProjectForecasts";
import { Commands } from "./CypressCommands";
import { ViewForecast } from "./pages/ViewForecast";

type AccFixtures = {
  // Pages
  developerHomepage: DeveloperHomepage;
  projectDashboard: ProjectDashboard;
  projectOverview: ProjectOverview;
  projectForecasts: ProjectForecasts;
  viewForecast: ViewForecast;

  // Project Factory
  accProjectBase: AccProjectBase;
  projectFactoryHelloWorld: ProjectFactoryHelloWorld;

  // Misc
  accNavigation: AccNavigation;
  projectState: ProjectState;
  commands: Commands;
};

export const test = base.extend<AccFixtures>({
  // Pages
  developerHomepage: ({ page }, use) => use(new DeveloperHomepage({ page })),
  projectDashboard: ({ page }, use) => use(new ProjectDashboard({ page })),
  projectOverview: ({ page }, use) => use(new ProjectOverview({ page })),
  projectForecasts: ({ page, commands }, use) => use(new ProjectForecasts({ page, commands })),
  viewForecast: ({ page, commands }, use) => use(new ViewForecast({ page, commands })),

  // Project Factory
  accProjectBase: ({ page, playwright, projectState }, use) =>
    use(new AccProjectBase({ page, playwright, projectState })),
  projectFactoryHelloWorld: ({ page, playwright, projectState }, use) =>
    use(new ProjectFactoryHelloWorld({ page, playwright, projectState })),

  // Misc
  accNavigation: (
    { page, developerHomepage, projectDashboard, projectOverview, projectForecasts, projectState },
    use,
  ) =>
    use(
      new AccNavigation({ page, developerHomepage, projectDashboard, projectOverview, projectForecasts, projectState }),
    ),
  projectState: ({}, use) => use(new ProjectState()),
  commands: ({ page }, use) => use(new Commands({ page })),
});

export { AccFixtures };
