export interface ILogger {
  log(message: string, params: any[]): void;
}

export class Logger implements ILogger {
  log(message: string, ...params: any[]) {
    console.log(`LOG: ${message}`, ...params);
  }
}
