import { TestContext } from "../../server/testContextProvider";
import { GetByIdQuery } from "@server/features/partners";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { BankCheckStatus, BankDetailsTaskStatus, PartnerStatus, SpendProfileStatus } from "@framework/dtos";
import {
  BankCheckStatusMapper,
  BankDetailsTaskStatusMapper,
  PartnerSpendProfileStatusMapper,
  PartnerStatusMapper
} from "@server/features/partners/mapToPartnerDto";
import { getAllEnumValues } from "@shared/enumHelper";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentDescription } from "@framework/constants";

// tslint:disable-next-line:no-big-function
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
          const validator = new PartnerDtoValidator(partnerDto, originalDto, [], true);
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
      const validate = () => new PartnerDtoValidator(partnerDto, originalDto, [], true);
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
      const validate = () => new PartnerDtoValidator(partnerDto, originalDto, [], true);
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
      const validate = () => new PartnerDtoValidator(partnerDto, partnerDto, [], true);
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
        x.bankDetailsTaskStatus = new BankDetailsTaskStatusMapper().mapToSalesforce(BankDetailsTaskStatus.Incomplete) || "";
      });
      const originalDto = await context.runQuery(new GetByIdQuery(partner.id));
      const partnerDto = { ...originalDto };
      const validate = (documents: DocumentSummaryDto[]) => new PartnerDtoValidator(partnerDto, originalDto, documents, true);
      partnerDto.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
      expect(validate([]).bankDetailsTaskStatus.isValid).toBe(false);
      const document: DocumentSummaryDto = {fileName: "a", fileSize: 2, link: "", id: "", dateCreated: new Date(), uploadedBy: ""};
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
        x.bankDetailsTaskStatus = new BankDetailsTaskStatusMapper().mapToSalesforce(BankDetailsTaskStatus.Incomplete) || "";
      });
      const originalDto = await context.runQuery(new GetByIdQuery(partner.id));
      const partnerDto = { ...originalDto };
      const validate = (documents: DocumentSummaryDto[]) => new PartnerDtoValidator(partnerDto, originalDto, documents, true);
      partnerDto.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
      expect(validate([]).bankDetailsTaskStatus.isValid).toBe(false);
      const document: DocumentSummaryDto = {fileName: "a", fileSize: 2, link: "", id: "", dateCreated: new Date(), uploadedBy: ""};
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
        x.bankDetailsTaskStatus = new BankDetailsTaskStatusMapper().mapToSalesforce(BankDetailsTaskStatus.Incomplete) || "";
      });
      const originalDto = await context.runQuery(new GetByIdQuery(partner.id));
      const partnerDto = { ...originalDto };
      const validate = () => new PartnerDtoValidator(partnerDto, originalDto, [], true);
      partnerDto.bankDetailsTaskStatus = BankDetailsTaskStatus.Complete;
      expect(validate().bankDetailsTaskStatus.isValid).toBe(false);
      partnerDto.bankCheckStatus = BankCheckStatus.VerificationPassed;
      expect(validate().bankDetailsTaskStatus.isValid).toBe(true);
    });
  });
  describe("postcode", () => {
    it("should validate the partner postcode", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner(undefined, x => {
        x.participantStatus = "Active";
        x.postcode = null as any;
      });
      const partnerDto = await context.runQuery(new GetByIdQuery(partner.id));
      const validate = () => new PartnerDtoValidator(partnerDto, partnerDto, [], true);
      expect(validate().postcode.isValid).toBe(false);
      partnerDto.postcode = "BS1 6DF";
      expect(validate().postcode.isValid).toBe(true);
    });
  });
  describe("bank details", () => {
    it("should validate the bank details", async () => {
      const context = new TestContext();
      const partner = context.testData.createPartner(undefined, x => {
        x.participantStatus = "Pending";
        x.accountNumber = "";
        x.sortCode = "";
        x.companyNumber = "";
        x.lastName = "";
        x.firstName = "";
        x.accountBuilding = "";
        x.accountLocality = "";
        x.accountPostcode = "";
        x.accountStreet = "";
        x.accountTownOrCity = "";
      });
      const partnerDto = await context.runQuery(new GetByIdQuery(partner.id));
      const validate = (validateBankDetails: boolean) => new PartnerDtoValidator(partnerDto, partnerDto, [], true, validateBankDetails);
      expect(validate(true).accountNumber.isValid).toBe(false);
      expect(validate(true).sortCode.isValid).toBe(false);
      expect(validate(true).lastName.isValid).toBe(false);
      expect(validate(true).firstName.isValid).toBe(false);
      expect(validate(true).accountBuilding.isValid).toBe(false);
      expect(validate(true).accountLocality.isValid).toBe(false);
      expect(validate(true).accountPostcode.isValid).toBe(false);
      expect(validate(true).accountStreet.isValid).toBe(false);
      expect(validate(true).accountTownOrCity.isValid).toBe(false);

      expect(validate(false).accountNumber.isValid).toBe(true);
      expect(validate(false).sortCode.isValid).toBe(true);
      expect(validate(false).lastName.isValid).toBe(true);
      expect(validate(false).firstName.isValid).toBe(true);
      expect(validate(false).accountBuilding.isValid).toBe(true);
      expect(validate(false).accountLocality.isValid).toBe(true);
      expect(validate(false).accountPostcode.isValid).toBe(true);
      expect(validate(false).accountStreet.isValid).toBe(true);
      expect(validate(false).accountTownOrCity.isValid).toBe(true);

      partnerDto.accountNumber = "123";
      expect(validate(true).accountNumber.isValid).toBe(false);
      partnerDto.accountNumber = "123456";
      expect(validate(true).accountNumber.isValid).toBe(true);

      partnerDto.sortCode = "123";
      expect(validate(true).sortCode.isValid).toBe(false);
      partnerDto.sortCode = "123222";
      expect(validate(true).sortCode.isValid).toBe(true);

      partnerDto.companyNumber = "234";
      expect(validate(true).companyNumber.isValid).toBe(true);
      partnerDto.lastName = "234";
      expect(validate(true).lastName.isValid).toBe(true);
      partnerDto.firstName = "345";
      expect(validate(true).firstName.isValid).toBe(true);
      partnerDto.accountBuilding = "345";
      expect(validate(true).accountBuilding.isValid).toBe(true);
      partnerDto.accountLocality = "456";
      expect(validate(true).accountLocality.isValid).toBe(true);
      partnerDto.accountPostcode = "456";
      expect(validate(true).accountPostcode.isValid).toBe(true);
      partnerDto.accountStreet = "567";
      expect(validate(true).accountStreet.isValid).toBe(true);
      partnerDto.accountTownOrCity = "567";
      expect(validate(true).accountTownOrCity.isValid).toBe(true);
    });
  });
});
