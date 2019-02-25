import express from "express";
import passport from "passport";
import passportSaml from "passport-saml";
import fs from "fs";
import cookieSession = require("cookie-session");
import { Configuration } from "../server/features/common/config";

// definitions for URNs: https://commons.lbl.gov/display/IDMgmt/Attribute+Definitions
const urnUid = "urn:oid:0.9.2342.19200300.100.1.1";
const urnEmail = "urn:oid:0.9.2342.19200300.100.1.3";
type URN_KEYS = typeof urnUid | typeof urnEmail;

type ShibbolethPayload = {
  [K in URN_KEYS]: string;
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
  entryPoint: Configuration.ssoProviderUrl,
  issuer:  Configuration.serverUrl,
  callbackUrl: `${Configuration.serverUrl}/auth/success`,
  identifierFormat: `urn:oasis:names:tc:SAML:1.1:nameid-format:persistent`,
  disableRequestedAuthnContext: true,
  decryptionPvk: fs.readFileSync("./security/AccPrivateKey.key", "utf-8"),
  acceptedClockSkewMs: -1,
};

export const router = express.Router();

const cookieName = "chocolate-chip";
router.use(cookieSession({
  name: cookieName,
  keys: ["thekey", "thesecret"],
  // TODO - configurise this when Shibboleth is ready to go
  maxAge: 1000 * 60 * 30
}));

router.use(passport.initialize());

// configure passport to use shibboleth configured saml
passport.use("shibboleth", new passportSaml.Strategy(shibConfig, (payload: any, done: passportSaml.VerifiedCallback) => done(null, payload, {})));

// extract session info out of shibboleth payload
passport.serializeUser((payload: ShibbolethPayload, done) => {
  done(null, { email: payload.email });
});

// force login using passport shibboleth config
router.get("/login", passport.authenticate("shibboleth"));

router.get("/logout", (req, res) => {
  res.cookie(cookieName, "", { expires: new Date("1970-01-01") });
  return res.redirect(Configuration.useSSO && Configuration.ssoSignoutUrl || "/");
});

router.post("/auth/success", passport.authenticate("shibboleth"), (req, res) => {
  // copy user info from shibboleth that has been serilised to the user object and store it in the session object
  req.session = req.session || {};
  req.session.user = { email: req.user[urnEmail] };

  // redirect to orignal locaion if it starts with a / otherwise use server root
  const redirect = req.session && req.session.redirect;
  const validatedRedirect = redirect && redirect.startsWith("/") ? redirect : Configuration.serverUrl;
  return res.redirect(validatedRedirect);
});

router.use((req, res, next) => {
  // if user is logged in continue
  if (req.session && req.session.user && req.session.user.email) {
    next();
  }
  // if user not logged in but we arent using sso then set default user
  else if (!Configuration.useSSO) {
    req.session = req.session || {};
    req.session.user = req.session.user || {};
    req.session.user.email = Configuration.salesforceUsername;
    next();
  }
  // if not logged in and not api request or login request (ie somethings gone wrong)
  // then then store url in session and redirect to login enpoint that will in turn redirect to sso
  else if (!req.url.startsWith("/api") && !req.url.startsWith("/login")) {
    req.session = req.session || {};
    req.session.redirect = req.url;
    res.redirect(`/login`);
  }
  // not logged and api request throw 403 exception
  else {
    res.status(403).send();
  }
});
