import { CacheOptions } from "./cache";

const goToPage = (page: string) => {
  cy.intercept("/internationalisation/**").as("i18n");

  cy.accTask("getSecret", { key: "BASIC_AUTH" }).then(basicAuth => {
    const [match, username, password] = /(\w+):(\w+)/.exec(basicAuth);

    if (!match) throw new Error("Could not read BASIC_AUTH env var");

    cy.visit(Cypress.config().baseUrl + page, {
      auth: {
        username,
        password,
      },
      failOnStatusCode: false,
    });
  });

  cy.wait(["@i18n"]);
  cy.get('[data-qa="react-loaded-indicator"]');
};

const waitForPageHeading = (title: string) => {
  return cy.getPageHeading(title, { timeout: Cypress.env("SALESFORCE_TIMEOUT") });
};

const goToDeveloperHomepage = () => {
  cy.goToPage("/");
};

const goToProjectsDashboard = () => {
  cy.goToPage("/projects/dashboard");
};

const goToProjectOverview = (ctx: SirtestalotContext, cacheOptions?: CacheOptions) => {
  if (!ctx.userInfo.project) {
    throw new Error("This user does not have an associated project");
  }

  cy.cache(
    ["goToProjectOverview", ctx.userInfo.project.number],
    () => {
      cy.goToProjectsDashboard();
      cy.getProjectDashboardCard({ projectNumber: ctx.userInfo.project.number }).click();
      cy.waitForPageHeading("Project overview").should("exist");
      return cy.location("pathname");
    },
    url => {
      cy.goToPage(url);
    },
    cacheOptions,
  );
};

const goToMspDocumentShare = (ctx: SirtestalotContext, cacheOptions?: CacheOptions) => {
  cy.cache(
    ["goToMspDocumentShare", ctx.userInfo.project.number],
    () => {
      cy.goToProjectOverview(ctx);
      cy.getTile({ label: "Documents" });
      cy.waitForPageHeading("Project documents").should("exist");
      return cy.location("pathname");
    },
    url => {
      cy.goToPage(url);
    },
    cacheOptions,
  );
};

const goToBroadcastPage = (cacheOptions?: CacheOptions) => {
  cy.cache(
    "goToBroadcastPage",
    () => {
      cy.goToProjectsDashboard();
      cy.get("a").contains("Read more").click();
      cy.waitForPageHeading("Cypress broadcast message").should("exist");
      return cy.location("pathname");
    },
    url => {
      cy.goToPage(url);
    },
    cacheOptions,
  );
};

const goToCommands = {
  waitForPageHeading,
  goToPage,
  goToDeveloperHomepage,
  goToProjectsDashboard,
  goToProjectOverview,
  goToMspDocumentShare,
  goToBroadcastPage,
};

export { goToCommands };
