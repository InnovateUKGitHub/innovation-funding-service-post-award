import { ILogger } from "./ILogger";
import { LogLevel, getLogLevelNumber, parseLogLevel } from "./LogLevel";
import type NewRelic from "newrelic";

interface LoggerOptions {
  prefixLines: (string | Record<string, any>)[];
  logLevel: LogLevel;
  colourfulLogging: boolean;
  newRelic: typeof NewRelic | null | false;
}

abstract class BaseLogger implements ILogger {
  protected static defaultOptions: LoggerOptions = {
    prefixLines: [],
    logLevel: LogLevel.ERROR,
    colourfulLogging: false,
    newRelic: false,
  };

  static setDefaultOptions(options?: Partial<LoggerOptions>) {
    Object.assign(BaseLogger.defaultOptions, options);
  }

  protected readonly identifier: string;
  protected readonly options: Partial<LoggerOptions> = {};
  protected abstract log(level: LogLevel, message: string, ...params: unknown[]): void | Promise<void>;

  private shouldLog(level: LogLevel) {
    return getLogLevelNumber(level) >= getLogLevelNumber(this.logLevel);
  }

  constructor(identifier: string, options?: Partial<LoggerOptions>) {
    this.identifier = identifier;

    if (options?.logLevel) {
      // Obtain the overridden log level
      this.options.logLevel = options?.logLevel;
    } else if (typeof process !== "undefined") {
      // Obtain the log level if we are running on the server side.
      this.options.logLevel = parseLogLevel((process.env.LOG_LEVEL || process.env.LOGLEVEL) ?? "ERROR");
    }

    this.options.prefixLines = options?.prefixLines ?? BaseLogger.defaultOptions.prefixLines;
    this.options.newRelic = options?.newRelic ?? BaseLogger.defaultOptions.newRelic;
    this.options.colourfulLogging = options?.colourfulLogging ?? BaseLogger.defaultOptions.colourfulLogging;
  }

  /**
   * Print a trace 🐈 message to the console.
   *
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
  trace(message: string, ...params: unknown[]) {
    if (this.shouldLog(LogLevel.TRACE)) this.log(LogLevel.TRACE, message, ...params);
  }

  /**
   * Print a debug 🐣 message to the console.
   *
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
  debug(message: string, ...params: unknown[]) {
    if (this.shouldLog(LogLevel.DEBUG)) this.log(LogLevel.DEBUG, message, ...params);
  }

  /**
   * Print an info 📘 message to the console.
   *
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
  info(message: string, ...params: unknown[]) {
    if (this.shouldLog(LogLevel.INFO)) this.log(LogLevel.INFO, message, ...params);
  }

  /**
   * Print a warning ⚠ message to the console.
   *
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
  warn(message: string, ...params: unknown[]) {
    if (this.shouldLog(LogLevel.WARN)) this.log(LogLevel.WARN, message, ...params);
  }

  /**
   * Print an error ⛔ message to the console.
   *
   * @param message The message to print. Keep it short and to a single line, without any newlines.
   * @param params Any associated data to pretty-print alongside the message.
   */
  error(message: string, ...params: unknown[]) {
    if (this.shouldLog(LogLevel.ERROR)) this.log(LogLevel.ERROR, message, ...params);
  }

  get logLevel(): LogLevel {
    return this.options.logLevel ?? BaseLogger.defaultOptions.logLevel;
  }

  get prefixLines(): (string | Record<string, any>)[] {
    return this.options.prefixLines ?? BaseLogger.defaultOptions.prefixLines;
  }
}

export { BaseLogger };
