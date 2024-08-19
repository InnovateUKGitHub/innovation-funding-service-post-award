import { LogLevel } from "@framework/constants/enums";
import { BaseLogger } from "@shared/logger";
import { configuration } from "./features/common/config";

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

const unwrapError = (error: Error, depth: number = 0) => {
  let res = "";

  if (depth === 0) {
    res += `${error.name} >> ${error.message}\n`;
  } else {
    res += `Caused by ${error.name} >> ${error.message}\n`;
  }

  res += error.stack;
  res += "\n\n";

  if (error.cause instanceof Error) {
    res += unwrapError(error.cause, depth + 1);
  }

  return res;
};

export class ServerLogger extends BaseLogger {
  private static readonly LOG_LEVEL_PADDING = 10;
  private static readonly LOG_IDENTIFIER_PADDING = 12;

  protected log(level: LogLevel, message: string, ...params: unknown[]) {
    if (configuration.newRelic.enabled) {
      this.logWithNewRelic(level, message, ...params);
    }

    if (configuration.developer.colourfulLogging) {
      this.logWithTeletype(level, message, ...params);
    } else {
      this.logWithConsoleLog(level, message, ...params);
    }
  }

  /**
   * Print an message to the developer's VT100 compatible terminal, at a specified verbosity level.
   *
   * @param level The logging level to print the message at.
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
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
        logLevelName = "Verbose🐥 ";
        break;
      case LogLevel.TRACE:
        fg = ForegroundColourCode.BLUE;
        bg = BackgroundColourCode.BLUE;
        logLevelName = "Trace  🐈 ";
        break;
      default:
        fg = ForegroundColourCode.DEFAULT;
        bg = BackgroundColourCode.DEFAULT;
        logLevelName = "Default😨 ";
        break;
    }

    // Print the log type name, followed by the identifier, followed by the message.
    output += colouring.byNum(logLevelName, fg);
    output += colouring.byNum(
      (this.identifier ?? "Logger").padEnd(ServerLogger.LOG_IDENTIFIER_PADDING),
      ForegroundColourCode.CYAN,
    );
    output += " ";
    output += message;

    // If any params exist...
    for (const param of [...this.prefixLines, ...params]) {
      // Add a new line to print the param onto.
      output += "\n";

      let inspectedParam: string;

      // Try and convert the unknown type into a string.
      if (typeof param === "undefined") {
        inspectedParam = "undefined";
      } else if (param instanceof Error) {
        inspectedParam = unwrapError(param);
      } else if (typeof param === "object") {
        inspectedParam = JSON.stringify(param);
        if (inspectedParam.length > 150) inspectedParam = JSON.stringify(param, null, 2);
      } else {
        inspectedParam = String(param);
      }

      // Split the string into it's consituent lines
      const lines = inspectedParam.split("\n");

      // For each line...
      output += lines
        .map(line => {
          let spaces = "";

          // Print (LOG_LEVEL_PADDING) spaces, except for the second-to-last column.
          // This column will have a background colour of the log level printed.
          for (let i = 0; i < ServerLogger.LOG_LEVEL_PADDING; i++) {
            if (i === ServerLogger.LOG_LEVEL_PADDING - 2) {
              spaces += colouring.bg(" ", bg);
            } else {
              spaces += " ";
            }
          }

          return spaces + line;
        })
        .join("\n");
    }

    // Print the output.
    console.log(output);
  }

  /**
   * Print an message to the terminal.
   * Not suitable for development, as it prints out JSON strings, which is hard to read.
   *
   * @param level The logging level to print the message at.
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
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

  private logWithNewRelic(level: LogLevel, message: string, ...params: unknown[]) {
    // newrelic is a global variable instantiated as a banner of the webpack/esbuild build
    // @ts-expect-error TODO: Additional values are allowed to be passed to newrelic#recordLogEvent
    if (newrelic) newrelic.recordLogEvent({ level, timestamp: Date.now(), message, params });
  }
}
