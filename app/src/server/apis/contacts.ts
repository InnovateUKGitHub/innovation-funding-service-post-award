// import express from "express";
import contextProvider from "../features/common/contextProvider";
import { GetAllQuery } from "../features/contacts/getAllQuery";
import { GetByIdQuery } from "../features/contacts/getByIdQuery";
import { IContact } from "../../models";
import { ControllerBase } from "./controllerBase";

export interface IContactsApi {
  get: (id: string) => Promise<IContact>;
  getAll: () => Promise<IContact[]>;
}

class Controller extends ControllerBase<IContact> implements IContactsApi {
  constructor() {
    super();

    this.getItems("/", p => ({}), (p) => this.getAll());
    this.getItem("/:id", p => ({ id: p.id }), (p) => this.get(p.id));
  }

  public async getAll() {
    const query = new GetAllQuery();
    return await contextProvider.start().runQuery(query);
  }

  public async get(id: string) {
    const query = new GetByIdQuery(id);
    return await contextProvider.start().runQuery(query);
  }
}

export const controller = new Controller();
