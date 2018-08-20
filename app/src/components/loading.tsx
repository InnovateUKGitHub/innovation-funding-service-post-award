import * as React from 'react';
import { Pending, LoadingStatus } from '../shared/pending';

interface Props<T> {
    render: (item: T) => React.ReactNode;
}

const LoadingComponent1 = <T extends {}>(pending: Pending<T>): React.SFC<Props<T>> => (props: Props<T>) => {
    if (pending.state == LoadingStatus.Failed) {
        return (<div>An error has occoured</div>);
    }
    else if (!!pending.data || pending.state === LoadingStatus.Done || pending.state === LoadingStatus.Stale) {
        return <div>{props.render(pending.data!)}</div>;
    }
    return (<div>Loading</div>);
}

const LoadingComponent = <T extends {}>(pending: Pending<T>): React.SFC<Props<T>> => (props) => {
    if (pending.state == LoadingStatus.Failed) {
        return (<div>An error has occoured</div>);
    }
    else if (!!pending.data || pending.state === LoadingStatus.Done || pending.state === LoadingStatus.Stale) {
        return <div>{props.render(pending.data!)}</div>;
    }
    return (<div>Loading</div>);
};

export const Loading = {
    forData: <T extends {}>(pending: Pending<T>) => ({
        Loader: LoadingComponent(pending)
    })
};



