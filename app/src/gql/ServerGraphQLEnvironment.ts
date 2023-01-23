import { IAppError } from "@framework/types";
import { Logger } from "@shared/developmentLogger";
import { Request, Response } from "express";
import { GraphQLSchema } from "graphql";
import RelayClientSSR from "react-relay-network-modern-ssr/node8/client";
import RelayServerSSR, { SSRCache } from "react-relay-network-modern-ssr/node8/server";
import { RelayNetworkLayer } from "react-relay-network-modern/node8";
import { Environment, RecordSource, Store } from "relay-runtime";

const getServerGraphQLFinalRenderEnvironment = (relayData: SSRCache) => {
  // Create a client that takes in server cache
  const relayClientSSR = new RelayClientSSR(relayData);
  const network = new RelayNetworkLayer([relayClientSSR.getMiddleware()]);

  const source = new RecordSource();
  const store = new Store(source);

  const ServerGraphQLEnvironment = new Environment({
    network,
    store,
  });

  return ServerGraphQLEnvironment;
};

const getServerGraphQLEnvironment = ({
  res,
  schema,
}: {
  req: Request;
  res: Response;
  error?: IAppError;
  schema: GraphQLSchema;
}) => {
  const relayServerSSR = new RelayServerSSR();
  const source = new RecordSource();
  const store = new Store(source);

  const network = new RelayNetworkLayer([
    relayServerSSR.getMiddleware(async () => ({
      schema,
      contextValue: {
        // Use the connection to Salesforce as injected in `/app/src/server/router.ts`
        api: res.locals.api,
        email: res.locals.email,
        logger: new Logger("SSR GQL"),
      },
    })),
  ]);

  const ServerGraphQLEnvironment = new Environment({
    network,
    store,
  });

  return { ServerGraphQLEnvironment, relayServerSSR };
};

export { getServerGraphQLEnvironment, getServerGraphQLFinalRenderEnvironment };
