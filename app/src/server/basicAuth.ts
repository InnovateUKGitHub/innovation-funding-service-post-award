import Express from "express";
import { configuration } from "./features/common/config";

/**
 * For environments without SSO we add basic auth protection.
 *
 * Allowed users are looked up in a file via openshift
 */
export const useBasicAuth = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  // to be applied where sso does not provide security
  if (!configuration.sso.enabled && !configuration.developer.oidc.enabled) {
    // allow some paths so that the home page can render nicely while waiting for credentials.
    const allowedPaths = [/^\/$/, /build/, /internationalisation/, /govuk\-frontend.*.min.js/, /api\/health\/version/];
    if (allowedPaths.some(path => path.test(req.path))) {
      return next();
    }

    const localhostNames = [/localhost/, /127\.0\.0\.1/];
    if (localhostNames.some(hostname => hostname.test(req.hostname))) {
      return next();
    }

    // reject if missing authorisation header
    if (!req.headers.authorization || req.headers.authorization.indexOf("Basic ") === -1) {
      return res.status(401).json({ message: "Missing Authorization Header " });
    }

    const allowedCredentials = configuration.basicAuth.credentials;

    // parse the user entered credentials
    const base64Credentials = req.headers.authorization.split(" ")[1];
    const userCredential = Buffer.from(base64Credentials, "base64").toString("ascii");

    // reject if user credentials do not match any in the allow list
    if (!allowedCredentials.includes(userCredential.trim())) {
      return res.status(401).json({ message: "Unauthorized user" });
    }
  }

  return next();
};
