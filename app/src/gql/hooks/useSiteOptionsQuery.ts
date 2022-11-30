import { clientConfigQueryQuery } from "@gql/query/clientConfigQuery";
import { clientConfigQuery } from "@gql/query/__generated__/clientConfigQuery.graphql";
import { useServerSideLoadedQuery } from "./useServerSideLoadedQuery";

const useClientOptionsQuery = () => useServerSideLoadedQuery<clientConfigQuery>(clientConfigQueryQuery);

export { useClientOptionsQuery };
