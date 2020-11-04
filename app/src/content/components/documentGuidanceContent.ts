import { ContentPageBase } from "../contentPageBase";
import { Content } from "../content";
import { ProjectDto } from "@framework/dtos";

export class DocumentGuidanceContent extends ContentPageBase {
  constructor(content: Content, protected project: ProjectDto | null | undefined) {
    super(content, "documentGuidance", project);
  }

  public readonly uploadGuidance = this.getContent("components.documentGuidance.uploadGuidance");
  public readonly fileSize = this.getContent("components.documentGuidance.fileSize");
  public readonly uniqueFilename = this.getContent("components.documentGuidance.uniqueFilename");
  public readonly noFilesNumberLimit = this.getContent("components.documentGuidance.noFilesNumberLimit");
  public readonly fileTypesUpload = this.getContent("components.documentGuidance.fileTypesUpload");
  public readonly pdfFiles = this.getContent("components.documentGuidance.pdfFiles");
  public readonly textFiles = this.getContent("components.documentGuidance.textFiles");
  public readonly presentationFiles = this.getContent("components.documentGuidance.presentationFiles");
  public readonly spreadsheetFiles = this.getContent("components.documentGuidance.spreadsheetFiles");
  public readonly imagesFiles = this.getContent("components.documentGuidance.imagesFiles");
  public readonly fileTypesQuestion = this.getContent("components.documentGuidance.fileTypesQuestion");
}
