// tslint: disable
import React from "react";
import { ThunkDispatch } from "redux-thunk";
import { connect as reduxConnect } from "react-redux";
import { State as RouteState } from "router5";
import { RootState } from "../redux/reducers/rootReducer";
import { RootActions } from "../redux/actions/root";
import { matchRoute } from "../routing/matchRoute";
import { AsyncThunk } from "../redux/actions";
import { IClientUser } from "../../types/IUser";
import { ILinkInfo } from "../../types/ILinkInfo";
import { Authorisation } from "../../types";

interface BaseProps {
  messages: string[];
  route: RouteState;
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

class ConnectWrapper<TParams, TData, TCallbacks> {
    constructor(
        private readonly component: ContainerBaseClass<TParams, TData, TCallbacks>,
        private readonly withData: (state: RootState, params: TParams, auth: Authorisation) => TData,
        private readonly withCallbacks: (dispatch: (action: AsyncThunk<any>) => void) => TCallbacks
    ) { }

    private mapStateToProps(state: RootState): TData & TParams & BaseProps {
        const matched = matchRoute(state.router.route);
        const auth = new Authorisation(state.user.roleInfo);
        const params = (matched.getParams && matched.getParams(state.router.route!) || {}) as TParams;
        const data = this.withData(state, params, auth);
        const messages = state.messages.map(x => x.message);
        const route = state.router.route!;

        return Object.assign(data, params, { messages, route });
    }

    private mapDispachToProps(dispatch: ThunkDispatch<RootState, void, RootActions>) {
        return this.withCallbacks(dispatch);
    }

    public connect() {
        return reduxConnect<TData, TCallbacks, BaseProps & TParams, RootState>(
          (state) => this.mapStateToProps(state),
          (dispatch) => this.mapDispachToProps(dispatch)
        )(this.component);
    }
}

class ReduxContainerWrapper<TParams, TData, TCallbacks> {
    constructor(private readonly component: ContainerBaseClass<TParams, TData, TCallbacks>) {}

    public route(options: {
        routeName: string,
        routePath: string,
        getParams: (route: RouteState) => TParams,
        getLoadDataActions: (params: TParams, auth: Authorisation) => AsyncThunk<any>[],
        accessControl?: (auth: Authorisation, params: TParams, features: IFeatureFlags) => boolean,
        container: React.ComponentClass<any> & { WrappedComponent: React.ComponentType<TParams & TData & TCallbacks & BaseProps> }
    }) {
        return {
            getLink: (params: TParams): ILinkInfo => ({
              routeName: options.routeName,
              routeParams: params,
              accessControl: (user: IClientUser, features: IFeatureFlags) => !options.accessControl || options.accessControl(new Authorisation(user.roleInfo), params, features) }),
            ...options,
        };
    }

    public connect(options: { withData: (state: RootState, params: TParams, auth: Authorisation) => TData, withCallbacks: (dispatch: ThunkDispatch<RootState, void, RootActions>) => TCallbacks }) {
        return new ConnectWrapper(this.component, options.withData, options.withCallbacks).connect();
    }
}

export class ReduxContainer {
    static for<TParams = {}, TData = {}, TCallbacks = {}>(component: ContainerBaseClass<TParams, TData, TCallbacks>) {
        return new ReduxContainerWrapper<TParams, TData, TCallbacks>(component);
    }
}
