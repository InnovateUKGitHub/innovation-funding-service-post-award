import express from "express";
import passport from "passport";
import cookieSession from "cookie-session";

import { configuration } from "../server/features/common/config";
import { noCache } from "./cacheHeaders";
import { Logger } from "@shared/developmentLogger";
import {
  successfulValidationRoute,
  getEmailFromAuthPayload,
  ShibbolethPayload,
  shibbolethStrategy,
} from "./shibboleth.config";

export const router = express.Router();

const logger = new Logger("Auth");

const cookieName = "chocolate-chip";
router.use(
  cookieSession({
    secure: process.env.SERVER_URL !== "http://localhost:8080",
    httpOnly: true,
    name: cookieName,
    secret: configuration.cookieKey,
    maxAge: 1000 * 60 * configuration.timeouts.cookie,
  }),
);

router.use(passport.initialize());

passport.use("shibboleth", shibbolethStrategy);

passport.serializeUser((parsedResponse: any, onSuccess: (err: any, id?: unknown) => void): void => {
  const payload = parsedResponse as Pick<ShibbolethPayload, "email">;
  onSuccess(null, { email: payload.email });
});

router.get("/login", noCache, passport.authenticate("shibboleth"));

router.get("/logout", noCache, (_req, res) => {
  res.cookie(cookieName, "", {
    expires: new Date("1970-01-01"),
    secure: process.env.SERVER_URL !== "http://localhost:8080",
    httpOnly: true,
  });

  return res.redirect((configuration.sso.enabled && configuration.sso.signoutUrl) || "/");
});

// Note: On success Shibboleth calls SamlConfig["callbackUrl"] (see config)
router.post(successfulValidationRoute, (req, res) =>
  passport.authenticate("shibboleth", (authError, payload) => {
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
    const validatedRedirect = redirect?.startsWith("/") ? redirect : configuration.serverUrl;

    return res.redirect(validatedRedirect);
  })(req, res),
);

router.use((req, res, next) => {
  if (!configuration.salesforce.serviceUsername) {
    throw Error("Missing 'configuration.salesforce.serviceUsername' value");
  }

  const { salesforce, sso } = configuration;
  if (sso.enabled && req.url === "/") {
    return res.redirect("/projects/dashboard");
  }

  if (req?.session?.user?.email) {
    req.session.last_reset = getCookieTimestamp();
    // Note: Proceed on as the user has been logged in
    return next();
  }

  if (!sso.enabled) {
    // if user not logged in but we aren't using sso then set default user
    req.session ??= {};
    req.session.user ??= {};
    req.session.user.email ??= salesforce.serviceUsername;
    return next();
  }

  if (!req.url.startsWith("/api") && !req.url.startsWith("/login")) {
    // if not logged in and not api request or login request (ie something's gone wrong)
    // then then store url in session and redirect to login endpoint that will in turn redirect to sso
    req.session ??= {};
    req.session.redirect = req.url;
    return res.redirect("/login");
  }

  // TODO: Forward to a static page with content, it should contain a reason why the request has failed.
  // Note: Inbound request is neither from a valid user or api query
  res.sendStatus(401);
});

const getCookieTimestamp = () => {
  // reset cookie once every minute to make rolling session
  return Date.now() - (Date.now() % 60000);
};
