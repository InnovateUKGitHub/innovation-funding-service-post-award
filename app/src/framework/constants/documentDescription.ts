import type { ContentSelector } from "@copy/type";

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
];

export { getDocumentDescriptionContentSelector };
