import React from "react";
import { Link as RouterLink } from "react-router5";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { scrollToTheTopInstantly } from "@framework/util/windowHelpers";
import classNames from "classnames";

type TStyling = "Link" | "PrimaryButton" | "SecondaryButton" | "BackLink";
interface StyledLinkProps {
  styling?: TStyling;
}

interface LinkProps extends StyledLinkProps {
  id?: string;
  route: ILinkInfo;
  className?: string;
  replace?: boolean;
  preserveData?: boolean;
}

const getClassNames = (styling: TStyling, className?: string) => {
  return classNames({
    "govuk-link": styling === "Link",
    "govuk-button": styling === "PrimaryButton" || styling === "SecondaryButton",
    "govuk-!-margin-right-1": styling === "PrimaryButton" || styling === "SecondaryButton",
    "govuk-button--secondary": styling === "SecondaryButton",
    "govuk-back-link": styling === "BackLink"
  }, className);
};

export class Link extends React.Component<LinkProps> {
  render() {
    const { id, route, children } = this.props;
    const styling = this.props.styling || "Link";
    const className = getClassNames(styling, this.props.className);

    const options = {
      replace: this.props.replace || false,
      preserveData: this.props.preserveData || false
    };

    return (
      <RouterLink
        id={id}
        routeName={route.routeName}
        routeParams={route.routeParams}
        className={className}
        successCallback={scrollToTheTopInstantly}
        routeOptions={options}
      >
        {children}
      </RouterLink>
    );
  }
}

interface ModalLinkProps extends StyledLinkProps {
  modalId: string;
  className?: string;
  open: boolean;
}

export class ModalLink extends React.Component<ModalLinkProps> {
  render() {
    const { modalId, children } = this.props;
    const styling = this.props.styling || "Link";
    const className = getClassNames(styling, this.props.className);
    return <a href={this.props.open ? `#${modalId}` : "#"} className={className}>{children}</a>;
  }
}

export const BackLink: React.FunctionComponent<LinkProps> = (props) => (
  <Link styling="BackLink" {...props}>{props.children}</Link>
);
