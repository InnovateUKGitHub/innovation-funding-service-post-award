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
  res.setHeader("X-Frame-Options", "deny");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-XSS-Protection", "1");
  res.setHeader("Strict-Transport-Security", "max-age=31536000");
  res.setHeader("Referrer-Policy", "no-referrer");
  // https://developers.google.com/tag-manager/web/csp
  res.setHeader("Content-Security-Policy", [
    "default-src 'self'",
    "script-src: 'unsafe-inline' https://www.googletagmanager.com https://tagmanager.google.com https://www.google-analytics.com https://ssl.google-analytics.com",
    "style-src: https://tagmanager.google.com https://fonts.googleapis.com",
    "img-src: www.googletagmanager.com https://www.google-analytics.com https://ssl.gstatic.com https://www.gstatic.com",
    "connect-src: https://www.google-analytics.com",
    "font-src: https://fonts.gstatic.com",
  ].join("; "));
  return next();
};
