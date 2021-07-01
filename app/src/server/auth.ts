import fs from "fs";
import express from "express";
import passport from "passport";
import passportSaml from "passport-saml";
import cookieSession from "cookie-session";
import { configuration } from "../server/features/common/config";
import { noCache } from "./cacheHeaders";
import { Logger } from "./features/common";

// definitions for URNs: https://commons.lbl.gov/display/IDMgmt/Attribute+Definitions
const urnUid = "urn:oid:0.9.2342.19200300.100.1.1";
const urnEmail = "urn:oid:0.9.2342.19200300.100.1.3";
type URNKEYS = typeof urnUid | typeof urnEmail;

type ShibbolethPayload = {
  [K in URNKEYS]: string;
} & {
  issuer: string;
  sessionIndex: string;
  nameID: string;
  nameIDFormat: string;
  nameQualifier: string;
  spNameQualifier: string;
  mail: string;
  email: string;
};

const shibConfig: passportSaml.SamlConfig = {
  entryPoint: configuration.sso.providerUrl,
  issuer: configuration.serverUrl,
  callbackUrl: `${configuration.serverUrl}/auth/success`,
  // the info we're asking for
  identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:persistent",
  disableRequestedAuthnContext: true,
  decryptionPvk: fs.readFileSync(configuration.certificates.shibboleth, "utf-8"),
  acceptedClockSkewMs: -1,
};

export const router = express.Router();

const cookieName = "chocolate-chip";
router.use(cookieSession({
  secure: process.env.SERVER_URL !== "http://localhost:8080",
  httpOnly: true,
  name: cookieName,
  secret: configuration.cookieKey,
  maxAge: 1000 * 60 * configuration.timeouts.cookie
}));

router.use(passport.initialize());

// configure passport to use shibboleth configured saml
passport.use("shibboleth", new passportSaml.Strategy(shibConfig, (payload: any, done: passportSaml.VerifiedCallback) => done(null, payload, {})));

// extract session info out of shibboleth payload
passport.serializeUser((payload: ShibbolethPayload, done) => {
  done(null, { email: payload.email });
});

// force login using passport shibboleth config
router.get("/login", noCache, passport.authenticate("shibboleth"));

router.get("/logout", noCache, (req, res) => {
  res.cookie(cookieName, "", {
    expires: new Date("1970-01-01"),
    secure: process.env.SERVER_URL !== "http://localhost:8080",
    httpOnly: true
  });
  return res.redirect(configuration.sso.enabled && configuration.sso.signoutUrl || "/");
});

// Shiboleth makes user browser post back to our app with creds
router.post("/auth/success", (req, res, next) => passport.authenticate("shibboleth", (err, user) => {
  if (err) {
    new Logger().error("Authentication Error", err);
    return res.sendStatus(500);
  }
  // copy user info from shibboleth that has been serilised to the user object and store it in the session object
  req.session = req.session || {};
  req.session.user = { email: user[urnEmail] };
  req.session.last_reset = getCookieTimestamp();

  // redirect to orignal locaion if it starts with a / otherwise use server root
  const redirect = req.session && req.session.redirect;
  const validatedRedirect = redirect && redirect.startsWith("/") ? redirect : configuration.serverUrl;
  return res.redirect(validatedRedirect);
})(req, res, next));

router.use((req, res, next) => {
  if (configuration.sso.enabled && req.url === "/") {
    res.redirect("/projects/dashboard");
  } else if (req.session && req.session.user && req.session.user.email) {
    // if user is logged in continue
    req.session.last_reset = getCookieTimestamp();
    next();
  } else if (!configuration.sso.enabled) {
    // if user not logged in but we arent using sso then set default user
    req.session = req.session || {};
    req.session.user = req.session.user || {};
    req.session.user.email = configuration.salesforce.serivceUsername;
    next();
  } else if (!req.url.startsWith("/api") && !req.url.startsWith("/login")) {
    // if not logged in and not api request or login request (ie somethings gone wrong)
    // then then store url in session and redirect to login enpoint that will in turn redirect to sso
    req.session = req.session || {};
    req.session.redirect = req.url;
    res.redirect("/login");
  } else {
    // not logged and api request throw 401 exception
    res.sendStatus(401);
  }
});

const getCookieTimestamp = () => {
  // reset cookie once every minute to make rolling session
  return Date.now() - (Date.now() % 60000);
};
