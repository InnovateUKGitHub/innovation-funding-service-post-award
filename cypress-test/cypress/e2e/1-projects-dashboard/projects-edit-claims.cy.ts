import { visitApp } from "../../common/visit";
import { logInAsUserAndNavigateToProject, shouldHaveShowAllAccordion, shouldShowCostCatTable, shouldShowProjectTitle, } from "./steps";

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


        describe("FC should be able to click edit on an open claim", () => {
            it("Displays a claim in draft state", () => {
                cy.get("tbody").contains("Draft")
                cy.get("tbody").contains("Edit").click()
            })


            describe("The edit claims screen should show the following", () => {
                it("Displays the project title", shouldShowProjectTitle)
                it("Displays the cost category table", shouldShowCostCatTable)

                it("Displays the period information", () => {
                    cy.get("h2").should("contain.text", 'Period')
                })

                it("Should have continue to claims documents button", () => {
                    cy.getByQA("button_default-qa")
                })

                it("Should have a save and return to claims button", () => {
                    cy.getByQA("button_save-qa")
                })

                it("Should show accordions", shouldHaveShowAllAccordion)

            })
        })
    })
})
