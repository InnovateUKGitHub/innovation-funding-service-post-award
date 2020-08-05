import express from "express";

export const allowCache = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const tenYears = 10 * 31536000;
  res.setHeader("Cache-Control", `max-age=${tenYears}, public, immutable`);
  return next();
};

export const noCache = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  return next();
};

export const setOwaspHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const nonce = res.locals.nonce;
  res.setHeader("X-Frame-Options", "deny");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1");
  res.setHeader("Strict-Transport-Security", "max-age=31536000");
  res.setHeader("Referrer-Policy", "no-referrer");
  // Documentation https://developers.google.com/tag-manager/web/csp
  // Test using https://csp-evaluator.withgoogle.com/
  const cspHeader = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    `script-src 'self' 'unsafe-inline' 'strict-dynamic' 'nonce-${nonce}' https://www.googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://ssl.google-analytics.com`,
    `style-src 'self' 'unsafe-inline'  https://tagmanager.google.com https://fonts.googleapis.com`,
    "img-src 'self' www.googletagmanager.com https://www.google-analytics.com https://ssl.gstatic.com https://www.gstatic.com",
    "connect-src 'self' https://www.google-analytics.com",
    "font-src 'self' https://fonts.gstatic.com",
  ].join("; ");
  res.setHeader("Content-Security-Policy", cspHeader);
  return next();
};
