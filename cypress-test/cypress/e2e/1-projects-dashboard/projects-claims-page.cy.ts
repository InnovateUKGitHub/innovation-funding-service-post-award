import { visitApp } from "../../common/visit";
import { logInAsUserAndNavigateToProject, shouldHaveShowAllAccordion, shouldShowProjectTitle, } from "./steps";

const financeContactEmail = "james.black@euimeabs.test";

describe("project dashboard as Finance Contact", () => {
    before(() => {
        visitApp();

        logInAsUserAndNavigateToProject(financeContactEmail);
    });

    describe("FC should be able to navigate to the claims page", () => {
        it("clicking Claims will navigate to claims screen", () => {
            cy.get("h2.card-link__title").contains("Claims").click()
        })
        it("Should have a back option", () => {
            cy.get(".govuk-back-link").contains("Back to project")
        })
        it("Should have the project name displayed", shouldShowProjectTitle)

        it("Should display messaging", () => {
            cy.getByQA("guidance-message").should("contain.text", 'evidence')

        })
        it("Should have an Open section", () => {
            cy.get("h2").contains("Open")
        })

        it("Should have a Closed section", () => {
            cy.get("h2").contains("Closed")
        })
        it("Should show a claim", () => {
            cy.get("h3").should("contain.text", 'Period')
        })
    })
    describe("The claims page should have accordions", () => {
        it("Should have Show all sections option", shouldHaveShowAllAccordion)
    })

})