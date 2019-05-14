// tslint:disable: no-big-function
import { TestContext } from "../../testContextProvider";
import { UploadClaimDocumentCommand } from "@server/features/documents/uploadClaimDocument";
import { BadRequestError, ValidationError } from "@server/features/common/appError";
import { ClaimStatus, DocumentDescription } from "@framework/constants";

const validStatus = [
  ClaimStatus.DRAFT,
  ClaimStatus.SUBMITTED,
  ClaimStatus.MO_QUERIED,
  ClaimStatus.AWAITING_IAR,
  ClaimStatus.INNOVATE_QUERIED,
];

const invalidStatus: ClaimStatus[] = [];
// tslint:disable forin
for (const key in ClaimStatus) {
  const status = ClaimStatus[key] as ClaimStatus;
  if (validStatus.indexOf(status) === -1) {
    invalidStatus.push(status);
  }
}

const file = {
  fileName: "fileName.txt",
  content: "Some content",
  description: DocumentDescription.IAR
};

describe("UploadClaimDocumentCommand", () => {
  describe("When an IAR is uploaded", () => {
    it("throw an exception if an IAR is not required", async () => {
      const context = new TestContext();

      const claim = context.testData.createClaim(undefined, 1, (item) => {
        item.Acc_IARRequired__c = false;
        item.Acc_ClaimStatus__c = ClaimStatus.DRAFT;
      });

      const claimKey = {
        partnerId: claim.Acc_ProjectParticipant__r.Id,
        periodId: claim.Acc_ProjectPeriodNumber__c
      };

      const command = new UploadClaimDocumentCommand(claimKey, file);
      await expect(context.runCommand(command)).rejects.toThrow(BadRequestError);
    });

    it("should throw an exception if file upload validation fails", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner();
      const claim = context.testData.createClaim(partner, 1, (item) => {
        item.Acc_IARRequired__c = false;
        item.Acc_ClaimStatus__c = ClaimStatus.DRAFT;
      });

      const badFile = {
        fileName: undefined,
        content: "Some content",
        description: DocumentDescription.IAR
      };

      const claimKey = {
        partnerId: claim.Acc_ProjectParticipant__r.Id,
        periodId: claim.Acc_ProjectPeriodNumber__c
      };

      const command = new UploadClaimDocumentCommand(claimKey, badFile as any);
      await expect(context.runCommand(command)).rejects.toThrow(ValidationError);
    });

    it("should upload document if description is not IAR", async () => {
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

      const nonIARDocument = {
        fileName: "fileName.txt",
        content: "test content",
        description: "any"
      };

      const command = new UploadClaimDocumentCommand(claimKey, nonIARDocument as any);
      const documentId = await context.runCommand(command);
      const document = await context.repositories.documents.getDocumentMetadata(documentId);

      expect(document.VersionData).toEqual(nonIARDocument.content);
      expect(document.PathOnClient).toEqual(nonIARDocument.fileName);
      expect(document.Description).toEqual(nonIARDocument.description);
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

      it("should update the create a status change record", async () => {
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

        expect(context.repositories.claimStatusChanges.Items.length).toBe(0);

        const command = new UploadClaimDocumentCommand(claimKey, file);
        await context.runCommand(command);

        expect(context.repositories.claimStatusChanges.Items.length).toBe(1);
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

    describe("when the claim status allows an IAR upload", () => {
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
          const documentId = await context.runCommand(command);
          const document = await context.repositories.documents.getDocumentMetadata(documentId);

          expect(document.VersionData).toEqual(file.content);
          expect(document.PathOnClient).toEqual(file.fileName);
          expect(document.Description).toEqual(file.description);
        });
      });

      it("removes other IARs when a new one is uploaded", async () => {
        const context = new TestContext();
        const partner = context.testData.createPartner();
        const claimId = "12345";
        const claim = context.testData.createClaim(partner, 1, item => {
          item.Id = claimId;
          item.Acc_IARRequired__c = true;
        });
        const originalDocumentId = context.testData.createDocument("12345", "cat", "jpg", "", DocumentDescription.IAR).ContentDocumentId;

        const claimKey = {
          partnerId: claim.Acc_ProjectParticipant__r.Id,
          periodId: claim.Acc_ProjectPeriodNumber__c
        };

        expect(context.repositories.documents.Items).toHaveLength(1);
        expect(await context.repositories.documents.getDocumentMetadata(originalDocumentId)).toBeDefined();

        const command = new UploadClaimDocumentCommand(claimKey, file);
        const newDocumentId = await context.runCommand(command);

        expect(context.repositories.documents.Items).toHaveLength(1);
        expect(await context.repositories.documents.getDocumentMetadata(newDocumentId)).toBeDefined();
      });
    });
  });

  describe("when the claim status does not allow an IAR upload", () => {
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
        await expect(context.runCommand(command)).rejects.toThrow();
      });
    });
  });
});
