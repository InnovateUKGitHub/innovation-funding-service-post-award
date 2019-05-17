import React from "react";
import { HashTabs } from "../components/layout";

const tabs = [
  {text: "Claims", hash: "1", default: true, content: <div>Claims content 1<br/>Claims content 1<br/>Claims content 1<br/>Claims content 1<br/>Claims content 1<br/>Claims content 1<br/></div>},
    {text: "Log", hash: "2", content: <div>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/>Log content 2<br/></div>},
    {text: "Other", hash: "3", content: <div>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/>Other content 3<br/></div>},
];

export const hashTabsGuide: IGuide = {
    name: "Hash Tabs",
    options: [
        {
            name: "Simple",
            comments: "Renders Tabs",
            example: `<HashTabs tabList={${JSON.stringify(tabs)}}/>`,
            render: () => <HashTabs tabList={tabs}/>
        }
    ]
};
