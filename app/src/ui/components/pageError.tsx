import React from "react";
import * as ACC from "./index";

// You can either go back to the page you were previously on or go back to your <ACC.BackLink route={ProjectDashboardRoute.getLink({})}>{"dashboard"}</ACC.BackLink>.
export const PageError: React.SFC<{title: string}> = ({title, children}) => (
    <ACC.Page>
        <ACC.Title title={title}/>
        <ACC.Section>
          {children}
        </ACC.Section>
    </ACC.Page>
);
