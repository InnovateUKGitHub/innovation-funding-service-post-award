import type { ContentSelector } from "@copy/type";

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

export enum DocumentDescription {
  IAR = 10,
  ClaimValidationForm = 20,
  Evidence = 30,
  DeMinimisDeclarationForm = 40,
  CertificateOfNameChange = 250,
  WithdrawalOfPartnerCertificate = 260,

  /**
   * @deprecated - This will be removed. We now favour the new "ProjectCompletionForm" workflow.
   */
  EndOfProjectSurvey = 50,
  StatementOfExpenditure = 60,
  JeSForm = 70,
  OverheadCalculationSpreadsheet = 80,
  BankStatement = 90,
  AgreementToPCR = 100,
  LMCMinutes = 110,
  ScheduleThree = 120,
  ReviewMeeting = 130,
  Plans = 140,
  CollaborationAgreement = 150,
  RiskRegister = 160,
  AnnexThree = 170,
  Presentation = 180,
  Email = 190,
  MeetingAgenda = 200,
  Invoice = 210,
  ProjectCompletionForm = 220,
  ProofOfSatisfiedConditions = 230,
  Loan = 240,
  PcrEvidence = 270,
}

const getDocumentDescriptionContentSelector = (type: DocumentDescription | null | undefined): ContentSelector => {
  switch (type) {
    case DocumentDescription.IAR:
      return x => x.documentLabels.description.iar;
    case DocumentDescription.ClaimValidationForm:
      return x => x.documentLabels.description.claimValidationForm;
    case DocumentDescription.Evidence:
      return x => x.documentLabels.description.evidence;
    case DocumentDescription.DeMinimisDeclarationForm:
      return x => x.documentLabels.description.deMinimisDeclarationForm;
    case DocumentDescription.CertificateOfNameChange:
      return x => x.documentLabels.description.certificateOfNameChange;
    case DocumentDescription.WithdrawalOfPartnerCertificate:
      return x => x.documentLabels.description.withdrawalOfPartnerCertificate;
    case DocumentDescription.EndOfProjectSurvey:
      return x => x.documentLabels.description.endOfProjectSurvey;
    case DocumentDescription.StatementOfExpenditure:
      return x => x.documentLabels.description.statementOfExpenditure;
    case DocumentDescription.JeSForm:
      return x => x.documentLabels.description.jesForm;
    case DocumentDescription.OverheadCalculationSpreadsheet:
      return x => x.documentLabels.description.overheadCalculationSpreadsheet;
    case DocumentDescription.BankStatement:
      return x => x.documentLabels.description.bankStatement;
    case DocumentDescription.AgreementToPCR:
      return x => x.documentLabels.description.agreementToPcr;
    case DocumentDescription.LMCMinutes:
      return x => x.documentLabels.description.lmcMinutes;
    case DocumentDescription.ScheduleThree:
      return x => x.documentLabels.description.scheduleThree;
    case DocumentDescription.ReviewMeeting:
      return x => x.documentLabels.description.reviewMeeting;
    case DocumentDescription.Plans:
      return x => x.documentLabels.description.plans;
    case DocumentDescription.CollaborationAgreement:
      return x => x.documentLabels.description.collaborationAgreement;
    case DocumentDescription.RiskRegister:
      return x => x.documentLabels.description.riskRegister;
    case DocumentDescription.AnnexThree:
      return x => x.documentLabels.description.annexThree;
    case DocumentDescription.Presentation:
      return x => x.documentLabels.description.presentation;
    case DocumentDescription.Email:
      return x => x.documentLabels.description.email;
    case DocumentDescription.MeetingAgenda:
      return x => x.documentLabels.description.meetingAgenda;
    case DocumentDescription.Invoice:
      return x => x.documentLabels.description.invoice;
    case DocumentDescription.ProjectCompletionForm:
      return x => x.documentLabels.description.projectCompletionForm;
    case DocumentDescription.ProofOfSatisfiedConditions:
      return x => x.documentLabels.description.proofOfSatisfiedConditions;
    case DocumentDescription.Loan:
      return x => x.documentLabels.description.loan;
    case DocumentDescription.PcrEvidence:
      return x => x.documentLabels.description.pcrEvidence;
    case null:
    case undefined:
    default:
      return x => x.documentLabels.description.unknown;
  }
};

export const allowedProjectLevelDocuments: DocumentDescription[] = [
  DocumentDescription.ReviewMeeting,
  DocumentDescription.Plans,
  DocumentDescription.CollaborationAgreement,
  DocumentDescription.RiskRegister,
  DocumentDescription.AnnexThree,
  DocumentDescription.Presentation,
  DocumentDescription.Email,
  DocumentDescription.MeetingAgenda,
];

export const allowedClaimDocuments = [
  DocumentDescription.Invoice,
  DocumentDescription.IAR,
  DocumentDescription.Evidence,
  DocumentDescription.ProjectCompletionForm,
  DocumentDescription.StatementOfExpenditure,
  DocumentDescription.LMCMinutes,
  DocumentDescription.ScheduleThree,
];

export const allowedImpactManagementClaimDocuments = [
  DocumentDescription.Invoice,
  DocumentDescription.IAR,
  DocumentDescription.Evidence,
  DocumentDescription.StatementOfExpenditure,
  DocumentDescription.LMCMinutes,
  DocumentDescription.ScheduleThree,
];

export const allowedPcrLevelDocuments = [
  DocumentDescription.CertificateOfNameChange,
  DocumentDescription.WithdrawalOfPartnerCertificate,
  DocumentDescription.JeSForm,
  DocumentDescription.AgreementToPCR,
  DocumentDescription.DeMinimisDeclarationForm,
  DocumentDescription.PcrEvidence,
  DocumentDescription.OverheadCalculationSpreadsheet,
];

export const allowedLoanLevelDocuments = [DocumentDescription.Loan];

export { getDocumentDescriptionContentSelector };
