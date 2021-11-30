import { Content } from "@content/content";
import { ContentPageBase } from "@content/contentPageBase";
import { IFileWrapper } from "@framework/types";

export class LoanRequestContent extends ContentPageBase {
  constructor(content: Content) {
    super(content, "loans-request");
  }

  public readonly loadingDrawdown = this.getContent("loadingDrawdown");
  public readonly errorDrawdown = this.getContent("errorDrawdown");

  public readonly backToLoanOverview = this.getContent("backToLoanOverview");
  public readonly changeDrawdownLabel = this.getContent("changeDrawdownLabel");

  public readonly requestIntroPart1 = this.getContent("introPart1");
  public readonly requestIntroPart2 = this.getContent("introPart2");

  public readonly uploadTitle = this.getContent("uploadTitle");
  public readonly uploadFormLabel = this.getContent("uploadFormLabel");
  public readonly uploadIntro = this.getContent("uploadIntro");
  public readonly uploadFormButton = this.getContent("uploadFormButton");

  public readonly commentTitle = this.getContent("commentTitle");
  public readonly commentHint = this.getContent("commentHint");

  public readonly loanDeclarationTitle = this.getContent("loanDeclarationTitle");
  public readonly loanDeclaration = this.getContent("loanDeclaration");
  public readonly loanSubmitButton = this.getContent("loanSubmitButton");

  public readonly loanDocumentsRemoved = (fileName: string) =>
    this.getContent("loanDocumentsRemoved", {
      fileName,
    });

  public readonly loanDocumentsUploaded = (docs: IFileWrapper[]) => {
    const fileCount = docs.length;
    const hasSingleDocument = fileCount === 1;

    return hasSingleDocument
      ? this.getContent("loanDocumentUploaded", { fileName: docs[0].fileName })
      : this.getContent("loanDocumentsUploaded", { fileCount });
  };
}
