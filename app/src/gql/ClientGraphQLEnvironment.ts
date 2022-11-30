import { Environment, RecordSource, Store } from "relay-runtime";
import { RelayNetworkLayer } from "react-relay-network-modern/node8";
import RelayClientSSR from "react-relay-network-modern-ssr/node8/client";

const relayClientSSR = new RelayClientSSR(window.__RELAY_BOOTSTRAP_DATA__);

const network = new RelayNetworkLayer([
  relayClientSSR.getMiddleware({
    lookup: true,
  }),
]);

// Export a singleton instance of Relay Environment configured with our network function:
const ClientGraphQLEnvironment = new Environment({
  network,
  store: new Store(new RecordSource()),
});

export { ClientGraphQLEnvironment, relayClientSSR };
