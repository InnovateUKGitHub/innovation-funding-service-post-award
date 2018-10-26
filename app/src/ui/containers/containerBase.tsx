// tslint: disable
import React from "react";
import { ThunkDispatch } from "redux-thunk";
import { connect as reduxConnect } from "react-redux";
import { State as RouteState } from "router5";
import { RootState } from "../redux/reducers/rootReducer";
import { RootActions } from "../redux/actions/root";
import { matchRoute } from "../routing/matchRoute";
import { AsyncThunk } from "../redux/actions";

export interface ContainerBaseClass<TParams, TData, TCallbacks> {
    new(props: TParams & TData & TCallbacks & {route: RouteState}, context?: any): ContainerBase<TParams, TData, TCallbacks>;
}

export abstract class ContainerBase<TParams = {}, TData = {}, TCallbacks = {}> extends React.Component<TParams & TData & TCallbacks & {route: RouteState}, {}> {
    constructor(props: TParams & TData & TCallbacks & {route: RouteState}) {
        super(props);
    }
}

class ConnectWrapper<TParams, TData, TCallbacks> {
    constructor(
        private component: ContainerBaseClass<TParams, TData, TCallbacks>,
        private withData: (state: RootState, params: TParams) => TData,
        private withCallbacks: (dispatch: (action: AsyncThunk<any>) => void) => TCallbacks
    ) { }

    private mapStateToProps(state: RootState): TData & TParams & {route: RouteState} {
        const route = matchRoute(state.router.route);
        const params = (route.getParams && route.getParams(state.router.route!) || {}) as TParams;
        const data = this.withData(state, params);
        return Object.assign(data, params, {route: state.router.route!});
    }

    private mapDispachToProps(dispatch: ThunkDispatch<RootState, void, RootActions>) {
        return this.withCallbacks(dispatch);
    }

    public connect() {
        return reduxConnect<TData, TCallbacks, {route: RouteState} & TParams, RootState>((state) => this.mapStateToProps(state), (dispatch) => this.mapDispachToProps(dispatch))(this.component);
    }
}

class ReduxContainerWrapper<TParams, TData, TCallbacks> {
    constructor(private component: ContainerBaseClass<TParams, TData, TCallbacks>) {
    }

    public route(options: {
        routeName: string,
        routePath: string,
        getParams: (route: RouteState) => TParams,
        getLoadDataActions: (params: TParams) => AsyncThunk<any>[],
        container: React.ComponentClass<any> & { WrappedComponent: React.ComponentType<TParams & TData & TCallbacks & {route: RouteState}> }
    }) {
        return {
             getLink: (params: TParams): ILinkInfo => ({ routeName: options.routeName, routeParams: params}),
             ...options,
        };
    }

    public connect(options: { withData: (state: RootState, params: TParams) => TData, withCallbacks: (dispatch: ThunkDispatch<RootState, void, RootActions>) => TCallbacks }) {
        return new ConnectWrapper(this.component, options.withData, options.withCallbacks).connect();
    }
}

export class ReduxContainer {
    static for<TParams = {}, TData = {}, TCallbacks = {}>(component: ContainerBaseClass<TParams, TData, TCallbacks>) {
        return new ReduxContainerWrapper<TParams, TData, TCallbacks>(component);
    }
}
