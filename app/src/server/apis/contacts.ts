// import express from "express";
import contextProvider from "../features/common/contextProvider";
import { GetAllQuery } from "../features/contacts/getAllQuery";
import { GetByIdQuery } from "../features/contacts/getByIdQuery";
import { IContact } from "../../ui/models";
import { ControllerBase, ISession } from "./controllerBase";

export interface IContactsApi {
  get: (params: {id: string} & ISession) => Promise<IContact|null>;
  getAll: (params: ISession) => Promise<IContact[]>;
}

class Controller extends ControllerBase<IContact> implements IContactsApi {

  constructor() {
    super("contacts");

    this.getItems("/", p => ({}),  (p) => this.getAll(p));
    this.getItem("/:id", p => ({ id: p.id }),  (p) => this.get(p));
  }

  public async getAll(params: ISession) {
    const query = new GetAllQuery();
    return await contextProvider.start(params.user).runQuery(query);
  }

  public async get(params: {id: string} & ISession) {
    const query = new GetByIdQuery(params.id);
    return await contextProvider.start(params.user).runQuery(query);
  }
}

export const controller = new Controller();
