import { ContentBase } from "../contentBase";

export class DocumentLabels extends ContentBase {
  constructor(parent: ContentBase) {
    super(parent, "document-labels");
  }

  public uploadInputLabel = () => this.getContent("uploadInputLabel");
  public uploadButtonLabel = () => this.getContent("uploadButtonLabel");
  public fileNameLabel = () => this.getContent("fileNameLabel");
  public dateUploadedLabel = () => this.getContent("dateUploadedLabel");
  public fileSizeLabel = () => this.getContent("fileSizeLabel");
  public uploadedByLabel = () => this.getContent("uploadedByLabel");
}
