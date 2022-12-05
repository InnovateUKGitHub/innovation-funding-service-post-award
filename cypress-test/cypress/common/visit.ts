// const testUrl = process.env.TEST_URL || "http://localhost:8080"
const testUrl = process.env.TEST_URL || "https://www-acc-dev.apps.ocp4.innovateuk.ukri.org";

export const visitApp = (path: string = "") => {
  cy.visit(`${testUrl}/${path}`);
};
