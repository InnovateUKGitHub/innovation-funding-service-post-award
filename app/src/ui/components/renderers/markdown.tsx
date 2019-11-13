import React from "react";
import marked from "marked";

interface Props {
  value: string|null|undefined;
}

export const Markdown = (props: Props) => {
  if(!props.value) return null;
  return <span className={"govuk-body"} dangerouslySetInnerHTML={{ __html: marked(props.value) }} />;
};
