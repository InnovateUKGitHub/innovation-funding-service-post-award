import { SalesforceBaseMapper } from "@server/repositories/mappers/salesforceMapperBase";
import { DocumentEntity } from "@framework/entities/document";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { ISalesforceDocument } from "../contentVersionRepository";

export class SalesforceDocumentMapper extends SalesforceBaseMapper<ISalesforceDocument, DocumentEntity> {
  public map(x: ISalesforceDocument): DocumentEntity {
    return {
      id: x.Id,
      title: x.Title,
      fileExtension: x.FileExtension,
      contentDocumentId: x.ContentDocumentId,
      contentSize: x.ContentSize,
      fileType: x.FileType,
      reasonForChange: x.ReasonForChange,
      pathOnClient: x.PathOnClient,
      contentLocation: x.ContentLocation,
      versionData: x.VersionData,
      description: new DocumentDescriptionMapper().mapFromSalesforceDocumentDescription(x.Description),
      createdDate: this.clock.parseRequiredSalesforceDateTime(x.CreatedDate),
      lastModifiedBy: x.Acc_LastModifiedByAlias__c,
      isOwner: x.Acc_UploadedByMe__c,
    };
  }
}

export class DocumentDescriptionMapper {
  // These are what the documents get saved as in Salesforce so these names must not change
  private readonly types = {
    Invoice: "Invoice",
    IAR: "IAR",
    Evidence: "Evidence",
    ClaimValidationForm: "ClaimValidationForm",
    DeMinimisDeclarationForm: "DeMinimisDeclartionForm", // sic
    CertificateOfNameChange: "CertificateOfNameChange",
    WithdrawalOfPartnerCertificate: "WithdrawalOfPartnerCertificate",
    StatementOfExpenditure: "StatementOfExpenditure",
    EndOfProjectSurvey: "EndOfProjectSurvey",
    JeSForm: "JeSForm",
    OverheadCalculationSpreadsheet: "OverheadCalculationSpreadsheet",
    BankStatement: "BankStatement",
    AgreementToPCR: "AgreementToPCR",
    LMCMinutes: "LMCMinutes",
    ScheduleThree: "ScheduleThree",
    ReviewMeeting: "ReviewMeeting",
    Plans: "Plans",
    CollaborationAgreement: "CollaborationAgreement",
    RiskRegister: "RiskRegister",
    AnnexThree: "AnnexThree",
    Presentation: "Presentation",
    Email: "Email",
    MeetingAgenda: "MeetingAgenda",
    ProjectCompletionForm: "ProjectCompletionForm",
    ProofOfSatisfiedConditions: "ProofOfSatisfiedConditions",
    Loan: "Loan",
    PcrEvidence: "PcrEvidence",
  } as const;

  public mapFromSalesforceDocumentDescription = (
    documentType: string | null | undefined,
  ): DocumentDescription | null => {
    switch (documentType) {
      case this.types.Invoice:
        return DocumentDescription.Invoice;
      case this.types.IAR:
        return DocumentDescription.IAR;
      case this.types.Evidence:
        return DocumentDescription.Evidence;
      case this.types.ClaimValidationForm:
        return DocumentDescription.ClaimValidationForm;
      case this.types.DeMinimisDeclarationForm:
        return DocumentDescription.DeMinimisDeclarationForm;
      case this.types.CertificateOfNameChange:
        return DocumentDescription.CertificateOfNameChange;
      case this.types.WithdrawalOfPartnerCertificate:
        return DocumentDescription.WithdrawalOfPartnerCertificate;
      case this.types.StatementOfExpenditure:
        return DocumentDescription.StatementOfExpenditure;
      case this.types.JeSForm:
        return DocumentDescription.JeSForm;
      case this.types.OverheadCalculationSpreadsheet:
        return DocumentDescription.OverheadCalculationSpreadsheet;
      case this.types.BankStatement:
        return DocumentDescription.BankStatement;
      case this.types.AgreementToPCR:
        return DocumentDescription.AgreementToPCR;
      case this.types.LMCMinutes:
        return DocumentDescription.LMCMinutes;
      case this.types.ScheduleThree:
        return DocumentDescription.ScheduleThree;
      case this.types.ReviewMeeting:
        return DocumentDescription.ReviewMeeting;
      case this.types.Plans:
        return DocumentDescription.Plans;
      case this.types.CollaborationAgreement:
        return DocumentDescription.CollaborationAgreement;
      case this.types.RiskRegister:
        return DocumentDescription.RiskRegister;
      case this.types.AnnexThree:
        return DocumentDescription.AnnexThree;
      case this.types.Presentation:
        return DocumentDescription.Presentation;
      case this.types.Email:
        return DocumentDescription.Email;
      case this.types.MeetingAgenda:
        return DocumentDescription.MeetingAgenda;
      case this.types.ProjectCompletionForm:
        return DocumentDescription.ProjectCompletionForm;
      case this.types.ProofOfSatisfiedConditions:
        return DocumentDescription.ProofOfSatisfiedConditions;
      case this.types.Loan:
        return DocumentDescription.Loan;
      case this.types.EndOfProjectSurvey:
        return DocumentDescription.EndOfProjectSurvey;
      case this.types.PcrEvidence:
        return DocumentDescription.PcrEvidence;
      default:
        return null;
    }
  };

  public mapToSalesforceDocumentDescription = (documentType: DocumentDescription | undefined) => {
    switch (documentType) {
      case DocumentDescription.Invoice:
        return this.types.Invoice;
      case DocumentDescription.IAR:
        return this.types.IAR;
      case DocumentDescription.Evidence:
        return this.types.Evidence;
      case DocumentDescription.ClaimValidationForm:
        return this.types.ClaimValidationForm;
      case DocumentDescription.DeMinimisDeclarationForm:
        return this.types.DeMinimisDeclarationForm;
      case DocumentDescription.CertificateOfNameChange:
        return this.types.CertificateOfNameChange;
      case DocumentDescription.WithdrawalOfPartnerCertificate:
        return this.types.WithdrawalOfPartnerCertificate;
      case DocumentDescription.StatementOfExpenditure:
        return this.types.StatementOfExpenditure;
      case DocumentDescription.JeSForm:
        return this.types.JeSForm;
      case DocumentDescription.OverheadCalculationSpreadsheet:
        return this.types.OverheadCalculationSpreadsheet;
      case DocumentDescription.BankStatement:
        return this.types.BankStatement;
      case DocumentDescription.AgreementToPCR:
        return this.types.AgreementToPCR;
      case DocumentDescription.LMCMinutes:
        return this.types.LMCMinutes;
      case DocumentDescription.ScheduleThree:
        return this.types.ScheduleThree;
      case DocumentDescription.ReviewMeeting:
        return this.types.ReviewMeeting;
      case DocumentDescription.Plans:
        return this.types.Plans;
      case DocumentDescription.CollaborationAgreement:
        return this.types.CollaborationAgreement;
      case DocumentDescription.RiskRegister:
        return this.types.RiskRegister;
      case DocumentDescription.AnnexThree:
        return this.types.AnnexThree;
      case DocumentDescription.Presentation:
        return this.types.Presentation;
      case DocumentDescription.Email:
        return this.types.Email;
      case DocumentDescription.MeetingAgenda:
        return this.types.MeetingAgenda;
      case DocumentDescription.ProjectCompletionForm:
        return this.types.ProjectCompletionForm;
      case DocumentDescription.ProofOfSatisfiedConditions:
        return this.types.ProofOfSatisfiedConditions;
      case DocumentDescription.Loan:
        return this.types.Loan;
      case DocumentDescription.EndOfProjectSurvey:
        return this.types.EndOfProjectSurvey;
      case DocumentDescription.PcrEvidence:
        return this.types.PcrEvidence;
      default:
        return null;
    }
  };
}
