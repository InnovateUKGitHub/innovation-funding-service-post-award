import { CacheOptions } from "./cache";

const goToPage = (page: string) => {
  cy.intercept("/internationalisation/**").as("i18n");

  cy.visit(Cypress.config().baseUrl + page, {
    auth: {
      username: Cypress.env("USERNAME"),
      password: Cypress.env("PASSWORD"),
    },
    failOnStatusCode: false,
  });

  cy.wait(["@i18n"]);
  cy.wait(1000);
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
      cy.selectProjectCard(ctx.userInfo.project.number);
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
      cy.selectTile("Documents");
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
