// tslint:disable:no-var-requires

import { IApiClient } from "../server/apis";

declare const __SERVER_ENV__: boolean;

let apiModule: IApiClient;

if (typeof __SERVER_ENV__ !== "undefined" && __SERVER_ENV__ === true) {
  apiModule = require("./serverApiClient").default;
}
else {
  apiModule = require("./clientApiClient").default;
}

export const ApiClient = apiModule;
