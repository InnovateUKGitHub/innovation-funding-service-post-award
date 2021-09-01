import bytes from "bytes";

import { IAppOptions } from "@framework/types/IAppOptions";
import { ContentPageBase } from "@content/contentPageBase";
import { Content } from "@content/content";

export class DocumentGuidanceContent extends ContentPageBase {
  constructor(content: Content, competitionType?: string) {
    super(content, "documentGuidance", competitionType);
  }

  public readonly fileSize = (sizeInBytes: IAppOptions["maxFileSize"]) => {
    const maxFileSize = bytes(sizeInBytes);

    return this.getContent("components.documentGuidance.fileSize", { maxFileSize });
  };

  public readonly uploadGuidance = this.getContent("components.documentGuidance.uploadGuidance");
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
