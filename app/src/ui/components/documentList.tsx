import * as React from "react";

interface Props {
  documents: Document[];
  title: string;
  qa: string;
}
interface Document {
  link: string;
  fileName: string;
  qa?: string;
}

export const DocumentList: React.SFC<Props> = (props) => {
  const { documents = [], title, qa } = props;
  const style = {
    // todo: add colours to central style module
    backgroundColor: "rgba(248, 248, 248, 1)",
    color: "#1E1E1E",
  };
  const anchorStyle = {
    paddingRight: "0.5em",
  };

  return (
    <div className="govuk-!-padding-3" data-qa={qa} style={style} >
      {title ? <h2 className="govuk-heading-m govuk-!-margin-bottom-0">{title}</h2> : null}
      <span>(Documents open in a new window)</span>
      <div className="govuk-!-padding-bottom-4">
        <ul data-qa={`${qa}-list`}>
          {
            documents.map((x, i) => (
              <li key={`link-${i}`}>
                <a target="_blank" href={x.link} className="govuk-link govuk-!-font-size-19" data-qa={x.qa} style={anchorStyle}>{x.fileName}</a>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
};
