import { Logger } from "@shared/developmentLogger";

export function devLogger(warning: string): void {
  const isProdUrl = !/localhost|acc-dev/.test(window.location.hostname);

  if (isProdUrl) return;

  return new Logger("Develop Warning").warn(warning);
}
