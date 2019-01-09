import * as React from "react";
import { LoadingStatus, Pending } from "../../shared/pending";
import { ErrorSummary, Link, PageError } from "./";
import { SimpleString } from "./renderers";
import { ProjectDashboardRoute } from "../containers/projects";
import { HomeRoute } from "../containers";
import { ErrorCode, IAppError } from "../../types/IAppError";

interface LoadingProps<T> {
    pending: Pending<T>;
    render: (data: T, loading?: boolean) => React.ReactNode;
    renderError?: (error: IAppError | null) => React.ReactNode ;
    renderLoading?: () => React.ReactNode;
}

/**
 * component to render a given ReactNode based on the state of a given Pending object
 */
export class Loader<T> extends React.Component<LoadingProps<T>, {}> {
    render() {
        let result;

        switch (this.props.pending.state) {
            // don't render anything as the request hasn't been made
            case LoadingStatus.Preload:
                return null;
            // request completed, call the given render function
            case LoadingStatus.Done:
                result = this.renderDone(this.props.pending.data!, false);
                break;
            // request is loading or data marked as stale
            case LoadingStatus.Stale:
            case LoadingStatus.Loading:
                // if we have data render it, otherwise call the loading function
                if (this.props.pending.data) {
                    result = this.renderDone(this.props.pending.data, true);
                } else {
                    result = this.renderLoading();
                }
                break;
            // request failed for some reason, call the error function to handle it
            case LoadingStatus.Failed:
                result = this.renderError(this.props.pending.error);
                break;
            // shouldn't ever be in a status not handled above
            default:
                throw new Error("Broken pending data, status missing.");
        }

        if (typeof result === "string") {
            return <span>{result}</span>;

        } else if (Array.isArray(result)) {
            return <div>{result}</div>;

        } else {
            return result as JSX.Element;
        }
    }

    private renderDone(data: T, loading: boolean): any {
        return this.props.render(data, loading);
    }

    private renderLoading(): React.ReactNode {
        return !!this.props.renderLoading ? this.props.renderLoading() : <span>Loading....</span>;
    }

    private renderError(error: IAppError): React.ReactNode {
        if (this.props.renderError) return this.props.renderError(error);

        return <ErrorSummary error={error}/>;
    }
}

const renderPageNotFoundError = () => (
  <PageError title="Page not found">
    <SimpleString>
      Please check the web address or search term you entered for any errors. You can return to <Link route={ProjectDashboardRoute.getLink({})}>your dashboard</Link> or go back to the <Link route={HomeRoute.getLink({})}>Innovate UK homepage</Link>.
    </SimpleString>
  </PageError>
);

const renderStandardErrorPage = () => (
  <PageError title="Something has gone wrong at our end">
    <SimpleString>
      You can either go back to the page you were previously on or go back to your <Link route={ProjectDashboardRoute.getLink({})}>dashboard</Link>.
    </SimpleString>
  </PageError>
);

export const PageLoader = <T, B>(props: LoadingProps<T>) => {
  return (
    <Loader
      {...props}
      renderError={(error) => {
        if (error && error.code === ErrorCode.REQUEST_ERROR) {
          return renderPageNotFoundError();
        }
        return renderStandardErrorPage();
      }}
    />);
};
