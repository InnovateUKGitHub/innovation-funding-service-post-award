import { ClientLogger } from "./ClientLogger";
import { LogLevel, getLogLevelNumber, parseLogLevel } from "./LogLevel";
import { Timer } from "./Timer";

import type { ILogger } from "./ILogger";
import type { ITimer } from "./ITimer";

const Logger: typeof ClientLogger = ClientLogger;

export { Logger, ILogger, LogLevel, getLogLevelNumber, parseLogLevel, Timer, ITimer };
