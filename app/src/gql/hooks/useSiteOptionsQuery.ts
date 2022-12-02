import { clientConfigQueryQuery } from "@gql/query/clientConfigQuery";
import { stubGraphQLGraph } from "@gql/StubGraphQLEnvironment";
// import { clientConfigQuery } from "@gql/query/__generated__/clientConfigQuery.graphql";
import { useServerSideLoadedQuery } from "./useServerSideLoadedQuery";

// const useClientOptionsQuery = () => useServerSideLoadedQuery<clientConfigQuery>(clientConfigQueryQuery);
const useClientOptionsQuery = () => stubGraphQLGraph;

export { useClientOptionsQuery };
