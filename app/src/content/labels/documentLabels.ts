import { ContentBase } from "@content/contentBase";
import { DocumentDescription } from "@framework/constants";

export class DocumentLabels extends ContentBase {
  constructor(parent: ContentBase, competitionType?: string) {
    super(parent, "document-labels", competitionType);
  }

  public readonly documentDisplayTitle = this.getContent("documentDisplayTitle");
  public readonly documentDisplaySubTitle = this.getContent("documentDisplaySubTitle");

  // Note: Ensure that 'documentMapper.ts' gets updated for the server to return description. Otherwise 'null' will be returned
  private getDocumentDescriptionLabel(documentDescription: DocumentDescription | null) {
    switch (documentDescription) {
      case DocumentDescription.ClaimValidationForm:
        return this.getContent("description.claimValidationForm");
      case DocumentDescription.Evidence:
        return this.getContent("description.evidence");
      case DocumentDescription.IAR:
        return this.getContent("description.iAR");
      case DocumentDescription.Invoice:
        return this.getContent("description.invoice");
      case DocumentDescription.DeMinimisDeclarationForm:
        return this.getContent("description.deMinimisDeclarationForm");
      case DocumentDescription.StatementOfExpenditure:
        return this.getContent("description.statementOfExpenditure");
      case DocumentDescription.JeSForm:
        return this.getContent("description.jeSForm");
      case DocumentDescription.OverheadCalculationSpreadsheet:
        return this.getContent("description.overheadCalculationSpreadsheet");
      case DocumentDescription.BankStatement:
        return this.getContent("description.bankStatement");
      case DocumentDescription.AgreementToPCR:
        return this.getContent("description.agreementToPCR");
      case DocumentDescription.LMCMinutes:
        return this.getContent("description.lmcMinutes");
      case DocumentDescription.ScheduleThree:
        return this.getContent("description.scheduleThree");
      case DocumentDescription.ReviewMeeting:
        return this.getContent("description.reviewMeeting");
      case DocumentDescription.Plans:
        return this.getContent("description.plans");
      case DocumentDescription.CollaborationAgreement:
        return this.getContent("description.collaborationAgreement");
      case DocumentDescription.RiskRegister:
        return this.getContent("description.riskRegister");
      case DocumentDescription.AnnexThree:
        return this.getContent("description.annexThree");
      case DocumentDescription.Presentation:
        return this.getContent("description.presentation");
      case DocumentDescription.Email:
        return this.getContent("description.email");
      case DocumentDescription.MeetingAgenda:
        return this.getContent("description.meetingAgenda");
      case DocumentDescription.Loan:
        return this.getContent("description.loan");
      case DocumentDescription.ProjectCompletionForm:
        return this.getContent("description.projectCompletionForm");
      case DocumentDescription.ProofOfSatisfiedConditions:
        return this.getContent("description.proofOfSatisfiedConditions");
      case DocumentDescription.EndOfProjectSurvey:
        return this.getContent("description.endOfProjectSurvey");
      default:
        return this.getContent("description.unknown");
    }
  }

  public readonly documentDescriptionLabel = (documentDescription: DocumentDescription | null) =>
    this.getDocumentDescriptionLabel(documentDescription);
  public readonly descriptionLabel = this.getContent("description-label");
  public readonly participantLabel = this.getContent("participant-label");
  public readonly participantOption = (partnerName: string) => this.getContent("participant-option", { partnerName });
  public readonly participantPlaceholder = this.getContent("participant-placeholder");
  public readonly descriptionPlaceholder = this.getContent("description-placeholder");
  public readonly uploadInputLabel = this.getContent("uploadInputLabel");
  public readonly fileNameLabel = this.getContent("fileNameLabel");
  public readonly dateUploadedLabel = this.getContent("dateUploadedLabel");
  public readonly fileSizeLabel = this.getContent("fileSizeLabel");
  public readonly uploadedByLabel = this.getContent("uploadedByLabel");
}
