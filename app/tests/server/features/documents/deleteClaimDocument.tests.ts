import {TestContext} from "../../testContextProvider";
import {DeleteClaimDocumentCommand} from "@server/features/documents/deleteClaimDocument";
import {Authorisation, ProjectRole} from "@framework/types";

describe("DeleteClaimDocumentCommand", () => {
    it("should upload and then delete a document", async () => {
        const context = new TestContext();
        const document = context.testData.createDocument("34", "hello", "txt", "hello");
        const project = context.testData.createProject();
        const partner = context.testData.createPartner(project);
        expect(context.repositories.documents.Items).toHaveLength(1);

        const claimKey = {
            projectId: project.Id,
            partnerId: partner.Id,
            periodId: 1
        };

        const deleteCommand = new DeleteClaimDocumentCommand(document.ContentDocumentId, claimKey);
        await context.runCommand(deleteCommand);
        expect(context.repositories.documents.Items).toHaveLength(0);
    });

    describe("access control", () => {
        const setupAccessControlContext = () => {
            const context = new TestContext();
            const project = context.testData.createProject();
            const partner = context.testData.createPartner(project);
            const claim = context.testData.createClaim(partner);
            const document = context.testData.createDocument(claim.Id, "perplexedHippo", "pdf", "it's a hippo", "IAR");
            expect(context.repositories.documents.Items).toHaveLength(1);

            const claimKey = {
                projectId: project.Id,
                partnerId: partner.Id,
                periodId: 1
            };
            const command = new DeleteClaimDocumentCommand(document.ContentDocumentId, claimKey);

            return {command, project, partner, context};
        };

        test("accessControl - Finance Contact can delete an IAR", async () => {
            const {command, project, partner, context} = setupAccessControlContext();

            const auth = new Authorisation({
                [project.Id]: {
                    projectRoles: ProjectRole.FinancialContact,
                    partnerRoles: {[partner.Id]: ProjectRole.FinancialContact}
                }
            });

            expect(await context.runAccessControl(auth, command)).toBe(true);
        });

        test("accessControl - No other role can delete an IAR", async () => {
            const {command, project, partner, context} = setupAccessControlContext();

            const auth = new Authorisation({
                [project.Id]: {
                    projectRoles: ProjectRole.ProjectManager | ProjectRole.MonitoringOfficer | ProjectRole.FinancialContact,
                    partnerRoles: {[partner.Id]: ProjectRole.ProjectManager | ProjectRole.Unknown}
                }
            });

            expect(await context.runAccessControl(auth, command)).toBe(false);
        });
    });

});
