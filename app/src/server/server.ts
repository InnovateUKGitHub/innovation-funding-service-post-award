import express from "express";
import https from "https";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import { Configuration, Logger } from "./features/common";
import { allowCache, noCache, setOwaspHeaders } from "./cacheHeaders";
import { router as healthRouter } from "./health";
import { router as authRouter } from "./auth";
import { router } from "./router";
import contextProvider from "./features/common/contextProvider";
import { GetPermissionGroupQuery } from "./features/general/getPermissionGroupsQuery";
import { IContext, PermissionGroupIdenfifier } from "@framework/types";
import { GetAllRecordTypesQuery } from "./features/general/getAllRecordTypesQuery";
import { GetCostCategoriesQuery } from "./features/claims";
import { GetClaimStatusesQuery } from "@server/features/claims/getClaimStatusesQuery";
import { GetMonitoringReportStatusesQuery } from "./features/monitoringReports/getMonitoringReportStatusesQuery";

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

  public start(secure: boolean) {
    if (secure) {
      this.startHTTPS();
    } else {
      this.app.listen(this.port);
    }

    this.log.info(`Listening at ${process.env.SERVER_URL}`);
    this.log.info("Configuration", Configuration);
    setTimeout(() => this.primeCaches());
  }

  public startHTTPS() {
    const privateKey  = fs.readFileSync("security/AccLocalDevKey.key", "utf8");
    const certificate = fs.readFileSync("security/AccLocalDevCert.crt", "utf8");

    const credentials = {key: privateKey, cert: certificate};
    const httpsServer = https.createServer(credentials, this.app);

    httpsServer.listen(this.port);
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
    this.log.debug("request", req.url, req.method);
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
      this.primeCache(context, "Record type cache", () => context.runQuery(new GetAllRecordTypesQuery()));
      this.primeCache(context, "Cost Categories cache", () => context.runQuery(new GetCostCategoriesQuery()));
      this.primeCache(context, "Claim Statuses cache", () => context.runQuery(new GetClaimStatusesQuery()));
      this.primeCache(context, "Monitoring Report Status cache", () => context.runQuery(new GetMonitoringReportStatusesQuery()));
    }
  }

  private primeCache(context: IContext, message: string, perform: () => Promise<{}>) {
    context.logger.info("Priming cache", message);
    perform()
      .then(x => context.logger.info("Successfully primed cache", message))
      .catch(e => context.logger.error("Unable to primed cache", message, e));
  }
}
