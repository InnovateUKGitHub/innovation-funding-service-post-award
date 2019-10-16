import React from "react";
import { HashTabItem, HashTabs } from "../components/layout/hashTabs";

const simpleTabs: HashTabItem[] = [
  { text: "Claims", hash: "simple1", content: <div>Claims content 1</div> },
  { text: "Log", hash: "simple2", content: <div>Log content 2</div> },
  { text: "Other", hash: "simple3", content: <div>Other content 3</div> },
];

const simpleTabsWithMessage = simpleTabs.map(x => ({...x, hash: x.hash + "withMessage"}));

const complex = [
  {
    text: "Claims",
    hash: "complex1",
    default: true,
    content: (
      <div>Claims content 1<br />Claims content 1<br />Claims content 1<br />Claims content 1<br />Claims content 1<br />Claims content 1<br /></div>
    )
  },
  {
    text: "Log",
    hash: "complex2",
    content: (
      <div>
        Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2
        <br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log
        content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log
        content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log
        content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log
        content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log
        content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />Log content 2<br />
      </div>
    )
  },
  {
    text: "Other",
    hash: "complex3",
    content: (
      <div>
        Other content 3<br />Other content 3<br />Other content 3<br />Other content 3<br />Other content 3<br />
        Other content 3<br />Other content 3<br />Other content 3<br />Other content 3<br />Other content 3<br />Other content 3<br />Other
        content 3<br />Other content 3<br />Other content 3<br />Other content 3<br />Other content 3<br />Other content 3<br />Other
        content 3<br />Other content 3<br />
      </div>
    )
  },
];

export const hashTabsGuide: IGuide = {
  name: "Hash Tabs",
  options: [
    {
      name: "Simple",
      comments: "Renders Tabs",
      example: `
        <HashTabs tabList={tabs}/>
      `,
      render: () => <HashTabs tabList={simpleTabs}/>
    },
    {
      name: "With Messages",
      comments: "Has messages as first content of tabs",
      example: `
        <HashTabs tabList={tabs} messages={["Message 1", "Message 2"]}/>
      `,
      render: () => <HashTabs tabList={simpleTabsWithMessage} messages={["Message 1", "Message 2"]}/>
    },
    {
      name: "With long content",
      comments: "with long content and no javascript will jump to section",
      example: `
        <HashTabs tabList={tabs}/>
      `,
      render: () => <HashTabs tabList={complex}/>
    },
  ]
};
