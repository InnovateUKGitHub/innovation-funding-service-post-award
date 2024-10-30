import { ServerLogger } from "./ServerLogger";
import { LogLevel, getLogLevelNumber, parseLogLevel } from "./LogLevel";
import { Timer } from "./Timer";

import type { ClientLogger } from "./ClientLogger";
import type { ILogger } from "./ILogger";
import type { ITimer } from "./ITimer";

const Logger: typeof ClientLogger | typeof ServerLogger = ServerLogger;

export { Logger, ILogger, LogLevel, getLogLevelNumber, parseLogLevel, Timer, ITimer };
