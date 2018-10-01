import React from "react";
import { ContainerBase, ReduxContainer } from "../containerBase";
import * as ACC from "../../components";

export class ClaimForecastComponent extends ContainerBase<{}, {}, {}> {

    public render() {
        return (
            <ACC.Page>
                <ACC.Section>
                    <ACC.Title title={`Claim forecast`}/>
                </ACC.Section>
            </ACC.Page>
        );
    }
}

const definition = ReduxContainer.for<{}, {}, {}>(ClaimForecastComponent);

export const ForecastClaim = definition.connect({
    withData: (store, params) => ({
    }),
    withCallbacks: () => ({})
});

export const ClaimForecastRoute = definition.route({
    routeName: "claimForecast",
    routePath: "/projects/claims/forecast",
    getParams: () => ({}),
    getLoadDataActions: () => [],
    container: ForecastClaim
});
