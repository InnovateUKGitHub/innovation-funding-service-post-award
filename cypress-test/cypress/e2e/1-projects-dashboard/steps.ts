const projectCardCss = '[data-qa="pending-and-open-projects"] .acc-list-item';
const testProjectName = "__CYPRUS_TEST__";

export const logInAsUserAndNavigateToProject =  (email: string) => {
    cy.switchUserTo(email, true);

    cy.contains("Projects").click();
    cy.get(`${projectCardCss} a`).wait(1000).contains(testProjectName).click();
}

export const monitoringReportCardShouldNotExist = () => {
    cy.get(".card-link h2").contains("Monitoring reports").should("not.exist");
}