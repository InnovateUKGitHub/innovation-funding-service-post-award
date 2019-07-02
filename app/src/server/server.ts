import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Configuration, Logger } from "./features/common";
import { allowCache, noCache, setOwaspHeaders } from "./cacheHeaders";
import { router as healthRouter } from "./health";
import { router as authRouter } from "./auth";
import { router } from "./router";
import contextProvider from "./features/common/contextProvider";
import { GetPermissionGroupQuery } from "./features/general/getPermissionGroupsQuery";
import { PermissionGroupIdenfifier } from "@framework/types/permisionGroupIndentifier";
import { IContext } from "@framework/types";

export class Server {
  private app: express.Express;
  private log: Logger;

  constructor(private readonly port: number) {
    this.app = express();
    this.log = new Logger();

    this.app.enable("trust proxy");
    this.middleware();
    this.routing();
  }

  public start() {
    this.app.listen(this.port);
    this.log.info(`Listening at ${process.env.SERVER_URL}`);
    this.log.info("Configuration", Configuration);
    setTimeout(() => this.primeCaches());
  }

  private middleware() {
    this.app.use([
      cors(),
      bodyParser.urlencoded({ extended: false }),
      bodyParser.json(),
      this.requestLogger
    ]);
  }

  private requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    this.log.debug(req.url);
    next();
  }

  private routing() {
    this.app.use(setOwaspHeaders, allowCache, express.static("public"));
    this.app.use(noCache, healthRouter);
    this.app.use(authRouter);
    this.app.use(setOwaspHeaders, noCache, router);
  }

  private primeCaches() {
    const context = contextProvider.start({ user: { email: Configuration.salesforce.serivceUsername } });
    // if developing dont prime as will mean too many calls if watching build, presuming that prod urls all start with https:// and dev http://
    if (context.config.serverUrl.startsWith("https://")) {
      // calls to query that prime caches doe as service user
      this.primeCache(context, "Permission group cache", () => context.runQuery(new GetPermissionGroupQuery(PermissionGroupIdenfifier.ClaimsTeam)));
    }
  }

  private primeCache(context: IContext, message: string, perform: () => Promise<{}>) {
    context.logger.info("Priming cache", message);
    perform()
      .then(x => context.logger.info("Successfully primed cache", message))
      .catch(e => context.logger.error("Unable to primed cache", message, e));
  }
}
