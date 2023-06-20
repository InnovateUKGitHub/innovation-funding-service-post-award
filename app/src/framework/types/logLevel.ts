import { LogLevel } from "@framework/constants/enums";

/**
 * Parse an incoming log level.
 *
 * @param value The log level to parse
 * @returns The parsed log level value. Defaults to ERROR if not found.
 */
export function parseLogLevel(value?: string | LogLevel): LogLevel {
  switch ((value || "").toUpperCase()) {
    case "TRACE":
    case LogLevel.TRACE:
      return LogLevel.TRACE;
    case "VERBOSE":
    case LogLevel.VERBOSE:
      return LogLevel.VERBOSE;
    case "DEBUG":
    case LogLevel.DEBUG:
      return LogLevel.DEBUG;
    case "INFO":
    case LogLevel.INFO:
      return LogLevel.INFO;
    case "WARN":
    case LogLevel.WARN:
      return LogLevel.WARN;
    case "ERROR":
    case LogLevel.ERROR:
    default:
      return LogLevel.ERROR;
  }
}

/**
 * converts from LogLevel<string> enum to numerical value
 *
 * @example
    [LogLevel.TRACE]: 0;
    [LogLevel.VERBOSE]: 1;
    [LogLevel.DEBUG]: 2;
    [LogLevel.INFO]: 3;
    [LogLevel.WARN]: 4;
    [LogLevel.ERROR]: 5;
 */
export function getLogLevelNumber(value: LogLevel): number {
  switch (value) {
    case LogLevel.TRACE:
      return 0;
    case LogLevel.VERBOSE:
      return 1;
    case LogLevel.DEBUG:
      return 2;
    case LogLevel.INFO:
      return 3;
    case LogLevel.WARN:
      return 4;
    case LogLevel.ERROR:
    default:
      return 5;
  }
}
