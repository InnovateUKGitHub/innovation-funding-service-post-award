import { ContentBase } from "../contentBase";

export class DocumentLabels extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "document-labels");
  }

  public readonly uploadInputLabel = () => this.getContent("uploadInputLabel");
  public readonly uploadButtonLabel = () => this.getContent("uploadButtonLabel");
  public readonly fileNameLabel = () => this.getContent("fileNameLabel");
  public readonly dateUploadedLabel = () => this.getContent("dateUploadedLabel");
  public readonly fileSizeLabel = () => this.getContent("fileSizeLabel");
  public readonly uploadedByLabel = () => this.getContent("uploadedByLabel");
}
