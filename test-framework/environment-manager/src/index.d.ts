declare module "@innovateuk/environment-manager" {
  export class EnvironmentManager {
    constructor(environemnt: string);
    getEnv(key: string): string | undefined;
  }
}
