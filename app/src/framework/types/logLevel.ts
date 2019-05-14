export enum LogLevel {
  VERBOSE = 1,
  DEBUG,
  INFO,
  WARN,
  ERROR
}

export function parseLogLevel(value: string) {
  switch ((value || "").toUpperCase()) {
    case "VERBOSE":
      return LogLevel.VERBOSE;
    case "DEBUG":
      return LogLevel.DEBUG;
    case "INFO":
      return LogLevel.INFO;
    case "WARN":
      return LogLevel.WARN;
    case "ERROR":
    default:
      return LogLevel.ERROR;
  }
}
