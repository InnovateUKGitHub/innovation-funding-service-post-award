import * as React from "react";

interface Link {
    url: string | undefined | null;
    text: string;
}

interface Props {
  links: Link[];
}

export const LinksList: React.SFC<Props> = (props) => {
    const { links = [] } = props;

    return (
        <React.Fragment>
            {
                !Array.isArray(links) ? null : links.filter(x => !!x.url).map(x => ({text: x.text, url: x.url!})).map((x, i) => (
                    <div className="govuk-!-padding-bottom-4" key={`link-${i}`}>
                        <a href={x.url} className="govuk-link govuk-!-font-size-19">{x.text}</a>
                    </div>
                ))
            }
        </React.Fragment>
    );
};
