import React from "react";
import { State as RouteState } from "router5";
import { Authorisation, IClientUser, ILinkInfo } from "@framework/types";
import { IClientConfig } from "@ui/redux/reducers/configReducer";
import { IStores } from "@ui/redux";
import { IRoutes } from "@ui/routing/routeConfig";
import { Content } from "@content/content";

export interface BaseProps {
    messages: string[];
    route: RouteState;
    config: IClientConfig;
    routes: IRoutes;
    isClient: boolean;
}

export type ContainerProps<TParams, TData, TCallbacks> = TParams & TData & TCallbacks & BaseProps;

export interface ContainerBaseClass<TParams, TData, TCallbacks> {
    new(props: TParams & TData & TCallbacks & BaseProps, context?: any): ContainerBase<TParams, TData, TCallbacks>;
}

export abstract class ContainerBaseWithState<TParams = {}, TData = {}, TCallbacks = {}, TState = {}> extends React.Component<ContainerProps<TParams, TData, TCallbacks>, TState> {
    constructor(props: ContainerProps<TParams, TData, TCallbacks>) {
        super(props);
    }
}

export abstract class ContainerBase<TParams = {}, TData = {}, TCallbacks = {}> extends React.Component<ContainerProps<TParams, TData, TCallbacks>> {
    constructor(props: ContainerProps<TParams, TData, TCallbacks>) {
        super(props);
    }
}

interface IRouteOptions<TParams> {
    routeName: string;
    routePath: string;
    container: React.FunctionComponent<TParams & BaseProps>;
    getParams: (route: RouteState) => TParams;
    accessControl?: (auth: Authorisation, params: TParams, config: IClientConfig) => boolean;
    getTitle: (getTitleArgs: { params: TParams, stores: IStores, content: Content }) => {
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
        getLink: (params) => ({
            routeName: options.routeName,
            routeParams: convertToParameters(params),
            accessControl: (user: IClientUser, config: IClientConfig) => !options.accessControl || options.accessControl(new Authorisation(user.roleInfo), params, config)
        })
    };
}

function convertToParameters(params: any) {
    const result: { [key: string]: string } = {};

    Object.keys(params || {}).forEach(key => {
        if (params[key] !== undefined) {
            result[key] = convertToParameter(params[key]);
        }
    });

    return result;
}

function convertToParameter(p: any): string {

    if (typeof (p) === "number") {
        return p.toString();
    }
    if (typeof (p) === "boolean") {
        return p.toString();
    }
    if (typeof (p) === "string") {
        return p;
    }
    throw new Error(`Unable to convert parameter to a string : ${JSON.stringify(p)}`);
}
