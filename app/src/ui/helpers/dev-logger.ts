import { Logger } from "@server/features/common";

export function devLogger(warning: string): void {
  const isProdUrl: boolean = process.env.SERVER_URL?.includes("localhost") ?? true;

  if (isProdUrl) return;

  return new Logger("Develop Warning").warn(warning);
}
