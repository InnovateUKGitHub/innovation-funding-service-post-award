import React from "react";
import marked from "marked";

interface Props {
  value: string|null|undefined;
  style?: React.CSSProperties;
}

export const Markdown = (props: Props) => {
  if(!props.value) return null;
  return <span style={props.style} className={"govuk-body markdown"} dangerouslySetInnerHTML={{ __html: marked(props.value) }} />;
};
