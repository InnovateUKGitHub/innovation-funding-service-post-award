import { useState } from "react";
import { fetchQuery, GraphQLTaggedNode, useRelayEnvironment } from "react-relay";

export type RefreshedQueryOptions = { fetchKey: number; fetchPolicy: "store-only" } | undefined;

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
  const [refreshPromise, setRefreshPromise] = useState<Promise<void> | null>(null);
  const [refreshedQueryOptions, setRefreshedQueryOptions] = useState<RefreshedQueryOptions>(undefined);

  const refresh = (): Promise<void> => {
    if (refreshPromise) return refreshPromise;

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

    setRefreshPromise(promise);

    return promise;
  };

  return [refreshedQueryOptions, refresh];
}
