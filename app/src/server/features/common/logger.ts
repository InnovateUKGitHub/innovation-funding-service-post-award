export interface ILogger {
  log(message: string, params: any[]): void;
}

export class Logger implements ILogger {
  log(message: string, ...params: any[]) {
    // Todo: impliment logging for server logs
    console.log(`LOG: ${message}`);// , ...params);
  }
}
