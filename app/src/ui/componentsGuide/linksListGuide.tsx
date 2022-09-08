import { IGuide } from "@framework/types";
import { LinksList } from "../components";

const links = [
  { url: "test1", text: "Innovate UK" },
  { url: "test2", text: "Innovation funding advice" },
  { url: "test3", text: "Contact us" },
];

export const linksListGuide: IGuide = {
  name: "LinksList",
  options: [
    {
      name: "Simple",
      comments: "Renders a links list",
      example: "<LinksList links={links}/>",
      render: () => <LinksList links={links} />,
    },
  ],
};
