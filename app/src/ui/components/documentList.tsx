import * as React from "react";

interface Props {
  documents: Document[];
  title: string;
  qa: string;
}
interface Document {
  url?: string | null;
  title: string;
  qa?: string;
}

export const DocumentList: React.SFC<Props> = (props) => {
  const { documents = [], title, qa } = props;
  const style = {
    backgroundColor: "rgba(248, 248, 248, 1)",
    color: "#1E1E1E",
  };
  const anchorStyle = {
    color: "#6094C3",
    paddingRight: "0.5em",
  };

  return (
    <div className="govuk-!-padding-3" data-qa={qa} style={style} >
      {title ? <h2 className="govuk-heading-m govuk-!-margin-bottom-6">{title}</h2> : null}
      {
        !Array.isArray(documents) ? null : documents.filter(x => !!x.url).map(x => ({title: x.title, url: x.url!, qa: x.qa})).map((x, i) => (
          <div className="govuk-!-padding-bottom-4" key={`link-${i}`}>
            <a href={x.url} className="govuk-link govuk-!-font-size-19" data-qa={x.qa} style={anchorStyle}>{x.title}</a>
            <span>(opens in a new window)</span>
          </div>
        ))
      }
    </div>
  );
};
