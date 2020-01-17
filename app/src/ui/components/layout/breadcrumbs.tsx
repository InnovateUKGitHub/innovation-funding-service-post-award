import React from "react";
import { Link } from "react-router5";

interface Props {
  links: LinkProps[];
}

interface LinkProps {
  text: string;
  routeName: string;
  routeParams: any;
}

export const Breadcrumbs: React.FunctionComponent<Props> = (props) => {

  const renderLink = (link: LinkProps, i: number) => {
    const { text, routeName, routeParams } = link;

    return (
      <li key={`breadcrumb${i}`} className="govuk-breadcrumbs__list-item">
        <Link routeName={routeName} routeParams={routeParams}>{text}</Link>
      </li>
    );
  };

  const renderLastLink = () => (
    <li key={`breadcrumb-current`} className="govuk-breadcrumbs__list-item" aria-current="page">
      {props.children}
    </li>
  );

  return (
    <div className="govuk-breadcrumbs">
      <ol className="govuk-breadcrumbs__list">
        { props.links.map((x, i) => renderLink(x, i)) }
        { renderLastLink() }
      </ol>
    </div>
  );
};
