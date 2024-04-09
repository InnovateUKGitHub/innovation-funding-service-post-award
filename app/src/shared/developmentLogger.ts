import type { ClientLogger } from "@client/clientLogger";
import { ServerLogger } from "@server/serverLogger";

const Logger: typeof ClientLogger | typeof ServerLogger = ServerLogger;

export { Logger };
