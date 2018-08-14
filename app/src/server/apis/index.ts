import { IApi } from "../../api";
import * as contacts from "./contacts";
import * as projects from "./projects";
import express, {Request, Response, NextFunction} from "express";
import { ControllerBase } from "./controllerBase";

export const api: IApi = {
  contacts : contacts.controller,
  projects : projects.controller
};

const apiRoutes: ControllerBase<{}>[] = [
  contacts.controller,
  projects.controller,
];

export const router = express.Router();

function handleError(err: any, req: express.Request, res: express.Response, next: express.NextFunction){
  res.status(500).json({ message: "An unexpected Error has occoured", details: {...err }});
}

apiRoutes.forEach(item => {
  if(item){
    router.use("/" + item.path, [item.router, handleError]);
  }
});

router.all("*", (req, res, next) => res.status(404).send());