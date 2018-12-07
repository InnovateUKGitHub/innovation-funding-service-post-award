import React from "react";
import * as ACC from "./index";

export const PageError: React.SFC<{title: string}> = ({title, children}) => (
    <ACC.Page>
        <ACC.Title title={title}/>
        <ACC.Section>
          {children}
        </ACC.Section>
    </ACC.Page>
);
