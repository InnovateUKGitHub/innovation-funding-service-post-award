import React from "react";
import { Link, LinkProps } from "react-router5";

interface BreadcrumbItem extends LinkProps {
  text: string;
}
export interface BreadcrumbsProps {
  links: BreadcrumbItem[];
  children: React.ReactNode;
}

export function Breadcrumbs({ children, links }: BreadcrumbsProps) {
  return (
    <div className="govuk-breadcrumbs">
      <ol className="govuk-breadcrumbs__list">
        {links.map(({ text, ...routeProps }) => (
          <li key={text} data-qa="breadcrumb-item" className="govuk-breadcrumbs__list-item">
            <Link {...routeProps}>{text}</Link>
          </li>
        ))}

        <li
          key={`breadcrumb-current`}
          data-qa="breadcrumb-current-item"
          className="govuk-breadcrumbs__list-item"
          aria-current="page"
        >
          {children}
        </li>
      </ol>
    </div>
  );
}
