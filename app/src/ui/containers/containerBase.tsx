import React from "react";
import { Authorisation, IClientUser, ILinkInfo } from "@framework/types";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { IStores } from "@ui/redux";
import { IRoutes } from "@ui/routing/routeConfig";
import { Content } from "@content/content";
import { MatchedRoute } from "@ui/routing";
import { makeUrlWithQuery } from "@ui/helpers/make-url";

interface RouteStateParams {
  [key: string]: any;
}

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
  currentRoute: IRouteDefinition<any>;
}

export type ContainerProps<TParams, TData, TCallbacks> = TParams & TData & TCallbacks & BaseProps;

export type ContainerBaseClass<TParams, TData, TCallbacks> = new (
  props: TParams & TData & TCallbacks & BaseProps,
  context?: any,
) => ContainerBase<TParams, TData, TCallbacks>;

export abstract class ContainerBaseWithState<
  TParams = {},
  TData = {},
  TCallbacks = {},
  TState = {},
> extends React.Component<ContainerProps<TParams, TData, TCallbacks>, TState> {
  constructor(props: ContainerProps<TParams, TData, TCallbacks>) {
    super(props);
  }
}

export abstract class ContainerBase<TParams = {}, TData = {}, TCallbacks = {}> extends React.Component<
  ContainerProps<TParams, TData, TCallbacks>
> {
  constructor(props: ContainerProps<TParams, TData, TCallbacks>) {
    super(props);
  }
}

// TODO: Remove duplication between MatchedRoute and IRouteOptions
interface IRouteOptions<TParams> extends Pick<MatchedRoute, "allowRouteInActiveAccess"> {
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
  // TODO: Remove this params are now fetched from a container level not route...
  getParams: (route: RouteState) => TParams;
  accessControl?: (auth: Authorisation, params: TParams, config: IClientConfig) => boolean;
  getTitle: (getTitleArgs: { params: TParams; stores: IStores; content: Content }) => {
    htmlTitle: string;
    displayTitle: string;
  };
}

export interface IRouteDefinition<TParams> extends IRouteOptions<TParams> {
  getLink: (params: TParams) => ILinkInfo;
}

export function defineRoute<TParams>(options: IRouteOptions<TParams>): IRouteDefinition<TParams> {
  return {
    ...options,
    getLink: params => ({
      path: makeUrlWithQuery(options.routePathWithQuery || options.routePath, convertToParameters(params)),
      routeName: options.routeName,
      routeParams: convertToParameters(params),
      accessControl: (user: IClientUser, config: IClientConfig) =>
        options.accessControl?.(new Authorisation(user.roleInfo), params, config) ?? true,
    }),
  };
}

function convertToParameters(params: any) {
  const result: { [key: string]: string | string[] } = {};

  Object.keys(params || {}).forEach(key => {
    if (params[key] !== undefined) {
      result[key] = convertToParameter(params[key]);
    }
  });

  return result;
}

function convertToParameter(p: any): string[] | string {
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
