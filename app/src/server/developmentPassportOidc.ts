import { Issuer, Strategy, TokenSet, UserinfoResponse } from "openid-client";
import { configuration } from "@server/features/common/config";
import { Logger } from "@shared/developmentLogger";

const logger = new Logger("passport-openid");

/**
 * ⛔️ Stop before you edit ⛔️
 *
 * Please refer to the following Confluence document before proceeding (section "External UI")
 * https://ukri.atlassian.net/wiki/spaces/ACC/pages/430702660
 *
 * (or you can ignore this, it's just a comment in a file...)
 */

// Note: SAML IDP will post back to this route with credentials
export const passportOidcSuccessRoute = "/developer/oidc/success";

export const getPassportOidcStrategy = async () => {
  const { Client } = await Issuer.discover(configuration.developer.oidc.issuer);
  const client = new Client({
    client_id: configuration.developer.oidc.clientId,
    client_secret: configuration.developer.oidc.clientSecret,
  });

  const strategy = new Strategy(
    {
      client,
      params: { redirect_uri: configuration.webserver.url + passportOidcSuccessRoute },
    },
    (tokenset: TokenSet, userinfo: UserinfoResponse, done: (err: unknown, user?: AnyObject) => void) => {
      logger.info("Logging in", userinfo);
      done(null, userinfo);
    },
  );

  return strategy;
};
