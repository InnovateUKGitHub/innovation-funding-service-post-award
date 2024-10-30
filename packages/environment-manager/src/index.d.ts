declare module "@innovateuk/environment-manager" {
  export class EnvironmentManager {
    constructor(environment: string);
    getEnv(key: string): string | undefined;
  }
}
