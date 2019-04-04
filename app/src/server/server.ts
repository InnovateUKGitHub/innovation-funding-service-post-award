import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Configuration, Logger } from "./features/common";
import { allowCache, noCache, setOwaspHeaders } from "./cacheHeaders";
import { router as healthRouter} from "./health";
import { router as authRouter } from "./auth";
import { router } from "./router";

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
}
