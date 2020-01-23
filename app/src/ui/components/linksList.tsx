import * as React from "react";

interface Link {
    url?: string | null;
    text: string;
    qa?: string;
}

interface Props {
  links: Link[];
  openNewWindow?: boolean;
  renderAfterLink?: (x: number) => React.ReactNode;
}

export const LinksList: React.FunctionComponent<Props> = (props) => {
    const { links = [], openNewWindow = false, renderAfterLink} = props;
    return (
        <React.Fragment>
            {
                !Array.isArray(links) ? null : links.filter(x => !!x.url).map(x => ({text: x.text, url: x.url!, qa: x.qa})).map((x, i) => (
                    <div className="govuk-!-padding-bottom-4" key={`link-${i}`}>
                      <a target={openNewWindow ? "_blank" : ""} href={x.url} className="govuk-link govuk-!-font-size-19" data-qa={x.qa}>{x.text}</a>
                      {renderAfterLink && renderAfterLink(i)}
                    </div>
                ))
            }
        </React.Fragment>
    );
};
