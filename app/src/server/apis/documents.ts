import {ControllerBase} from "./controllerBase";
import {DocumentDto} from "../../ui/models";
import contextProvider from "../features/common/contextProvider";
import {GetDocumentsLinkedToRecordQuery} from "../features/documents/getAllForRecord";

export interface IDocumentsApi {
  getAllForRecord: (recordId: string) => Promise<DocumentDto[]>;
}

class Controller extends ControllerBase<DocumentDto> implements IDocumentsApi {
  constructor() {
    super("documents");

    this.getItems("/", (p, q) => ({ recordId: q.recordId, }), p => this.getAllForRecord(p.recordId));
  }

  public async getAllForRecord(recordId: string) {
    const query = new GetDocumentsLinkedToRecordQuery(recordId);
    return await contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
