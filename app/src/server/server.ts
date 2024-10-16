import express from "express";
import crypto from "crypto";

import { getAuthRouter } from "@server/auth";
import { router as cspRouter } from "@server/csp";
import { getServerRoutes, noAuthRouter } from "@server/router";
import { useBasicAuth } from "./basicAuth";

import { allowCache, noCache, setOwaspHeaders, setBasicAuth } from "@server/cacheHeaders";

import { contextProvider } from "@server/features/common/contextProvider";
import { InitialiseContentCommand } from "@server/features/general/initialiseContentCommand";
import { fetchCaches } from "@server/features/initialCache";
import { initInternationalisation, internationalisationRouter } from "@server/internationalisation";
import { developmentRouter } from "@server/developmentReloader";
import { Logger } from "@shared/developmentLogger";
import { ILogger } from "@shared/logger";
import { configuration } from "./features/common/config";
import { v4 } from "uuid";

export class Server {
  private readonly app: express.Express;
  private readonly logger: ILogger;

  constructor(private readonly isDevelopment: boolean) {
    this.app = express();
    this.logger = new Logger("Webserver");
  }

  public async start() {
    this.app.enable("trust proxy");

    if (this.isDevelopment) {
      this.development();
    }

    this.middleware();
    await this.routing();

    try {
      await initInternationalisation();
      await this.initialiseCustomContent(false);
    } catch (error) {
      console.log("Failed to initialize internationalization", error);

      throw error;
    }

    this.app.listen(configuration.webserver.port);
    this.logger.info("Configuration", configuration);
    this.logger.info(`Webserver is now available at ${configuration.webserver.url}`);

    setTimeout(() => this.primeCaches());

    if (configuration.features.customContent) {
      setTimeout(() => this.initialiseCustomContent(true));

      if (configuration.timeouts.contentRefreshSeconds) {
        setInterval(() => this.initialiseCustomContent(true), configuration.timeouts.contentRefreshSeconds * 1000);
      }
    }
  }

  private middleware(): void {
    this.app.use([
      express.urlencoded({ extended: false, limit: "50mb", parameterLimit: 100000 }),
      express.json({ type: ["application/json", "application/csp-report"], limit: "50mb" }),
      this.handleRouter5GetWithPlus,
      this.requestLogger,
    ]);
  }

  private development(): void {
    this.app.use(developmentRouter);
  }

  private readonly requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const traceId = v4({});
    newrelic?.addCustomAttribute("acc.traceId", traceId);
    res.locals.traceId = traceId;

    this.logger.debug(`${req.method} Request - ${req.url}`, { traceId });

    next();
  };

  // TODO: Check this requirement when router is updated/replaced
  private readonly handleRouter5GetWithPlus = (
    { method, url }: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void => {
    const isGetRequest = method === "GET";

    if (!isGetRequest) {
      next();
      return;
    }

    /// pluses don't get handled by router 5 when round tripped
    /// with js disabled form submits values with + rather then %20
    /// when js is enabled router 5 handles it
    const urlContainsPlus = url.match(/\+/);

    if (urlContainsPlus) {
      res.redirect(url.replace(/\+/g, "%20"));
    } else {
      next();
    }
  };

  private readonly setNonceValue = (_req: express.Request, res: express.Response, next: express.NextFunction): void => {
    const nonce = crypto.randomBytes(16).toString("base64");
    res.locals.nonce = nonce;

    next();
  };

  private readonly preloadReduxActions = (
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): void => {
    res.locals.preloadedReduxActions = [];

    next();
  };

  private readonly messages = (_req: express.Request, res: express.Response, next: express.NextFunction): void => {
    res.locals.messages = [];
    next();
  };

  private async routing(): Promise<void> {
    this.app.use(this.setNonceValue);
    this.app.use(this.preloadReduxActions);
    this.app.use(this.messages);
    this.app.use(setOwaspHeaders, allowCache, setBasicAuth, express.static("public"));
    this.app.use(useBasicAuth);
    this.app.use(noCache, noAuthRouter);
    this.app.use(noCache, cspRouter);
    this.app.use(await getAuthRouter());
    this.app.use(internationalisationRouter);
    this.app.use(setOwaspHeaders, noCache, await getServerRoutes());
    this.app.disable("x-powered-by");
  }

  // Note: We are making non-user sensitive queries fetch all cacheable data!
  private readonly stubEmail = configuration.salesforceServiceUser.serviceUsername;

  private async primeCaches(): Promise<void> {
    const cacheContext = await contextProvider.start({ user: { email: this.stubEmail }, traceId: "prime-caches" });

    await fetchCaches(cacheContext);
  }

  private async initialiseCustomContent(loadCustom: boolean): Promise<void> {
    const context = await contextProvider.start({
      user: { email: this.stubEmail },
      traceId: "initalise-custom-content",
    });

    try {
      const hasInitialised = await context.runCommand(new InitialiseContentCommand(loadCustom));

      if (!hasInitialised) {
        throw new Error(`Command ran but returned '${hasInitialised}'`);
      }

      context.logger.info("Successfully initialised content");
    } catch (error) {
      context.logger.error("Unable to initialised content", error);
    }
  }
}
