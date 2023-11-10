const goToPage = (page: string) => {
  cy.intercept("/internationalisation/**").as("i18n");

  cy.visit(Cypress.config().baseUrl + page, {
    auth: {
      username: Cypress.env("USERNAME"),
      password: Cypress.env("PASSWORD"),
    },
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

const goToProjectOverview = (ctx: SirtestalotContext) => {
  cy.goToProjectsDashboard();

  if (!ctx.userInfo.project) {
    throw new Error("This user does not have an associated project");
  }

  cy.selectProjectCard(ctx.userInfo.project.number);
  cy.waitForPageHeading("Project overview");
};

const goToMspDocumentShare = (ctx: SirtestalotContext) => {
  cy.goToProjectOverview(ctx);
  cy.selectTile("Documents");
  cy.waitForPageHeading("Project documents");
};

const goToBroadcastPage = () => {
  cy.goToProjectsDashboard();
  cy.get("a").contains("Read me").click();
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
