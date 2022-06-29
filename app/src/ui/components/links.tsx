import React from "react";
import cx from "classnames";
import { Link as RouterLink } from "react-router-dom";
import { ILinkInfo } from "@framework/types/ILinkInfo";

type TStyling = "Link" | "PrimaryButton" | "SecondaryButton" | "BackLink";
interface StyledLinkProps {
  styling?: TStyling;
}

interface LinkProps extends StyledLinkProps {
  id?: string;
  route: ILinkInfo;
  className?: string;
  replace?: boolean;
  children: React.ReactNode;
}

const getClassNames = (styling: TStyling, className?: string) => {
  return cx(
    {
      "govuk-link": styling === "Link",
      "govuk-button": styling === "PrimaryButton" || styling === "SecondaryButton",
      "govuk-!-margin-right-1": styling === "PrimaryButton" || styling === "SecondaryButton",
      "govuk-button--secondary": styling === "SecondaryButton",
      "govuk-back-link": styling === "BackLink",
    },
    className,
  );
};

export class Link extends React.Component<LinkProps> {
  render() {
    const { route, className, styling, ...props } = this.props;
    const linkStyling = styling ?? "Link";

    const styledClassName = getClassNames(linkStyling, className);

    return (
      <RouterLink
        {...props}
        to={route.path}
        className={styledClassName}
        replace={this.props.replace || false}
      />
    );
  }
}

interface ModalLinkProps extends StyledLinkProps {
  modalId: string;
  className?: string;
  open: boolean;
  children: React.ReactNode;
}

export class ModalLink extends React.Component<ModalLinkProps> {
  render() {
    const { modalId, children } = this.props;
    const styling = this.props.styling || "Link";
    const className = getClassNames(styling, this.props.className);

    return (
      <a href={this.props.open ? `#${modalId}` : "#"} className={className}>
        {children}
      </a>
    );
  }
}

export const BackLink: React.FunctionComponent<LinkProps> = props => (
  <Link styling="BackLink" {...props}>
    {props.children}
  </Link>
);

interface GovLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export const GovLink = React.forwardRef<HTMLAnchorElement, GovLinkProps>(function GovLinkWithoutRef(
  { children, className, ...props }: GovLinkProps,
  ref,
) {
  return (
    <a ref={ref} {...props} className={cx("govuk-link", className)}>
      {children}
    </a>
  );
});
