import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

const PREFIX = Cypress.env("PREFIX") ?? "";

function changeUser(info: LoginInfo) {
  cy.log("**changeUser**", info);

  cy.intercept(Cypress.config().baseUrl + "/**", req => {
    req.headers["x-acc-userswitcher"] = info.username;
    req.continue();
  });

  return info;
}

{
  Given("the user is the PM", function () {
    const that = this;
    cy.recallProject().then(function (data) {
      const user = data.pcl.find(x => x.role === "Project Manager");
      that.userInfo = changeUser({
        username: user.username,
        partner: { title: user.participantName },
      });
    });
  });

  Given("the user is the FC", function () {
    const that = this;
    cy.recallProject().then(function (data) {
      const user = data.pcl.find(x => x.role === "Finance contact");
      that.userInfo = changeUser({
        username: user.username,
        partner: { title: user.participantName },
      });
    });
  });

  Given("the user is the MO", function () {
    const that = this;
    cy.recallProject().then(function (data) {
      const user = data.pcl.find(x => x.role === "Monitoring officer");
      that.userInfo = changeUser({
        username: user.username,
        partner: { title: user.participantName },
      });
    });
  });
}

Given("I am the system user", function () {
  this.userInfo = changeUser({
    username: null,
    partner: null,
  });
});

Then("I should be logged in as {string}", (username: string) => {
  cy.contains("Currently logged in as: " + username);
});
