import {ControllerBase} from "./controllerBase";
import {DocumentDto} from "../../ui/models";

export interface IDocumentsApi {
  getAll: (entityId: string) => Promise<DocumentDto[]>;
}

class Controller extends ControllerBase<DocumentDto> implements IDocumentsApi {
  constructor() {
    super("documents");

    this.getItems("/", (p, q) => ({ entityId: q.entityId, }), p => this.getAll(p.entityId));
  }

  public async getAll(entityId: string) {
    return Promise.resolve(
      [
        {
          title: "Document 1",
          url: "www.google.com",
        }
      ]
      );
  }
}

export const controller = new Controller();
