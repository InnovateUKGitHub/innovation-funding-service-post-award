import React from "react";
import { Markdown } from "./renderers/markdown";
import { ContentConsumer } from "@ui/redux/contentProvider";
import { ContentSelector } from "@content/content";

interface Props {
  value: ContentSelector;
}

export const Content = (props: Props) => (
  <ContentConsumer>
    {
      content => {
        const result = props.value(content);
        if (result.markdown) {
          return <Markdown value={result.content} />;
        }
        return <React.Fragment>{result.content}</React.Fragment>;
      }
    }
  </ContentConsumer>
);
