import * as React from 'react';

export const LinksList: React.SFC<{ links: { url: string|undefined, text: string }[] }> = (props) => {

    let { links = [] } = props;

    return (
        <React.Fragment>
            {
                links.filter(x => !!x.url).map((x,i) => (
                    <div className="govuk-!-padding-bottom-4" key={`link-${i}`}>
                        <a href={x.url} className="govuk-link govuk-!-font-size-19">{x.text}</a>
                    </div>
                ))
            }
        </React.Fragment>
    );
} 