import {IContext, IQuery} from "../common/context";
import {DocumentDto} from "../../../ui/models";
import {GetDocumentsLinkedToRecordQuery} from "./getAllForRecord";

export class GetClaimDetailDocumentsQuery implements IQuery<DocumentDto[]> {
  constructor(public partnerId: string, public periodId: number, public costCategoryId: string) {
  }

  public async Run(context: IContext) {
    const claimDetail = await context.repositories.claimDetails.get(this.partnerId, this.periodId, this.costCategoryId);
    return context.runQuery(new GetDocumentsLinkedToRecordQuery(claimDetail.Id));
  }
}
