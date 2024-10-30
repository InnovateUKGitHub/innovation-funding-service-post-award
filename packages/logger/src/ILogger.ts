interface ILogger {
  trace(location: string, ...params: unknown[]): void;
  debug(location: string, ...params: unknown[]): void;
  info(location: string, ...params: unknown[]): void;
  warn(location: string, ...params: unknown[]): void;
  error(location: string, ...params: unknown[]): void;
}

export { ILogger };
