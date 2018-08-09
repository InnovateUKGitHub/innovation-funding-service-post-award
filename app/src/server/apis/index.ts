// import { Router } from "express";
// import contacts from "./contacts";

// const apiRouter = Router();

// export const apiRoutes: Router[] = [
//     contacts,
//     apiRouter.all("*", (req, res) => res.status(404).json({ error: "api route not found" }))
// ];

import { IApi } from "../../api";
import * as contacts from "./contacts";

export const api: IApi = {
  contacts
};
