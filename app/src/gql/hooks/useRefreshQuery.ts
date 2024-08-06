import { useState } from "react";
import { fetchQuery, GraphQLTaggedNode, useRelayEnvironment } from "react-relay";
import type { useLazyLoadQuery } from "react-relay";

export type RefreshedQueryOptions = { fetchKey: number; fetchPolicy: "store-only" } | undefined;
export type QueryOptions = Parameters<typeof useLazyLoadQuery>[2];

/**
 * `useRefreshQuery` returns an array with a set of refreshed Query Options to be used
 * for refreshing the query and a function for triggering the refreshed options.
 *
 * The refreshed query options should be passed into the graphql query as the third argument, after the
 * variables
 *
 *
 * @param query GraphQL Query
 * @param variables variables for Graphql query
 * @example
 
  const [refreshedQueryOptions, refresh] = useRefreshQuery(projectDocumentsQuery, { projectId })
 
  const onChange = (saving: boolean, dto: MultipleDocumentUploadDto) => {
        update(dto);
        refresh();
    );
  };
 
 const data = useLazyLoadQuery(projectDocumentsQuery, { projectId }, refreshedQueryOptions);
 */
export function useRefreshQuery<T extends GraphQLTaggedNode, U extends AnyObject>(
  query: T,
  variables: U,
): [RefreshedQueryOptions, () => Promise<void>] {
  const environment = useRelayEnvironment();

  // The current refresh promise - If it's reloading.
  const [refreshPromise, setRefreshPromise] = useState<Promise<void> | null>(null);
  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState<RefreshedQueryOptions>(undefined);

  const refresh = (): Promise<void> => {
    // If we are already reloading, return the current promise
    if (refreshPromise) return refreshPromise;

    // Wait for the fetch to complete
    const promise = new Promise<void>((resolve, reject) => {
      fetchQuery(environment, query, variables).subscribe({
        complete: () => {
          setRefreshedQueryOptions(prev => ({
            fetchKey: (prev?.fetchKey ?? 0) + 1,
            fetchPolicy: "store-only",
          }));
          resolve();
          setRefreshPromise(null);
        },
        error: () => {
          reject();
          setRefreshPromise(null);
        },
      });
    });

    // Return the promise that will complete when the fetch completes
    setRefreshPromise(promise);
    return promise;
  };

  return [refreshedQueryOptions, refresh];
}
