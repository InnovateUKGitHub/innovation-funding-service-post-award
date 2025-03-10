declare module "@innovateuk/environment-manager" {
  export class EnvironmentManager {
    constructor(environment: string);
    getEnv(key: string): string | undefined;
    setSecretEnv(key: string, value: string): void;
  }
}
