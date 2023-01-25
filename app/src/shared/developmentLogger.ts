import { LogLevel } from "@framework/constants";
import { getLogLevelNumber, parseLogLevel } from "@framework/types/logLevel";

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
  trace(location: string, ...params: unknown[]): void;
  debug(location: string, ...params: unknown[]): void;
  info(location: string, ...params: unknown[]): void;
  warn(location: string, ...params: unknown[]): void;
  error(location: string, ...params: unknown[]): void;
}

/**
 * Unified logging system for both serverside/clientside logging.
 * Automatically detects between logging with ANSI colour codes for development,
 * or logging with the standard `console.log` for web and production serverside.
 */
export class Logger implements ILogger {
  /**
   * The logging method that this Logger will adopt.
   *
   * 1. If we're in development on the server, we will use TTY colour mode.
   * 2. (in the future) on the web browser, we will use console.log CSS styles
   * 3. As a fallback, we will use the legacy console.log system.
   */
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

  private static defaultOptions: LoggerOptions = {
    prefixLines: [],
    logLevel: LogLevel.ERROR,
  };

  /**
   * Override the default options.
   *
   * @param options The options to override the default options with
   */
  static setDefaultOptions(options?: Partial<LoggerOptions>) {
    Object.assign(Logger.defaultOptions, options);
  }

  /**
   * The class/location to where this logger is located.
   * NOT FOR YOUR MESSAGE
   */
  private readonly identifier: string;

  /**
   * Options for the logger.
   */
  private readonly options: Partial<LoggerOptions> = {};

  /**
   * Create a new logger to help keep track of class/code progress.
   *
   * @param identifier The class/location to where this logger is located. This option is NOT for your message.
   * @param options Optional options to modify how the logger behaves.
   */
  constructor(identifier: string, options?: Partial<LoggerOptions>) {
    this.identifier = identifier;

    if (options?.logLevel) {
      // Obtain the overridden log level
      this.options.logLevel = options?.logLevel;
    } else if (typeof process !== "undefined") {
      // Obtain the log level if we are running on the server side.
      this.options.logLevel = parseLogLevel((process.env.LOG_LEVEL || process.env.LOGLEVEL) ?? "ERROR");
    }

    this.options.prefixLines = options?.prefixLines ?? Logger.defaultOptions.prefixLines;
  }

  /**
   * Print a trace 🐈 message to the console.
   *
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
  trace(message: string, ...params: unknown[]) {
    this.log(LogLevel.TRACE, message, ...params);
  }

  /**
   * Print a debug 🐣 message to the console.
   *
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
  debug(message: string, ...params: unknown[]) {
    this.log(LogLevel.DEBUG, message, ...params);
  }

  /**
   * Print an info 📘 message to the console.
   *
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
  info(message: string, ...params: unknown[]) {
    this.log(LogLevel.INFO, message, ...params);
  }

  /**
   * Print a warning ⚠ message to the console.
   *
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
  warn(message: string, ...params: unknown[]) {
    this.log(LogLevel.WARN, message, ...params);
  }

  /**
   * Print an error ⛔ message to the console.
   *
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
  error(message: string, ...params: unknown[]) {
    this.log(LogLevel.ERROR, message, ...params);
  }

  /**
   * Get the current LogLevel.
   * If a logLevel is not set, returns default logLevel.
   *
   * @returns The current Logger LogLevel.
   */
  private getLogLevel(): LogLevel {
    return this.options.logLevel || Logger.defaultOptions.logLevel;
  }

  /**
   * Get the currently set prefix lines.
   * If prefix lines are not set, returns default prefix lines.
   *
   * @returns The current prefix-lines.
   */
  private getPrefixLines(): string[] {
    return this.options.prefixLines || Logger.defaultOptions.prefixLines;
  }

  /**
   * Print an message to the console at a specified verbosity level.
   *
   * @param level The logging level to print the message at.
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
  private log(level: LogLevel, message: string, ...params: unknown[]) {
    if (getLogLevelNumber(level) >= getLogLevelNumber(this.getLogLevel())) {
      switch (Logger.logMethod) {
        case LogMethod.TELETYPE:
          return this.logWithTeletype(level, message, ...params);
        case LogMethod.WEB:
          return this.logWithCSS(level, message, ...params);
        case LogMethod.CONSOLE_LOG:
        default:
          return this.logWithConsoleLog(level, message, ...params);
      }
    }
  }

  private static readonly LOG_LEVEL_PADDING = 10;
  private static readonly LOG_IDENTIFIER_PADDING = 12;

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
    output += colouring.byNum(this.identifier.padEnd(Logger.LOG_IDENTIFIER_PADDING), ForegroundColourCode.CYAN);
    output += " ";
    output += message;

    // If any params exist...
    for (const param of [...this.getPrefixLines(), ...params]) {
      // Add a new line to print the param onto.
      output += "\n";

      let inspectedParam: string;

      // Try and convert the unknown type into a string.
      if (typeof param === "undefined") {
        inspectedParam = "undefined";
      } else if (typeof param === "object") {
        inspectedParam = JSON.stringify(param, null, 2);
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

    // Print the output.
    console.log(output);
  }

  /**
   * Print an message to the user/developer's , at a specified verbosity level.
   *
   * @param level The logging level to print the message at.
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
  private async logWithCSS(level: LogLevel, message: string, ...params: unknown[]) {
    let output = "";

    const defaultCSS = "font-family: system-ui;";
    let logLevelCSS = defaultCSS;
    const logIdentifierCSS = defaultCSS;
    const logMessageCSS = defaultCSS;
    let logLevelName: string;

    // Adjust colours and message content for different log levels.
    switch (level) {
      case LogLevel.ERROR:
        logLevelCSS += "color: RED;";
        logLevelName = "Error ⛔";
        break;
      case LogLevel.WARN:
        logLevelCSS += "color: YELLOW;";
        logLevelName = "Warning ⚠";
        break;
      case LogLevel.DEBUG:
        logLevelCSS += "color: BLUE;";
        logLevelName = "Debugging 🐣";
        break;
      case LogLevel.INFO:
        logLevelCSS += "color: BLUE;";
        logLevelName = "Info 📘";
        break;
      case LogLevel.VERBOSE:
        logLevelCSS += "color: BLUE;";
        logLevelName = "Verbose 🐥";
        break;
      case LogLevel.TRACE:
        logLevelCSS += "color: BLUE;";
        logLevelName = "Trace 🐈";
        break;
      default:
        logLevelName = "Default";
        break;
    }

    // Print the log type name, followed by the identifier, followed by the message.
    output += `%c${logLevelName}  %c${this.identifier}%c / %c${message}`;

    // Print the output.
    console.log(output, logLevelCSS, logIdentifierCSS, defaultCSS, logMessageCSS, ...params);
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
}
