import { ContentBase } from "../contentBase";
import { DocumentDescription } from "@framework/constants";

export class DocumentLabels extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "document-labels");
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
}
