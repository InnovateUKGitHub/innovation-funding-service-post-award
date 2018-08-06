import React from 'react';
import { Link } from 'react-router5';

export const Breadcrumbs = (props: any) => {
  const renderLink = (linkProps: any, i: number) => {
    let { text, routeName, routeParams } = linkProps;
    return (
      <li key={`breadcrumb${i}`} className="govuk-breadcrumbs__list-item">
        <Link routeName={routeName} routeParams={routeParams}>{text}</Link>
      </li>
    );
  }

  const renderLastLink = () => (
    <li key={`breadcrumb-current`} className="govuk-breadcrumbs__list-item" aria-current="page">
      {props.children}
    </li>
  );

  const links: any[] = props.links || [];

  return (
    <div className="govuk-breadcrumbs">
      <ol className="govuk-breadcrumbs__list">
        { links.map((x, i) => renderLink(x, i)) }
        { renderLastLink() }
      </ol>
    </div>
  );
}
