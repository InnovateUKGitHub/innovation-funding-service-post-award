import {IContext, IQuery} from "../common/context";
import {Stream} from "stream";

export class GetDocumentQuery implements IQuery<Stream> {
  constructor(public documentId: string) {
  }

  public Run(context: IContext) {
    return context.repositories.contentVersions.getDocument(this.documentId);
  }
}
