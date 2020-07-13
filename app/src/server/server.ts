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
import { GetPcrStatusesQuery } from "./features/pcrs/getPcrStatusesQuery";
import { initInternationalisation, internationalisationRouter } from "./internationalisation";
import { InitialiseContentCommand } from "./features/general/initialiseContentCommand";
import { GetPcrProjectRolesQuery } from "@server/features/pcrs/getPcrProjectRolesQuery";
import { GetPcrPartnerTypesQuery } from "@server/features/pcrs/getPcrPartnerTypesQuery";
import { GetPcrParticipantSizesQuery } from "@server/features/pcrs/getPcrParticipantSizesQuery";
import { GetPcrProjectLocationsQuery } from "@server/features/pcrs/getPcrProjectLocationsQuery";
import { GetPcrSpendProfileCapitalUsageTypesQuery } from "./features/pcrs/getPcrSpendProfileCapitalUsageTypesQuery";
import { GetPcrSpendProfileOverheadRateOptionsQuery } from "@server/features/pcrs/getPcrSpendProfileOverheadRateOptionsQuery";

export class Server {
  private readonly app: express.Express;
  private readonly log: Logger;

  constructor(private readonly port: number) {
    this.app = express();
    this.log = new Logger();

    this.app.enable("trust proxy");
    this.middleware();
    this.routing();
  }

  public async start(secure: boolean) {
    await initInternationalisation()
      .then(_ => this.initaliseCustomContent(false))
      .catch(e => {
        console.log("Failed to initialize internationalization", e);
        throw e;
      });

    if (secure) {
      this.startHTTPS();
    } else {
      this.app.listen(this.port);
    }

    this.log.info(`Listening at ${process.env.SERVER_URL}`);
    this.log.info("Configuration", Configuration);

    setTimeout(() => this.primeCaches());

    if (Configuration.features.customContent) {

      setTimeout(() => this.initaliseCustomContent(true));

      if (Configuration.timeouts.contentRefreshSeconds) {
        setInterval(() => this.initaliseCustomContent(true), Configuration.timeouts.contentRefreshSeconds * 1000);
      }
    }
  }

  private startHTTPS() {
    const privateKey = fs.readFileSync("security/AccLocalDevKey.key", "utf8");
    const certificate = fs.readFileSync("security/AccLocalDevCert.crt", "utf8");

    const credentials = { key: privateKey, cert: certificate };
    const httpsServer = https.createServer(credentials, this.app);

    httpsServer.listen(this.port);
  }

  private middleware() {
    this.app.use([
      cors({
        origin: true
      }),
      bodyParser.urlencoded({ extended: false }),
      bodyParser.json(),
      this.handleGetWithPlus,
      this.requestLogger
    ]);
  }

  private readonly requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    this.log.debug("request", req.url, req.method);
    next();
  }

  private readonly handleGetWithPlus = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    /// pluses don't get handled by router 5 when round tripped
    /// with js disabled form submits values with + rather then %20
    /// when js is enabled router 5 handles it
    if (req.method === "GET" && req.url.match(/\+/)) {
      res.redirect(req.url.replace(/\+/g, "%20"));
    }
    else {
      next();
    }
  }

  private routing() {
    this.app.use(setOwaspHeaders, allowCache, express.static("public"));
    this.app.use(noCache, healthRouter);
    this.app.use(authRouter);
    this.app.use(internationalisationRouter);
    this.app.use(setOwaspHeaders, noCache, router);
    this.app.disable("x-powered-by");
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
      this.primeCache(context, "Project Change Request Status cache", () => context.runQuery(new GetPcrStatusesQuery()));
      this.primeCache(context, "Project Change Request Project Roles cache", () => context.runQuery(new GetPcrProjectRolesQuery()));
      this.primeCache(context, "Project Change Request Partner Types cache", () => context.runQuery(new GetPcrPartnerTypesQuery()));
      this.primeCache(context, "Project Change Request Participant Sizes cache", () => context.runQuery(new GetPcrParticipantSizesQuery()));
      this.primeCache(context, "Project Change Request Project Locations cache", () => context.runQuery(new GetPcrProjectLocationsQuery()));
      this.primeCache(context, "Project Change Request Spend Profile Capital Usage Types cache", () => context.runQuery(new GetPcrSpendProfileCapitalUsageTypesQuery()));
      this.primeCache(context, "Project Change Request Spend Profile Overhead Rate Options cache", () => context.runQuery(new GetPcrSpendProfileOverheadRateOptionsQuery()));
    }
  }

  private primeCache(context: IContext, message: string, perform: () => Promise<{}>) {
    context.logger.info("Priming cache", message);
    perform()
      .then(x => context.logger.info("Successfully primed cache", message))
      .catch(e => context.logger.error("Unable to primed cache", message, e));
  }

  private initaliseCustomContent(loadCustom: boolean) {
    const context = contextProvider.start({ user: { email: Configuration.salesforce.serivceUsername } });
    return context.runCommand(new InitialiseContentCommand(loadCustom))
      .then(updated => {
        if (updated) {
          context.logger.info("Successfully initialised content");
        }
      })
      .catch(e => context.logger.error("Unable to initialised content", e));
  }
}
