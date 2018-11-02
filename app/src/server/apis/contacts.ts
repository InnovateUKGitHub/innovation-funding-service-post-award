// import express from "express";
import contextProvider from "../features/common/contextProvider";
import { GetAllQuery } from "../features/contacts/getAllQuery";
import { GetByIdQuery } from "../features/contacts/getByIdQuery";
import { IContact } from "../../ui/models";
import { ApiParams, ControllerBase } from "./controllerBase";

export interface IContactsApi {
  get: (params: ApiParams<{ id: string }>) => Promise<IContact | null>;
  getAll: (params: ApiParams<{}>) => Promise<IContact[]>;
}

class Controller extends ControllerBase<IContact> implements IContactsApi {

  constructor() {
    super("contacts");

    this.getItems("/", p => ({}), (p) => this.getAll(p));
    this.getItem("/:id", p => ({ id: p.id }), (p) => this.get(p));
  }

  public async getAll(params: ApiParams<{}>) {
    const query = new GetAllQuery();
    return await contextProvider.start(params).runQuery(query);
  }

  public async get(params: ApiParams<{ id: string }>) {
    const query = new GetByIdQuery(params.id);
    return await contextProvider.start(params).runQuery(query);
  }
}

export const controller = new Controller();
