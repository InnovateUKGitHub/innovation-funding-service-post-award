import {ControllerBase} from "./controllerBase";
import {DocumentDto} from "../../ui/models";
import contextProvider from "../features/common/contextProvider";
import {GetClaimDetailDocumentsQuery} from "../features/documents/getClaimDetailDocuments";

export interface IDocumentsApi {
  getClaimDetailDocuments: (partnerId: string, periodId: number, costCategoryId: string) => Promise<DocumentDto[]>;
}

class Controller extends ControllerBase<DocumentDto> implements IDocumentsApi {
  constructor() {
    super("documents");

    this.getItems(
      "/claim-details/:partnerId/:periodId/:costCategoryId",
      (p) => ({ partnerId: p.partnerId, periodId: p.periodId, costCategoryId: p.costCategoryId }),
        p => this.getClaimDetailDocuments(p.partnerId, p.periodId, p.costCategoryId));
  }

  public async getClaimDetailDocuments(partnerId: string, periodId: number, costCategoryId: string) {
    const query = new GetClaimDetailDocumentsQuery(partnerId, periodId, costCategoryId);
    return await contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
