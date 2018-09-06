import * as React from "react";

interface Link {
    url: string | undefined | null;
    text: string;
    qa?: string;
}

interface Props {
  links: Link[];
}

export const LinksList: React.SFC<Props> = (props) => {
    const { links = [] } = props;

    return (
        <React.Fragment>
            {
                !Array.isArray(links) ? null : links.filter(x => !!x.url).map(x => ({text: x.text, url: x.url!, qa: x.qa})).map((x, i) => (
                    <div className="govuk-!-padding-bottom-4" key={`link-${i}`}>
                        <a href={x.url} className="govuk-link govuk-!-font-size-19" data-qa={x.qa}>{x.text}</a>
                    </div>
                ))
            }
        </React.Fragment>
    );
};
