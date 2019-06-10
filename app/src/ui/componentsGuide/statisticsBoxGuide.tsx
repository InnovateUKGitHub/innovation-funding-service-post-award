import React from "react";
import { StatisticsBox } from "@ui/components";

export const statisticsBoxGuide: IGuide = {
    name: "Statistics Box",
    options: [
        {
            name: "Simple",
            comments: <React.Fragment>Renders a statistics box with action and number of actions required</React.Fragment>,
            example: "<StatisticsBox numberOfClaims={2} claimAction={\"Review submitted claims\"} />",
            render: () => <StatisticsBox number={2} label={"Review submitted claims"} />
        }
    ]
};
