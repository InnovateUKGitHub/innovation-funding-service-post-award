import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

const PREFIX = Cypress.env("PREFIX") ?? "";
const lowercasePrefix = PREFIX.toLowerCase();

const changeUser = (info: LoginInfo): Parameters<typeof Given>[1] => {
  return function () {
    cy.log("**changeUser**", info);

    cy.intercept(Cypress.config().baseUrl + "/**", req => {
      req.headers["x-acc-userswitcher"] = info.username;
      req.continue();
    });

    this.userInfo = info;
  };
};

{
  Given("the user is the PM", function () {
    cy.recallProject().then(project => {
      project.pcl.find(x => x.role === "");
    });
  });

  Given(
    "the user is the FC",
    changeUser({
      username: lowercasePrefix + "autoimport.canada@innovateuk.gov.uk",
      project,
      partner,
    }),
  );

  Given(
    "the user is the MO",
    changeUser({
      username: lowercasePrefix + "autoimport.denmark@innovateuk.gov.uk",
      project,
      partner,
    }),
  );
}

Given(
  "I am the system user",
  changeUser({
    username: null,
    project: null,
    partner: null,
  }),
);

Then("I should be logged in as {string}", (username: string) => {
  cy.contains("Currently logged in as: " + username);
});
