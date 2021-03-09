import Express from "express";
import { Configuration, getContentSecurityPolicy } from "./features/common";

export const allowCache = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  const tenYears = 10 * 31536000;
  res.setHeader("Cache-Control", `max-age=${tenYears}, public, immutable`);
  return next();
};

export const noCache = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  return next();
};

export const setOwaspHeaders = (_req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  res.setHeader("X-Frame-Options", "deny");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1");
  res.setHeader("Strict-Transport-Security", "max-age=31536000");
  res.setHeader("Referrer-Policy", "no-referrer");

  // Documentation https://developers.google.com/tag-manager/web/csp
  // Test using https://csp-evaluator.withgoogle.com/
  const cspValue = getContentSecurityPolicy(res.locals.nonce);
  const cspPolicyHeader = Configuration.disableCsp ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy";

  res.setHeader(cspPolicyHeader, cspValue);

  return next();
};
