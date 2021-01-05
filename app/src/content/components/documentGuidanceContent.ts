import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";

export class DocumentGuidanceContent extends ContentPageBase {
  constructor(content: Content, protected competitionType?: string) {
    super(content, "documentGuidance", competitionType);
  }

  public readonly uploadGuidance = this.getContent("components.documentGuidance.uploadGuidance");
  public readonly fileSize = this.getContent("components.documentGuidance.fileSize");
  public readonly uniqueFilename = this.getContent("components.documentGuidance.uniqueFileName");
  public readonly noFilesNumberLimit = this.getContent("components.documentGuidance.noFilesNumberLimit");
  public readonly fileTypesUpload = this.getContent("components.documentGuidance.fileTypesUpload");
  public readonly pdfFiles = this.getContent("components.documentGuidance.pdfFiles");
  public readonly textFiles = this.getContent("components.documentGuidance.textFiles");
  public readonly presentationFiles = this.getContent("components.documentGuidance.presentationFiles");
  public readonly spreadsheetFiles = this.getContent("components.documentGuidance.spreadsheetFiles");
  public readonly availableImageExtensions = this.getContent("components.documentGuidance.availableImageExtensions");
  public readonly fileTypesQuestion = this.getContent("components.documentGuidance.fileTypesQuestion");
}
