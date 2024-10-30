import { Request, Response } from "express";
import { GraphQLSchema } from "graphql";
import RelayClientSSR from "react-relay-network-modern-ssr/lib/client";
import RelayServerSSR, { SSRCache } from "react-relay-network-modern-ssr/lib/server";
import { RelayNetworkLayer } from "react-relay-network-modern";
import { Environment, RecordSource, Store } from "relay-runtime";
import { createContext } from "./GraphQLContext";

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

const getServerGraphQLEnvironment = async ({
  req,
  res,
  schema,
}: {
  req: Request;
  res: Response;
  schema: GraphQLSchema;
}) => {
  const relayServerSSR = new RelayServerSSR();
  const source = new RecordSource();
  const store = new Store(source);

  const network = new RelayNetworkLayer([
    relayServerSSR.getMiddleware(async () => ({
      schema,
      contextValue: await createContext({ req, res }),
    })),
  ]);

  const ServerGraphQLEnvironment = new Environment({
    network,
    store,
  });

  return { ServerGraphQLEnvironment, relayServerSSR };
};

export { getServerGraphQLEnvironment, getServerGraphQLFinalRenderEnvironment };
