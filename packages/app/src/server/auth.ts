import express from "express";
import passport from "passport";
import cookieSession from "cookie-session";

import { configuration } from "@server/features/common/config";
import { noCache } from "./cacheHeaders";
import { Logger } from "@innovateuk/logger";
import {
  passportSamlSuccessRoute,
  getEmailFromAuthPayload,
  PassportSamlPayload,
  getPassportSamlStrategy,
} from "./passportSaml";
import { getPassportOidcStrategy, passportOidcSuccessRoute } from "./developmentPassportOidc";
import { getErrorResponse } from "@framework/util/errorHandlers";
import { UnauthenticatedError } from "@shared/appError";
import { matchRoute } from "@ui/routing/matchRoute";
import { LogoutReason } from "@framework/constants/enums";
import { SessionTimeoutPage } from "@ui/app/SessionTimeout.page";

const logger = new Logger("Auth");

const getCookieTimestamp = () => {
  // reset cookie to current time
  return Date.now();
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
    .get("/heartbeat", (req, res) => {
      req.session ??= {};
      req.session.last_reset = getCookieTimestamp();
      res.status(200);
      res.send(null);
    })
    .get("/developer/oidc/login", noCache, passport.authenticate("passportOidc"))
    .get("/login", noCache, passport.authenticate("passportSaml"))
    .get("/logout", noCache, (req, res) => {
      res.cookie(cookieName, "", {
        expires: new Date("1970-01-01"),
        secure: configuration.cookie.secure,
        httpOnly: true,
      });

      switch (req.params.reason) {
        case LogoutReason.SESSION_TIMEOUT:
          return res.redirect(SessionTimeoutPage.routePath);
        case LogoutReason.DEFAULT:
        default:
          return res.redirect((configuration.sso.enabled && configuration.sso.signoutUrl) || "/");
      }
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
        req.session.user.developer_oidc_username = payload.preferred_username;
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

      const matchedRoute = matchRoute(req.url);

      const { salesforceServiceUser, sso, developer } = configuration;

      if (sso.enabled && req.url === "/") {
        res.redirect("/projects/dashboard");
        return;
      }

      if (req?.session?.user?.email || req?.session?.user?.developer_oidc_username) {
        req.session.last_reset = getCookieTimestamp();
      }

      req.session ??= {};
      req.session.user ??= {};

      if (sso.enabled) {
        // If a user is not logged in...
        if (!req?.session?.user?.email) {
          if (req.url.startsWith("/api")) {
            res.status(401).json(getErrorResponse(new UnauthenticatedError(), req.params.traceId));
            return;
          } else if (req.url.startsWith("/login")) {
            next(new UnauthenticatedError());
            return;
          } else if (matchedRoute.allowUnauthenticatedAccess) {
            // noop
          } else {
            // Remember the URL we need to go back to
            req.session.redirect = req.url;
            res.redirect("/login");
            return;
          }
        }

        // User is successfully logged in :)
        return next();
      }

      if (developer.oidc.enabled) {
        // If a user is not logged in...
        if (!req?.session?.user?.developer_oidc_username) {
          // Redirect them to login, or return 401 for api routes
          if (!req.url.startsWith("/api") && !req.url.startsWith("/developer/oidc/login")) {
            // Remember the URL we need to go back to
            req.session.redirect = req.url;
            res.redirect("/developer/oidc/login");
          } else if (matchedRoute.allowUnauthenticatedAccess) {
            // noop
          } else {
            res.status(401);
          }
          return;
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
      if (configuration.developer.defaultToSystemUser && req?.session?.user?.email === undefined) {
        req.session.user.email ??= salesforceServiceUser.serviceUsername;
      }

      return next();
    });

  return router;
};

export { getAuthRouter };
