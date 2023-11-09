// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useRef, useEffect, useReducer, useCallback, Reducer, useContext } from "react";
import { GraphQLTaggedNode, OperationType, IEnvironment, __internal } from "relay-runtime";

import { RenderProps, QueryOptions } from "./RelayHooksTypes";

import { QueryFetcher, getOrCreateQueryFetcher } from "./QueryFetcher";

type Reference<TOperationType extends OperationType = OperationType> = {
  queryFetcher: QueryFetcher<TOperationType>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { createRelayContext } = __internal as any;

const ReactRelayContext = createRelayContext(React);

/**
 * @see https://github.com/relay-tools/relay-hooks/
 * temporarily copying files over until library is patched for compatibility with latest react-relay
 */
export function useRelayEnvironment<TEnvironment extends IEnvironment = IEnvironment>(): TEnvironment {
  const { environment } = useContext<{ environment: TEnvironment }>(ReactRelayContext);
  return environment as TEnvironment;
}

/**
 * forces update
 */
function useForceUpdate(): () => void {
  const [, forceUpdate] = useReducer<Reducer<number, void>>(x => x + 1, 0);
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  const update = useCallback(() => {
    if (isMounted.current) {
      forceUpdate();
    }
  }, [isMounted, forceUpdate]);
  return update;
}

const useInternalQuery = <TOperationType extends OperationType = OperationType>(
  gqlQuery: GraphQLTaggedNode,
  variables: TOperationType["variables"],
  options: QueryOptions,
  suspense: boolean,
): RenderProps<TOperationType> => {
  const environment = useRelayEnvironment();
  const forceUpdate = useForceUpdate();
  const ref = useRef<Reference<TOperationType>>();

  if (ref.current === null || ref.current === undefined) {
    ref.current = {
      queryFetcher: getOrCreateQueryFetcher(suspense, gqlQuery, variables, options.networkCacheConfig),
    };
  }

  useEffect(() => {
    return (): void => ref?.current?.queryFetcher?.dispose();
  }, []);

  const { queryFetcher } = ref.current;
  queryFetcher.resolve(environment, gqlQuery, variables, options);
  queryFetcher.checkAndSuspense(suspense, suspense);
  queryFetcher.setForceUpdate(forceUpdate);
  return queryFetcher.getData();
};

export const useQuery = <TOperationType extends OperationType = OperationType>(
  gqlQuery: GraphQLTaggedNode,
  variables: TOperationType["variables"] = {},
  options: QueryOptions = {},
): RenderProps<TOperationType> => {
  return useInternalQuery(gqlQuery, variables, options, false);
};
