interface FileData {
  /**
   * Filename to display on Salesforce
   */
  name: string;

  /**
   * Path relative to the `/payload` folder where the file you want to upload is found
   */
  path: string;

  /**
   * Canned description for the file.
   */
  description:
    | "BillingStreet"
    | "Invoice"
    | "IAR"
    | "Evidence"
    | "ClaimValidationForm"
    | "DeMinimisDeclartionForm"
    | "CertificateOfNameChange"
    | "WithdrawalOfPartnerCertificate"
    | "StatementOfExpenditure"
    | "EndOfProjectSurvey"
    | "JeSForm"
    | "OverheadCalculationSpreadsheet"
    | "BankStatement"
    | "AgreementToPCR"
    | "LMCMinutes"
    | "ScheduleThree"
    | "ReviewMeeting"
    | "Plans"
    | "CollaborationAgreement"
    | "RiskRegister"
    | "AnnexThree"
    | "Presentation"
    | "Email"
    | "MeetingAgenda"
    | "ProjectCompletionForm"
    | "ProofOfSatisfiedConditions"
    | "Loan";

  /**
   * Username of the author of the file.
   * This user will be treated as the owner of the file.
   *
   * Leave empty to mark as uploaded by the Bamboo user/Innovate UK
   */
  username?: string;
}

export { FileData };
