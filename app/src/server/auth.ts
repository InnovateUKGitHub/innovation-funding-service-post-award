import express from "express";
import passport from "passport";
import cookieSession from "cookie-session";

import { configuration } from "@server/features/common/config";
import { noCache } from "./cacheHeaders";
import { Logger } from "@shared/developmentLogger";
import {
  passportSamlSuccessRoute,
  getEmailFromAuthPayload,
  PassportSamlPayload,
  getPassportSamlStrategy,
} from "./passportSaml";
import { getPassportOidcStrategy, passportOidcSuccessRoute } from "./developmentPassportOidc";

const logger = new Logger("Auth");

const getCookieTimestamp = () => {
  // reset cookie once every minute to make rolling session
  return Date.now() - (Date.now() % 60000);
};

const getAuthRouter = async () => {
  const router = express.Router();

  if (configuration.sso.enabled) {
    const passportSamlStrategy = getPassportSamlStrategy();
    passport.use("passportSaml", passportSamlStrategy);
  } else if (configuration.developer.oidc.enabled) {
    const passportOidcStrategy = await getPassportOidcStrategy();
    passport.use("passportOidc", passportOidcStrategy);
  }

  passport.serializeUser((parsedResponse: unknown, onSuccess: (err: unknown, id?: unknown) => void): void => {
    const payload = parsedResponse as Pick<PassportSamlPayload, "email">;
    onSuccess(null, { email: payload.email });
  });

  const cookieName = "chocolate-chip";
  router
    .use(
      cookieSession({
        secure: configuration.cookie.secure,
        httpOnly: true,
        name: cookieName,
        secret: configuration.cookie.secret,
        maxAge: 1000 * 60 * configuration.timeouts.cookie,
      }),
    )
    .use(passport.initialize())
    .get("/developer/oidc/login", noCache, passport.authenticate("passportOidc"))
    .get("/login", noCache, passport.authenticate("passportSaml"))
    .get("/logout", noCache, (_req, res) => {
      res.cookie(cookieName, "", {
        expires: new Date("1970-01-01"),
        secure: configuration.cookie.secure,
        httpOnly: true,
      });

      return res.redirect((configuration.sso.enabled && configuration.sso.signoutUrl) || "/");
    })
    .get(passportOidcSuccessRoute, (req, res) =>
      passport.authenticate("passportOidc", (authError: AnyObject, payload: AnyObject) => {
        if (authError) {
          logger.error("Authentication Error", authError);

          const errorMessage =
            "An authentication error occurred when loading the application, please trying logging in again.";

          const errorResponse = {
            error: errorMessage,
            payload: payload || null,
          };

          // TODO: Convert error payload into error UI page (res.redirect("/some-relative-url"))
          return res.status(500).json(errorResponse);
        }

        req.session ??= {};
        req.session.user ??= {};
        req.session.user.developer_oidc_username = payload.email;
        req.session.last_reset = getCookieTimestamp();

        // redirect to original location if it starts with a / otherwise use server root
        const redirect: string | undefined = req.session?.redirect;
        const validatedRedirect = redirect?.startsWith("/") ? redirect : configuration.webserver.url;

        return res.redirect(validatedRedirect);
      })(req, res),
    )
    .post(passportSamlSuccessRoute, (req, res) =>
      // Note: On success Passport SAML redirects to `configuration.webserver.url + successfulValidationRoute`
      // See `passportSaml.ts` for more info
      passport.authenticate("passportSaml", (authError: AnyObject, payload: AnyObject) => {
        if (authError) {
          logger.error("Authentication Error", authError);

          const errorMessage =
            "An authentication error occurred when loading the application, please trying logging in again.";

          const errorResponse = {
            error: errorMessage,
            payload: payload || null,
          };

          // TODO: Convert error payload into error UI page (res.redirect("/some-relative-url"))
          return res.status(500).json(errorResponse);
        }

        req.session ??= {};
        req.session.user = { email: getEmailFromAuthPayload(payload) };
        req.session.last_reset = getCookieTimestamp();

        // redirect to original location if it starts with a / otherwise use server root
        const redirect: string | undefined = req.session?.redirect;
        const validatedRedirect = redirect?.startsWith("/") ? redirect : configuration.webserver.url;

        return res.redirect(validatedRedirect);
      })(req, res),
    )
    .use((req, res, next) => {
      if (!configuration.salesforceServiceUser.serviceUsername) {
        throw Error("Missing 'configuration.salesforce.serviceUsername' value");
      }

      const { salesforceServiceUser, sso, developer } = configuration;
      if (sso.enabled && req.url === "/") {
        return res.redirect("/projects/dashboard");
      }

      if (req?.session?.user?.email || req?.session?.user?.developer_oidc_username) {
        req.session.last_reset = getCookieTimestamp();
      }

      req.session ??= {};
      req.session.user ??= {};

      if (sso.enabled) {
        // If a user is not logged in...
        if (!req?.session?.user?.email) {
          // User not logged in - Log in to SAML
          if (!req.url.startsWith("/api") && !req.url.startsWith("/login")) {
            // Remember the URL we need to go back to
            req.session.redirect = req.url;
            return res.redirect("/login");
          } else {
            return res.status(401);
          }
        }

        // User is successfully logged in :)
        next();
      }

      if (developer.oidc.enabled) {
        // If a user is not logged in...
        if (!req?.session?.user?.developer_oidc_username) {
          // Redirect them to login, or return 401 for api routes
          if (!req.url.startsWith("/api") && !req.url.startsWith("/developer/oidc/login")) {
            // Remember the URL we need to go back to
            req.session.redirect = req.url;
            return res.redirect("/developer/oidc/login");
          } else {
            return res.status(401);
          }
        }

        // User is successfully logged in :)
        // Fall through back to the standard developer bits and bobs
      }

      // Allow overriding the username with HTTP header
      // for testing purposes.
      const userSwitcher = req.header("x-acc-userswitcher");

      // If we are userSwitching, switch to that user.
      if (userSwitcher) {
        req.session.user.email = userSwitcher;
      }

      // If not logged in, reset to the Salesforce System User
      if (req?.session?.user?.email === undefined) {
        req.session.user.email ??= salesforceServiceUser.serviceUsername;
      }

      return next();
    });

  return router;
};

export { getAuthRouter };
