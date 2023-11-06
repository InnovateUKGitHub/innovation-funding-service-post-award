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
  const project = {
    number: PREFIX + "001001",
    title: "ACC-9810 / KTP Project",
  };

  const partner = {
    title: "ACC-9810 / Account 1",
  };

  Given(
    "the user is a PMFC Hybrid",
    changeUser({
      username: lowercasePrefix + "autoimport.austria@innovateuk.gov.uk",
      project,
      partner,
    }),
  );

  Given(
    "the user is an FC",
    changeUser({
      username: lowercasePrefix + "autoimport.belgium@innovateuk.gov.uk",
      project,
      partner,
    }),
  );

  Given(
    "the user is an MO",
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
