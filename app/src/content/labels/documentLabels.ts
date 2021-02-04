import { ContentBase } from "../contentBase";
import { DocumentDescription } from "@framework/constants";

export class DocumentLabels extends ContentBase {
  constructor(parent: ContentBase, protected competitionType?: string) {
    super(parent, "document-labels", competitionType);
  }

  private getDocumentDescriptionLabel(documentDescription: DocumentDescription | null) {
    switch (documentDescription) {
      case DocumentDescription.ClaimValidationForm:
        return this.getContent("description.claimValidationForm");
      case DocumentDescription.Evidence:
        return this.getContent("description.evidence");
      case DocumentDescription.IAR:
        return this.getContent("description.iAR");
      case DocumentDescription.DeMinimisDeclarationForm:
        return this.getContent("description.deMinimisDeclarationForm");
      case DocumentDescription.EndOfProjectSurvey:
        return this.getContent("description.endOfProjectSurvey");
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
      default:
        return this.getContent("description.unknown");
    }
  }

  public readonly documentDescriptionLabel = (documentDescription: DocumentDescription | null) =>
    this.getDocumentDescriptionLabel(documentDescription);
  public readonly uploadInputLabel = this.getContent("uploadInputLabel");
  public readonly fileNameLabel = this.getContent("fileNameLabel");
  public readonly dateUploadedLabel = this.getContent("dateUploadedLabel");
  public readonly fileSizeLabel = this.getContent("fileSizeLabel");
  public readonly uploadedByLabel = this.getContent("uploadedByLabel");
  public readonly filesUploadedTitle = this.getContent("filesUploadedTitle");
  public readonly filesUploadedSubtitle = this.getContent("filesUploadedSubtitle");
}
