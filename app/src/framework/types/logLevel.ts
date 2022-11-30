import { LogLevel } from "@framework/constants";

/**
 * Parse an incoming log level.
 *
 * @param value The log level to parse
 * @returns The parsed log level value. Defaults to ERROR if not found.
 */
export function parseLogLevel(value?: string | LogLevel): LogLevel {
  switch ((value || "").toUpperCase()) {
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

export function getLogLevelNumber(value: LogLevel) {
  switch (value) {
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
