// import express from "express";
import contextProvider from "../features/common/contextProvider";
import { GetAllQuery } from "../features/contacts/getAllQuery";
import { GetByIdQuery } from "../features/contacts/getByIdQuery";

// const apiRouter = express.Router();

export async function getAll() {
  const query   = new GetAllQuery();
  const context = contextProvider.start();
  return await context.runQuery(query);
}

export async function get(id: string) {
  const query   = new GetByIdQuery(id);
  const context = contextProvider.start();
  return await context.runQuery(query);
}
