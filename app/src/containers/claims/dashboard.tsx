import React from "react";
import { ContainerBase } from "../containerBase";
import * as ACC from "../../components";
import { routeConfig } from "../../routing";

interface Data {
}

interface Callbacks {
}

class ClaimsDashboardComponent extends ContainerBase<Data, Callbacks> {
  render() {
    return (
      <ACC.Page>
        <ACC.Section>
          <ACC.BackLink route={routeConfig.home}>Back</ACC.BackLink>
        </ACC.Section>
        <ACC.Title title="View project" />
      </ACC.Page>
    );
  }
}

export const ClaimsDashboard = ClaimsDashboardComponent;
