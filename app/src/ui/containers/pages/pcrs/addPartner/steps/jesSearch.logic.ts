import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { JesSearchQuery, JesSearchQuery$data } from "../__generated__/JesSearchQuery.graphql";
import { jesSearchQuery } from "./JesSearchQuery";
import { useQuery } from "@framework/api-helpers/useQuery/useQuery";
import { useEffect } from "react";

export const getJesSearchResults = (data: JesSearchQuery$data | null | undefined) =>
  data?.salesforce?.uiapi?.query?.Account?.edges?.map(x => ({
    id: x?.node?.Id ?? "",
    companyName: x?.node?.Name?.value ?? "",
  }));

export const useJesSearchQuery = (searchInputValue: string) => {
  const gqlSearchValue = !!searchInputValue ? `%${searchInputValue}%` : "";

  const [refreshedQueryOptions, refresh] = useRefreshQuery(jesSearchQuery, { search: gqlSearchValue });
  const { isLoading, data } = useQuery<JesSearchQuery>(
    jesSearchQuery,
    { search: gqlSearchValue },
    refreshedQueryOptions,
  );

  const jesAccounts = getJesSearchResults(data);

  useEffect(() => {
    refresh();
  }, [gqlSearchValue]);

  return { isLoading, jesAccounts };
};
