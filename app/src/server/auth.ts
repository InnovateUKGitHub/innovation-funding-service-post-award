import express from "express";
import passport from "passport";
import cookieSession from "cookie-session";

import { configuration } from "@server/features/common/config";
import { noCache } from "./cacheHeaders";
import { Logger } from "@shared/developmentLogger";
import {
  successfulValidationRoute,
  getEmailFromAuthPayload,
  PassportSamlPayload,
  getPassportSamlStrategy,
} from "./passportSaml";

export const router = express.Router();

const logger = new Logger("Auth");

const cookieName = "chocolate-chip";
router.use(
  cookieSession({
    secure: configuration.cookie.secure,
    httpOnly: true,
    name: cookieName,
    secret: configuration.cookie.secret,
    maxAge: 1000 * 60 * configuration.timeouts.cookie,
  }),
);

router.use(passport.initialize());

if (configuration.sso.enabled) {
  const passportSamlStrategy = getPassportSamlStrategy();
  passport.use("passportSaml", passportSamlStrategy);
}

passport.serializeUser((parsedResponse: unknown, onSuccess: (err: unknown, id?: unknown) => void): void => {
  const payload = parsedResponse as Pick<PassportSamlPayload, "email">;
  onSuccess(null, { email: payload.email });
});

router.get("/login", noCache, passport.authenticate("passportSaml"));

router.get("/logout", noCache, (_req, res) => {
  res.cookie(cookieName, "", {
    expires: new Date("1970-01-01"),
    secure: configuration.cookie.secure,
    httpOnly: true,
  });

  return res.redirect((configuration.sso.enabled && configuration.sso.signoutUrl) || "/");
});

// Note: On success Passport SAML redirects to `configuration.webserver.url + successfulValidationRoute`
// See `passportSaml.ts` for more info
router.post(successfulValidationRoute, (req, res) =>
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
);

router.use((req, res, next) => {
  if (!configuration.salesforceServiceUser.serviceUsername) {
    throw Error("Missing 'configuration.salesforce.serviceUsername' value");
  }

  const { salesforceServiceUser, sso } = configuration;
  if (sso.enabled && req.url === "/") {
    return res.redirect("/projects/dashboard");
  }

  if (req?.session?.user?.email) {
    req.session.last_reset = getCookieTimestamp();
  }

  if (!sso.enabled) {
    // if user not logged in but we aren't using sso then set default user
    req.session ??= {};
    req.session.user ??= {};

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
  }

  if (req?.session?.user?.email) {
    // Note: Proceed on as the user has been logged in
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
