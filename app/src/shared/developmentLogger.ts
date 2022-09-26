import { LogLevel } from "@framework/constants";
import { parseLogLevel } from "@framework/types/logLevel";

enum LogMethod {
  TELETYPE,
  WEB,
  CONSOLE_LOG,
}

enum ForegroundColourCode {
  BLACK = 30,
  RED = 31,
  GREEN = 32,
  YELLOW = 33,
  BLUE = 34,
  MAGENTA = 35,
  CYAN = 36,
  WHITE = 37,
  BRIGHT_BLACK = 90,
  BRIGHT_RED = 91,
  BRIGHT_GREEN = 92,
  BRIGHT_YELLOW = 93,
  BRIGHT_BLUE = 94,
  BRIGHT_MAGENTA = 95,
  BRIGHT_CYAN = 96,
  BRIGHT_WHITE = 97,
  DEFAULT = 39,
}

enum BackgroundColourCode {
  BLACK = 40,
  RED = 41,
  GREEN = 42,
  YELLOW = 43,
  BLUE = 44,
  MAGENTA = 45,
  CYAN = 46,
  WHITE = 47,
  BRIGHT_BLACK = 100,
  BRIGHT_RED = 101,
  BRIGHT_GREEN = 102,
  BRIGHT_YELLOW = 103,
  BRIGHT_BLUE = 104,
  BRIGHT_MAGENTA = 105,
  BRIGHT_CYAN = 106,
  BRIGHT_WHITE = 107,
  DEFAULT = 49,
}

const colouring = {
  byNum: (mess: string, fgNum?: ForegroundColourCode, bgNum?: BackgroundColourCode) => {
    let output = "";
    mess = mess || "";
    if (fgNum) {
      output += "\u001b[" + fgNum + "m";
    }
    if (bgNum) {
      output += "\u001b[" + bgNum + "m";
    }
    output += mess;
    output += "\u001b[39m\u001b[49m";

    return output;
  },
  fg: (message: string, fgNum: ForegroundColourCode) => {
    return colouring.byNum(message, fgNum);
  },
  bg: (message: string, bgNum: BackgroundColourCode) => {
    return colouring.byNum(message, undefined, bgNum);
  },
};

interface LoggerOptions {
  prefixLines: string[];
  logLevel: LogLevel;
}

export interface ILogger {
  debug(location: string, ...params: unknown[]): void;
  info(location: string, ...params: unknown[]): void;
  warn(location: string, ...params: unknown[]): void;
  error(location: string, ...params: unknown[]): void;
  clone(options: Partial<LoggerOptions>): ILogger;
}

export class Logger implements ILogger {
  private static readonly logMethod: LogMethod = (() => {
    if (typeof process !== "undefined") {
      if (process.env.NODE_ENV === "development") return LogMethod.TELETYPE;
      if (process.argv.includes("--dev")) return LogMethod.TELETYPE;

      return LogMethod.CONSOLE_LOG;
    }

    if (typeof window !== "undefined") {
      return LogMethod.WEB;
    }

    return LogMethod.CONSOLE_LOG;
  })();

  private readonly identifier: string;
  private readonly options: LoggerOptions;

  constructor(identifier: string, options?: Partial<LoggerOptions>) {
    this.identifier = identifier || "FIXME";
    let logLevel: LogLevel;

    if (options?.logLevel) {
      logLevel = options?.logLevel;
    } else if (process.env) {
      logLevel = parseLogLevel((process.env.LOG_LEVEL || process.env.LOGLEVEL) ?? "ERROR");
    } else {
      logLevel = LogLevel.ERROR;
    }

    this.options = {
      prefixLines: options?.prefixLines ?? [],
      logLevel,
    };
  }

  clone(options: LoggerOptions): Logger {
    return new Logger(this.identifier, {
      prefixLines: [...options.prefixLines, ...this.options.prefixLines],
    });
  }

  debug(message: string, ...params: unknown[]) {
    this.log(LogLevel.DEBUG, message, ...params);
  }

  info(message: string, ...params: unknown[]) {
    this.log(LogLevel.INFO, message, ...params);
  }

  warn(message: string, ...params: unknown[]) {
    this.log(LogLevel.WARN, message, ...params);
  }

  error(message: string, ...params: unknown[]) {
    this.log(LogLevel.ERROR, message, ...params);
  }

  private log(level: LogLevel, message: string, ...params: unknown[]) {
    if (level >= this.options.logLevel) {
      switch (Logger.logMethod) {
        case LogMethod.TELETYPE:
          return this.logWithTeletype(level, message, ...params);
        case LogMethod.WEB:
        case LogMethod.CONSOLE_LOG:
        default:
          return this.logWithConsoleLog(level, message, ...params);
      }
    }
  }

  private static readonly LOG_LEVEL_PADDING = 10;
  private static readonly LOG_IDENTIFIER_PADDING = 12;

  private async logWithTeletype(level: LogLevel, message: string, ...params: unknown[]) {
    let output = "";
    let fg: ForegroundColourCode;
    let bg: BackgroundColourCode;
    let logLevelName: string;

    // Adjust colours and message content for different log levels.
    switch (level) {
      case LogLevel.ERROR:
        fg = ForegroundColourCode.RED;
        bg = BackgroundColourCode.RED;
        logLevelName = "Error ⛔  ";
        break;
      case LogLevel.WARN:
        fg = ForegroundColourCode.YELLOW;
        bg = BackgroundColourCode.YELLOW;
        logLevelName = "Warn   ⚠  ";
        break;
      case LogLevel.DEBUG:
        fg = ForegroundColourCode.BLUE;
        bg = BackgroundColourCode.BLUE;
        logLevelName = "Debug  🐣 ";
        break;
      case LogLevel.INFO:
        fg = ForegroundColourCode.BLUE;
        bg = BackgroundColourCode.BLUE;
        logLevelName = "Info   📘 ";
        break;
      case LogLevel.VERBOSE:
        fg = ForegroundColourCode.BLUE;
        bg = BackgroundColourCode.BLUE;
        logLevelName = "Trace  🐥 ";
        break;
      default:
        fg = ForegroundColourCode.DEFAULT;
        bg = BackgroundColourCode.DEFAULT;
        logLevelName = "Default😨 ";
        break;
    }

    output += colouring.byNum(logLevelName, fg);
    output += colouring.byNum(this.identifier.padEnd(Logger.LOG_IDENTIFIER_PADDING), ForegroundColourCode.CYAN);
    output += message;

    for (const param of [...this.options.prefixLines, ...params]) {
      let inspectedParam: string;

      if (typeof param === "undefined") {
        inspectedParam = "undefined";
      } else if (typeof param === "object") {
        inspectedParam = JSON.stringify(param, null, 2);
      } else {
        inspectedParam = String(param);
      }

      // If inspected output takes more than one line...
      const lines = inspectedParam.split("\n");
      output += "\n";
      output += lines
        .map(line => {
          let spaces = "";

          for (let i = 0; i < Logger.LOG_LEVEL_PADDING; i++) {
            if (i === Logger.LOG_LEVEL_PADDING - 2) {
              spaces += colouring.bg(" ", bg);
            } else {
              spaces += " ";
            }
          }

          return spaces + line;
        })
        .join("\n");
    }

    console.log(output);
  }

  private logWithConsoleLog(level: LogLevel, message: string, ...params: unknown[]) {
    const item = {
      type: LogLevel[level],
      identifier: this.identifier || "",
      time: new Date().toISOString(),
      message,
      params,
    };
    const output = JSON.stringify(item, null, 2);
    console.info(output);
  }
}
