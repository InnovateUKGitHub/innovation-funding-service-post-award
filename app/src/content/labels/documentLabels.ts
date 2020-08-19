import { ContentBase } from "../contentBase";
import { DocumentDescription } from "@framework/constants";
import { ProjectDto } from "@framework/dtos";

export class DocumentLabels extends ContentBase {
  constructor(parent: ContentBase, protected project: ProjectDto | null | undefined) {
    super(parent, "document-labels", project);
  }

  private getDocumentDescriptionLabel(documentDescription: DocumentDescription | null) {
    switch (documentDescription) {
      case DocumentDescription.ClaimValidationForm: return this.getContent("document-description-ClaimValidationForm");
      case DocumentDescription.Evidence: return this.getContent("document-description-Evidence");
      case DocumentDescription.IAR: return this.getContent("document-description-IAR");
      case DocumentDescription.DeMinimisDeclarationForm: return this.getContent("document-description-DeMinimisDeclarationForm");
      case DocumentDescription.EndOfProjectSurvey: return this.getContent("document-description-EndOfProjectSurvey");
      case DocumentDescription.StatementOfExpenditure: return this.getContent("document-description-StatementOfExpenditure");
      case DocumentDescription.JeSForm: return this.getContent("document-description-JeSForm");
      case DocumentDescription.OverheadCalculationSpreadsheet: return this.getContent("document-description-OverheadCalculationSpreadsheet");
      case DocumentDescription.BankStatement: return this.getContent("document-description-BankStatement");
      case DocumentDescription.AgreementToPCR: return this.getContent("document-description-AgreementToPCR");
      default: return this.getContent("document-description-Unknown");
    }
  }

  public readonly documentDescriptionLabel = (documentDescription: DocumentDescription | null) => this.getDocumentDescriptionLabel(documentDescription);
  public readonly uploadInputLabel = () => this.getContent("uploadInputLabel");
  public readonly uploadButtonLabel = () => this.getContent("uploadButtonLabel");
  public readonly fileNameLabel = () => this.getContent("fileNameLabel");
  public readonly dateUploadedLabel = () => this.getContent("dateUploadedLabel");
  public readonly fileSizeLabel = () => this.getContent("fileSizeLabel");
  public readonly uploadedByLabel = () => this.getContent("uploadedByLabel");
  public readonly filesUploadedTitle = () => this.getContent("filesUploadedTitle");
  public readonly filesUploadedSubtitle = () => this.getContent("filesUploadedSubtitle");
  public readonly uploadDocumentsLabel = () => this.getContent("uploadDocumentsLabel");
}
