import * as React from "react";
import { LoadingStatus, Pending } from "../shared/pending";

interface Props<T> {
    render: (item: T) => React.ReactNode;
}

const LoadingComponent = <T extends {}>(pending: Pending<T>): React.SFC<Props<T>> => (props) => {
    if (pending.state === LoadingStatus.Failed) {
        return (<div>An error has occurred</div>);
    }
    else if (!!pending.data || pending.state === LoadingStatus.Done || pending.state === LoadingStatus.Stale) {
        return <div>{props.render(pending.data!)}</div>;
    }
    return (<div />);
};

export const Loading = {
    forData: <T extends {}>(pending: Pending<T>) => ({
        Loader: LoadingComponent(pending)
    })
};
