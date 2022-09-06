import https from "https";
import fs from "fs";
import express from "express";
import { v4 as uuidV4 } from "uuid";

import { router as cspRouter } from "@server/csp";
import { router as authRouter } from "@server/auth";
import { router, noAuthRouter } from "@server/router";

import { allowCache, noCache, setOwaspHeaders } from "@server/cacheHeaders";
import { initInternationalisation, internationalisationRouter } from "@server/internationalisation";
import { contextProvider } from "@server/features/common/contextProvider";
import { configuration, Logger } from "@server/features/common";
import { InitialiseContentCommand } from "@server/features/general/initialiseContentCommand";
import { fetchCaches } from "@server/features/initialCache";

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

  public async start(serveHttps: boolean) {
    try {
      await initInternationalisation();
      await this.initialiseCustomContent(false);
    } catch (error) {
      console.log("Failed to initialize internationalization", error);

      throw error;
    }

    if (serveHttps) {
      this.startHTTPS();
    } else {
      this.app.listen(this.port);
    }

    this.log.info(`Listening at ${process.env.SERVER_URL}`);
    this.log.info("Configuration", configuration);

    setTimeout(() => this.primeCaches());

    if (configuration.features.customContent) {
      setTimeout(() => this.initialiseCustomContent(true));

      if (configuration.timeouts.contentRefreshSeconds) {
        setInterval(() => this.initialiseCustomContent(true), configuration.timeouts.contentRefreshSeconds * 1000);
      }
    }
  }

  private startHTTPS(): void {
    const privateKey = fs.readFileSync("security/AccLocalDevKey.key", "utf8");
    const certificate = fs.readFileSync("security/AccLocalDevCert.crt", "utf8");

    const credentials = { key: privateKey, cert: certificate };
    const httpsServer = https.createServer(credentials, this.app);

    httpsServer.listen(this.port);
  }

  private middleware(): void {
    this.app.use([
      express.urlencoded({ extended: false, limit: "50mb", parameterLimit: 100000 }),
      express.json({ type: ["application/json", "application/csp-report"], limit: "50mb" }),
      this.handleRouter5GetWithPlus,
      this.requestLogger,
    ]);
  }

  private readonly requestLogger = (req: express.Request, _res: express.Response, next: express.NextFunction): void => {
    this.log.debug("request", req.url, req.method);

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
    res.locals.nonce = uuidV4();

    next();
  };

  private routing(): void {
    this.app.use(this.setNonceValue);
    this.app.use(setOwaspHeaders, allowCache, express.static("public"));
    this.app.use(noCache, noAuthRouter);
    this.app.use(noCache, cspRouter);
    this.app.use(authRouter);
    this.app.use(internationalisationRouter);
    this.app.use(setOwaspHeaders, noCache, router);
    this.app.disable("x-powered-by");
  }

  // Note: We are making non-user sensitive queries fetch all cacheable data!
  private readonly stubEmail = configuration.salesforce.serviceUsername;

  private async primeCaches(): Promise<void> {
    const cacheContext = contextProvider.start({ user: { email: this.stubEmail } });

    await fetchCaches(cacheContext);
  }

  private async initialiseCustomContent(loadCustom: boolean): Promise<void> {
    const context = contextProvider.start({ user: { email: this.stubEmail } });

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
