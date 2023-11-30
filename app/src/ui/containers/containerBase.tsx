import React from "react";
import { IClientConfig } from "src/types/IClientConfig";
import { IRoutes } from "@ui/routing/routeConfig";
import { Copy } from "@copy/Copy";
import { makeUrlWithQuery } from "@ui/helpers/make-url";
import { IAccessControlOptions } from "@framework/types/IAccessControlOptions";
import { IStores } from "@ui/redux/storesProvider";
import { Authorisation } from "@framework/types/authorisation";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { IClientUser } from "@framework/types/IUser";

type RouteStateParams = { [key: string]: string };

export interface RouteState {
  name: string;
  params: RouteStateParams;
  path: string;
}

export interface BaseProps {
  messages: string[];
  config: IClientConfig;
  routes: IRoutes;
  projectId?: string;
  currentRoute: AnyRouteDefinition;
}

export type ContainerProps<TParams, TData, TCallbacks> = TParams & TData & TCallbacks & BaseProps;

export type ContainerBaseClass<TParams, TData, TCallbacks> = new (
  props: TParams & TData & TCallbacks & BaseProps,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any,
) => ContainerBase<TParams, TData, TCallbacks>;

export abstract class ContainerBaseWithState<
  TParams = AnyObject,
  TData = AnyObject,
  TCallbacks = AnyObject,
  TState = AnyObject,
> extends React.Component<ContainerProps<TParams, TData, TCallbacks>, TState> {
  constructor(props: ContainerProps<TParams, TData, TCallbacks>) {
    super(props);
  }
}

export abstract class ContainerBase<
  TParams = AnyObject,
  TData = AnyObject,
  TCallbacks = AnyObject,
> extends React.Component<ContainerProps<TParams, TData, TCallbacks>> {
  constructor(props: ContainerProps<TParams, TData, TCallbacks>) {
    super(props);
  }
}

interface IRouteOptions<TParams> {
  routeName: string;
  routePath: string;
  /**
   * `routePathWithQuery` is for the case where routePath can sometimes have a query template
   * e.g. `/pcrs/dashboard?:search` this is not compatible as a path for the Router and so chose
   * to add additional optional prop for this scenario, as better alternative to stripping any query templates
   * at Router level for perf reasons
   */
  routePathWithQuery?: string;
  container: React.FunctionComponent<TParams & BaseProps>;
  getParams: (route: RouteState) => TParams;

  accessControl?: (auth: Authorisation, params: TParams, accessControlOptions: IAccessControlOptions) => boolean;
  getTitle: (getTitleArgs: { params: TParams; stores: IStores; content: Copy }) => {
    htmlTitle: string;
    displayTitle: string;
  };
  allowRouteInActiveAccess?: boolean;
}

export interface IRouteDefinition<TParams> extends IRouteOptions<TParams> {
  getLink: (params: TParams) => ILinkInfo;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRouteDefinition = IRouteDefinition<any>;

/**
 * ### defineRoute
 *
 * takes route config and generates a link object and returns config with link
 */
export function defineRoute<TParams extends AnyObject>(options: IRouteOptions<TParams>): IRouteDefinition<TParams> {
  return {
    ...options,
    getLink: params => ({
      path: makeUrlWithQuery(options.routePathWithQuery || options.routePath, convertToParameters(params)),
      routeName: options.routeName,
      routeParams: convertToParameters(params),
      accessControl: (user: IClientUser, accessControlOptions: IAccessControlOptions) =>
        options.accessControl?.(new Authorisation(user.roleInfo), params, accessControlOptions) ?? true,
    }),
  };
}

/**
 * converts data object to stringified versions suitable for url params
 */
function convertToParameters(params: AnyObject) {
  const result: { [key: string]: string | string[] } = {};

  Object.keys(params || {}).forEach((key: keyof typeof params) => {
    if (params[key] !== undefined) {
      result[key] = convertToParameter(params[key]);
    }
  });

  return result;
}

/**
 * converts a parameter to string
 */
function convertToParameter(p: unknown): string[] | string {
  if (typeof p === "number") {
    return p.toString();
  }

  if (typeof p === "boolean") {
    return p.toString();
  }

  if (typeof p === "string") {
    return p;
  }

  if (Array.isArray(p)) {
    return p;
  }

  throw new Error(`Unable to convert parameter to a string : ${JSON.stringify(p)}`);
}
