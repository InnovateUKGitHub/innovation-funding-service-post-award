// tslint:disable:no-var-requires

import { IApiClient } from "../server/apis";

// use server api file here. It gets overwritten for clientside by webpack
const apiModule: IApiClient = require(`./serverApiClient`).default;

export const ApiClient = apiModule;
