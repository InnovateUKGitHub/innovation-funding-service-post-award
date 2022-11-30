import { Environment, FetchFunction, Network, RecordSource, Store } from "relay-runtime";
import { RelayNetworkLayer } from "react-relay-network-modern/node8";
import RelayServerSSR, { SSRCache } from "react-relay-network-modern-ssr/node8/server";
import { getGraphQLSchema } from "./schema";

const relayServerSSR = new RelayServerSSR();

const getServerGraphQLFinalRenderEnvironment = (relayData: SSRCache) => {
  const source = new RecordSource();
  const store = new Store(source);

  const ServerGraphQLEnvironment = new Environment({
    network: Network.create((() => relayData[0][1]) as FetchFunction),
    store,
  });

  return ServerGraphQLEnvironment;
};

const getServerGraphQLEnvironment = async () => {
  const source = new RecordSource();
  const store = new Store(source);

  const network = new RelayNetworkLayer([
    relayServerSSR.getMiddleware({
      schema: await getGraphQLSchema(),
      contextValue: {},
    }),
  ]);

  const ServerGraphQLEnvironment = new Environment({
    network,
    store,
  });

  return ServerGraphQLEnvironment;
};

export { getServerGraphQLEnvironment, getServerGraphQLFinalRenderEnvironment, relayServerSSR };
