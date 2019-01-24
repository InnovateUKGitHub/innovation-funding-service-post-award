import contextProvider from "../features/common/contextProvider";
import { GetAllQuery } from "../features/contacts/getAllQuery";
import { GetByIdQuery } from "../features/contacts/getByIdQuery";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IContactsApi {
  get: (params: ApiParams<{ contactId: string }>) => Promise<IContact | null>;
  getAll: (params: ApiParams<{}>) => Promise<IContact[]>;
}

class Controller extends ControllerBase<IContact> implements IContactsApi {

  constructor() {
    super("contacts");

    this.getItems("/", p => ({}), (p) => this.getAll(p));
    this.getItem("/:contactId", p => ({ contactId: p.contactId }), (p) => this.get(p));
  }

  public async getAll(params: ApiParams<{}>) {
    const query = new GetAllQuery();
    return contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<{ contactId: string }>) {
    const query = new GetByIdQuery(params.contactId);
    return contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
