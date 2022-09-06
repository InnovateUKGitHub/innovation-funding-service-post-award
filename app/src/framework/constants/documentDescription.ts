export enum DocumentDescription {
  IAR = 10,
  ClaimValidationForm = 20,
  Evidence = 30,
  DeMinimisDeclarationForm = 40,
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
  Loan = 230,
}

export const allowedClaimDocuments: Readonly<DocumentDescription[]> = [
  DocumentDescription.Invoice,
  DocumentDescription.IAR,
  DocumentDescription.Evidence,
  DocumentDescription.ProjectCompletionForm,
  DocumentDescription.StatementOfExpenditure,
  DocumentDescription.LMCMinutes,
  DocumentDescription.ScheduleThree,
];
