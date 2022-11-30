import { visitApp } from "../../common/visit";
import { logInAsUserAndNavigateToProject, monitoringReportCardShouldNotExist, shouldFindMatchingProjectCard } from "./steps";

const financeContactEmail = "contact77@test.co.uk";

describe("project dashboard as Finance Contact", () => {
    before(() => {
        visitApp();

        logInAsUserAndNavigateToProject(financeContactEmail);
    });

    describe("FC should be able to navigate to claims tile", () => {
        it("clicking Claims will navigate to claims screen", () => {
            cy.get("h2.card-link__title").contains("Claims").click()

        })
        it("Should display messaging", () => {
            cy.getByQA("guidance-message").should("contain.text", 'evidence')

        }
        )
        it("Should have an Open section", () => {
        cy.get("h2").contains("Open")
        }
            )
    })
})

