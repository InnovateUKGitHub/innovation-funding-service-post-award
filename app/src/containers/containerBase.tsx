// tslint: disable
import React from "react";
import { Dispatch } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { connect as reduxConnect } from "react-redux";
import { RootState } from "../redux/reducers/rootReducer";
import { RootActions } from "../redux/actions/root";

interface ContainerBaseClass<TData, TCallbacks> {
    new (props: TData & TCallbacks, context?: any): ContainerBase<TData, TCallbacks>;
}

export abstract class ContainerBase<TData, TCallbacks> extends React.Component<TData & TCallbacks, {}> {
    constructor(props: TData & TCallbacks) {
        super(props);
    }
}

class ReduxContainerMapBoth<TData, TCallbacks> {
    constructor(
      private component: ContainerBaseClass<TData, TCallbacks>,
      private withData: (state: RootState) => TData,
      private withCallbacks: (dispatch: Dispatch) => TCallbacks
    ) {}

    public connect = () => reduxConnect<TData, TCallbacks, TData & TCallbacks, RootState>(this.withData, this.withCallbacks)(this.component);
}

class ReduxContainerMapDispach<TData, TCallbacks> {
    constructor(
      private component: ContainerBaseClass<TData, TCallbacks>,
      private withData: (state: RootState) => TData
    ) {}

    public withCallbacks(mapping: (dispatch: ThunkDispatch<RootState, void, RootActions>) => TCallbacks) {
        return new ReduxContainerMapBoth<TData, TCallbacks>(this.component, this.withData, mapping);
    }
}

class ReduxContainerMapProps<TData, TCallbacks> {
    constructor(private component: ContainerBaseClass<TData, TCallbacks>) {
    }

    public withData(mapping: (state: RootState) => TData) {
        return new ReduxContainerMapDispach<TData, TCallbacks>(this.component, mapping);
    }
}

export class ReduxContainer {
    static for<TData, TCallbacks>(component: ContainerBaseClass<TData, TCallbacks>) {
        return new ReduxContainerMapProps<TData, TCallbacks>(component);
    }
}
