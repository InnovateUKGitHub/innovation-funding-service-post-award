import { TestContext } from "../../testContextProvider";
import { UploadClaimDocumentCommand } from "../../../../src/server/features/documents/uploadClaimDocument";
import { ClaimStatus, DocumentDescription } from "../../../../src/types/constants";
import { ApiError } from "../../../../src/server/apis/ApiError";

const validStatus = [
  ClaimStatus.DRAFT,
  ClaimStatus.REVIEWING_FORECASTS,
  ClaimStatus.SUBMITTED,
  ClaimStatus.MO_QUERIED,
  ClaimStatus.REVIEWING_FORECASTS_FOLLOWING_MO_QUERY,
  ClaimStatus.AWAITING_IAR,
  ClaimStatus.INNOVATE_QUERIED,
  ClaimStatus.REVIEWING_FORECASTS_FOLLOWING_INNOVATE_QUERY
];
const invalidStatus = Object.keys(ClaimStatus).filter((status: string) => validStatus.indexOf(ClaimStatus[status]) < 0).map(status => ClaimStatus[status]);
const file = {
  fileName: "fileName.txt",
  content: "Some content",
  description: DocumentDescription.IAR
};

describe("UploadClaimDocumentCommand", () => {
  describe("When an IAR is uploaded", () => {
    it("throw an exception if an IAR is not required", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner();
      const claim = context.testData.createClaim(partner, 1, (item) => {
        item.Acc_IARRequired__c = false;
        item.Acc_ClaimStatus__c = ClaimStatus.DRAFT;
      });

      const claimKey = {
        partnerId: claim.Acc_ProjectParticipant__r.Id,
        periodId: claim.Acc_ProjectPeriodNumber__c
      };

      const command = new UploadClaimDocumentCommand(claimKey, file);
      await expect(context.runCommand(command)).rejects.toThrow(ApiError);
    });
    describe("When the claim status is AWAITING_IAR", () => {
      it("should update the claim status to AWAITING_IUK_APPROVAL", async () => {
        const context = new TestContext();
        const partner = context.testData.createPartner();
        const claim = context.testData.createClaim(partner, 1, (item) => {
          item.Acc_IARRequired__c = true;
          item.Acc_ClaimStatus__c = ClaimStatus.AWAITING_IAR;
        });

        const claimKey = {
          partnerId: claim.Acc_ProjectParticipant__r.Id,
          periodId: claim.Acc_ProjectPeriodNumber__c
        };

        const command = new UploadClaimDocumentCommand(claimKey, file);
        await context.runCommand(command);
        expect(context.repositories.claims.Items[0].Acc_ClaimStatus__c).toBe(ClaimStatus.AWAITING_IUK_APPROVAL);
      });
    });
    describe("When the claim status is not AWAITING_IAR", () => {
      it("should not update the claim status", async () => {
        const context = new TestContext();
        const partner = context.testData.createPartner();
        const claim = context.testData.createClaim(partner, 1, (item) => {
          item.Acc_IARRequired__c = true;
          item.Acc_ClaimStatus__c = ClaimStatus.DRAFT;
        });

        const claimKey = {
          partnerId: claim.Acc_ProjectParticipant__r.Id,
          periodId: claim.Acc_ProjectPeriodNumber__c
        };

        const command = new UploadClaimDocumentCommand(claimKey, file);
        await context.runCommand(command);
        expect(context.repositories.claims.Items[0].Acc_ClaimStatus__c).toBe(ClaimStatus.DRAFT);
      });
    });
    describe("when the claim status allows an IAR upload", async () => {
      validStatus.forEach(status => {
        it("should upload an IAR claim document", async () => {
          const context = new TestContext();
          const partner = context.testData.createPartner();
          const claim = context.testData.createClaim(partner, 1, (item) => {
            item.Acc_IARRequired__c = true;
            item.Acc_ClaimStatus__c = status;
          });
          const claimKey = {
            partnerId: claim.Acc_ProjectParticipant__r.Id,
            periodId: claim.Acc_ProjectPeriodNumber__c
          };

          const command = new UploadClaimDocumentCommand(claimKey, file);
          await context.runCommand(command);

          expect(context.repositories.contentVersions.Items[0].VersionData).toEqual(file.content);
          expect(context.repositories.contentVersions.Items[0].PathOnClient).toEqual(file.fileName);
          expect(context.repositories.contentVersions.Items[0].Description).toEqual(file.description);
          expect(context.repositories.contentDocumentLinks.Items[0].LinkedEntityId).toEqual(claim.Id);
        });
      });
    });
    describe("when the claim status does not allow an IAR upload", async () => {
      invalidStatus.forEach(status => {
        it("should not upload a claim document with an IAR description when the claim is not in a valid status", async () => {
          const context = new TestContext();
          const partner = context.testData.createPartner();
          const claim = context.testData.createClaim(partner, 1, (item) => {
            item.Acc_IARRequired__c = true;
            item.Acc_ClaimStatus__c = status;
          });

          const claimKey = {
            partnerId: claim.Acc_ProjectParticipant__r.Id,
            periodId: claim.Acc_ProjectPeriodNumber__c
          };

          const command = new UploadClaimDocumentCommand(claimKey, file);
          await expect(context.runCommand(command)).rejects.toThrow(ApiError);
        });
      });
    });
  });
});
