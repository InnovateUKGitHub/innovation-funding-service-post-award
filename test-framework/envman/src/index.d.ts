declare module "envman" {
  export class Envman {
    constructor(environemnt: string);
    getEnv(key: string): string | undefined;
  }
}
