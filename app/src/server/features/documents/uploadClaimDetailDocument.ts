import {ICommand, IContext} from "../common/context";
import {UploadDocumentCommand} from "./uploadDocument";

interface ClaimDetailKey {
  partnerId: string;
  periodId: number;
  costCategoryId: string;
}

export class UploadClaimDetailDocumentCommand implements ICommand<string> {
  constructor(private claimDetailKey: ClaimDetailKey, private content: string, private fileName: string) {
  }

  public async Run(context: IContext) {
    const claimDetail = await context.repositories.claimDetails.get(this.claimDetailKey.partnerId, this.claimDetailKey.periodId, this.claimDetailKey.costCategoryId);
    return context.runQuery(new UploadDocumentCommand( this.content, this.fileName, claimDetail.Id));
  }
}
