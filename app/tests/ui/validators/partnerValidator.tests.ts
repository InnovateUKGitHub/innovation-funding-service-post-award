import { GetByIdQuery } from "@server/features/partners";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { BankCheckStatus, BankDetailsTaskStatus, PartnerStatus, SpendProfileStatus } from "@framework/dtos";
import {
  BankCheckStatusMapper,
  BankDetailsTaskStatusMapper,
  PartnerSpendProfileStatusMapper,
  PartnerStatusMapper,
} from "@server/features/partners/mapToPartnerDto";
import { getAllEnumValues } from "@shared/enumHelper";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentDescription } from "@framework/constants";
import { TestContext } from "../../server/testContextProvider";

describe("Partner Validator", () => {
  describe("partnerStatus", () => {
    it("should validate partner status transitions", async () => {
      const context = new TestContext();
      const statuses = getAllEnumValues(PartnerStatus).filter(x => x !== PartnerStatus.Unknown);
      for (const status of statuses) {
        const partner = context.testData.createPartner(undefined, x => {
          x.participantStatus = new PartnerStatusMapper().mapToSalesforce(status) || "";
        });
        const originalDto = await context.runQuery(new GetByIdQuery(partner.id));
        const partnerDto = { ...originalDto };
        for (const newStatus of statuses) {
          partnerDto.partnerStatus = newStatus;
          const validator = new PartnerDtoValidator(partnerDto, originalDto, [], { showValidationErrors: true });
          if (status === PartnerStatus.Pending && newStatus === PartnerStatus.Active) {
            expect(validator.partnerStatus.isValid).toBe(true);
          } else if (status === newStatus) {
            expect(validator.partnerStatus.isValid).toBe(true);
          } else {
            expect(validator.partnerStatus.isValid).toBe(false);
          }
        }
      }
    });
  });
  describe("spendProfileStatus", () => {
    it("should only allow the partner to be made active if the spend profile status is complete", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner(undefined, x => {
        x.participantStatus = new PartnerStatusMapper().mapToSalesforce(PartnerStatus.Pending) || "";
        x.spendProfileStatus = new PartnerSpendProfileStatusMapper().mapToSalesforce(SpendProfileStatus.ToDo) || "";
      });
      const originalDto = await context.runQuery(new GetByIdQuery(partner.id));
      const partnerDto = { ...originalDto };
      const validate = () => new PartnerDtoValidator(partnerDto, originalDto, [], { showValidationErrors: true });
      partnerDto.partnerStatus = PartnerStatus.Active;
      expect(validate().spendProfileStatus.isValid).toBe(false);
      partnerDto.spendProfileStatus = SpendProfileStatus.Complete;
      expect(validate().spendProfileStatus.isValid).toBe(true);
    });
  });
  describe("bankDetailsTaskStatus", () => {
    it("should only allow the partner to be made active if the bankDetailsTaskStatus is complete", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner(undefined, x => {
        x.participantStatus = new PartnerStatusMapper().mapToSalesforce(PartnerStatus.Pending) || "";
        x.bankDetailsTaskStatus = new BankDetailsTaskStatusMapper().mapToSalesforce(BankDetailsTaskStatus.ToDo) || "";
        x.bankCheckStatus = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.VerificationPassed) || "";
      });
      const originalDto = await context.runQuery(new GetByIdQuery(partner.id));
      const partnerDto = { ...originalDto };
      const validate = () => new PartnerDtoValidator(partnerDto, originalDto, [], { showValidationErrors: true });
      partnerDto.partnerStatus = PartnerStatus.Active;
      expect(validate().bankDetailsTaskStatus.isValid).toBe(false);
      partnerDto.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
      expect(validate().bankDetailsTaskStatus.isValid).toBe(true);
    });
    it("Should allow same state transitions", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner(undefined, x => {
        x.participantStatus = new PartnerStatusMapper().mapToSalesforce(PartnerStatus.Pending) || "";
        x.bankCheckStatus = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.NotValidated) || "";
      });
      const partnerDto = await context.runQuery(new GetByIdQuery(partner.id));
      const validate = () => new PartnerDtoValidator(partnerDto, partnerDto, [], { showValidationErrors: true });
      partnerDto.bankDetailsTaskStatus = BankDetailsTaskStatus.ToDo;
      expect(validate().bankDetailsTaskStatus.isValid).toBe(true);
      partnerDto.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
      expect(validate().bankDetailsTaskStatus.isValid).toBe(true);
      partnerDto.bankDetailsTaskStatus = BankDetailsTaskStatus.Incomplete;
      expect(validate().bankDetailsTaskStatus.isValid).toBe(true);
    });
    it("Should require a bank statement if the bank validation status is failed", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner(undefined, x => {
        x.participantStatus = new PartnerStatusMapper().mapToSalesforce(PartnerStatus.Pending) || "";
        x.bankCheckStatus = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.ValidationFailed) || "";
        x.bankDetailsTaskStatus =
          new BankDetailsTaskStatusMapper().mapToSalesforce(BankDetailsTaskStatus.Incomplete) || "";
      });
      const originalDto = await context.runQuery(new GetByIdQuery(partner.id));
      const partnerDto = { ...originalDto };
      const validate = (documents: DocumentSummaryDto[]) =>
        new PartnerDtoValidator(partnerDto, originalDto, documents, { showValidationErrors: true });
      partnerDto.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
      expect(validate([]).bankDetailsTaskStatus.isValid).toBe(false);
      const document: DocumentSummaryDto = {
        fileName: "a",
        fileSize: 2,
        link: "",
        id: "",
        dateCreated: new Date(),
        uploadedBy: "",
      };
      expect(validate([document]).bankDetailsTaskStatus.isValid).toBe(false);
      document.description = DocumentDescription.Evidence;
      expect(validate([document]).bankDetailsTaskStatus.isValid).toBe(false);
      document.description = DocumentDescription.BankStatement;
      expect(validate([document]).bankDetailsTaskStatus.isValid).toBe(true);
    });
    it("Should require a bank statement if the bank verification status is failed", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner(undefined, x => {
        x.participantStatus = new PartnerStatusMapper().mapToSalesforce(PartnerStatus.Pending) || "";
        x.bankCheckStatus = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.VerificationFailed) || "";
        x.bankDetailsTaskStatus =
          new BankDetailsTaskStatusMapper().mapToSalesforce(BankDetailsTaskStatus.Incomplete) || "";
      });
      const originalDto = await context.runQuery(new GetByIdQuery(partner.id));
      const partnerDto = { ...originalDto };
      const validate = (documents: DocumentSummaryDto[]) =>
        new PartnerDtoValidator(partnerDto, originalDto, documents, { showValidationErrors: true });
      partnerDto.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
      expect(validate([]).bankDetailsTaskStatus.isValid).toBe(false);
      const document: DocumentSummaryDto = {
        fileName: "a",
        fileSize: 2,
        link: "",
        id: "",
        dateCreated: new Date(),
        uploadedBy: "",
      };
      expect(validate([document]).bankDetailsTaskStatus.isValid).toBe(false);
      document.description = DocumentDescription.Evidence;
      expect(validate([document]).bankDetailsTaskStatus.isValid).toBe(false);
      document.description = DocumentDescription.BankStatement;
      expect(validate([document]).bankDetailsTaskStatus.isValid).toBe(true);
    });
    it("should require the verification to pass before the bank details task can be completed", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner(undefined, x => {
        x.participantStatus = new PartnerStatusMapper().mapToSalesforce(PartnerStatus.Pending) || "";
        x.bankCheckStatus = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.ValidationPassed) || "";
        x.bankDetailsTaskStatus =
          new BankDetailsTaskStatusMapper().mapToSalesforce(BankDetailsTaskStatus.Incomplete) || "";
      });
      const originalDto = await context.runQuery(new GetByIdQuery(partner.id));
      const partnerDto = { ...originalDto };
      const validate = () => new PartnerDtoValidator(partnerDto, originalDto, [], { showValidationErrors: true });
      partnerDto.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
      expect(validate().bankDetailsTaskStatus.isValid).toBe(false);
      partnerDto.bankCheckStatus = BankCheckStatus.VerificationPassed;
      expect(validate().bankDetailsTaskStatus.isValid).toBe(true);
    });
  });

  describe("postcode", () => {
    it("should validate with a withheld postcode", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner(undefined, x => {
        x.participantStatus = "Active";
        x.postcode = null;
      });

      const partnerDto = await context.runQuery(new GetByIdQuery(partner.id));
      const validate = () => new PartnerDtoValidator(partnerDto, partnerDto, [], { showValidationErrors: true });

      expect(validate().postcode.isValid).toBe(true);
    });

    it("should validate with populated string", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner(undefined, x => {
        x.participantStatus = "Active";
        x.postcode = "BS1 6DF";
      });

      const partnerDto = await context.runQuery(new GetByIdQuery(partner.id));
      const validate = () => new PartnerDtoValidator(partnerDto, partnerDto, [], { showValidationErrors: true });

      expect(validate().postcode.isValid).toBe(true);
    });

    it("should throw error with empty postcode", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner(undefined, x => {
        x.participantStatus = "Active";
        x.postcode = "BS1 6DF";
      });

      const partnerDto = await context.runQuery(new GetByIdQuery(partner.id));
      const validate = () => new PartnerDtoValidator(partnerDto, partnerDto, [], { showValidationErrors: true });

      expect(validate().postcode.isValid).toBe(true);

      partnerDto.postcode = "";

      expect(validate().postcode.isValid).toBe(false);
      expect(validate().postcode.errorMessage).toBe("Postcode field cannot be empty");
    });
  });

  describe("bank details", () => {
    it("should validate the bank details", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner(undefined, x => {
        x.participantStatus = "Pending";
        x.bankCheckStatus = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.NotValidated) || "";
        x.accountNumber = "";
        x.sortCode = "";
      });
      const partnerDto = await context.runQuery(new GetByIdQuery(partner.id));
      const validate = (validateBankDetails: boolean) =>
        new PartnerDtoValidator(partnerDto, partnerDto, [], {
          showValidationErrors: true,
          validateBankDetails,
        });
      expect(validate(true).accountNumber.isValid).toBe(false);
      expect(validate(true).sortCode.isValid).toBe(false);

      expect(validate(false).accountNumber.isValid).toBe(true);
      expect(validate(false).sortCode.isValid).toBe(true);

      partnerDto.bankDetails.accountNumber = "123";
      expect(validate(true).accountNumber.isValid).toBe(false);
      partnerDto.bankDetails.accountNumber = "123456";
      expect(validate(true).accountNumber.isValid).toBe(true);

      partnerDto.bankDetails.sortCode = "123";
      expect(validate(true).sortCode.isValid).toBe(false);
      partnerDto.bankDetails.sortCode = "123222";
      expect(validate(true).sortCode.isValid).toBe(true);
    });
    it("should not validate the account number and postcode if the bank check validation has passed", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner(undefined, x => {
        x.bankCheckStatus = new BankCheckStatusMapper().mapToSalesforce(BankCheckStatus.VerificationPassed) || "";
        x.participantStatus = "Pending";
        x.accountNumber = "";
        x.sortCode = "";
      });
      const partnerDto = await context.runQuery(new GetByIdQuery(partner.id));
      const validate = () =>
        new PartnerDtoValidator(partnerDto, partnerDto, [], {
          showValidationErrors: true,
          validateBankDetails: true,
        });
      expect(validate().accountNumber.isValid).toBe(true);
      expect(validate().sortCode.isValid).toBe(true);
    });
  });
});
