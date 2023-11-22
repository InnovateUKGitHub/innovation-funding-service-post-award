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
  disabled?: boolean;
  role?: string;
}

const getClassNames = (styling: TStyling, disabled = false, ...className: cx.ArgumentArray) => {
  return cx(
    {
      "govuk-link": styling === "Link",
      "govuk-button": styling === "PrimaryButton" || styling === "SecondaryButton",
      "govuk-!-margin-right-1": styling === "PrimaryButton" || styling === "SecondaryButton",
      "govuk-button--secondary": styling === "SecondaryButton",
      "govuk-back-link": styling === "BackLink",
      "govuk-button--disabled": (styling === "PrimaryButton" || styling === "SecondaryButton") && disabled,
    },
    ...className,
  );
};

export const Link = (props: LinkProps) => {
  const { route, className, styling, id, replace = false, children, disabled } = props;
  const linkStyling = styling ?? "Link";
  const isButtonType = styling === "PrimaryButton" || styling === "SecondaryButton";
  const role = props.role || isButtonType ? "button" : "link";
  const styledClassName = getClassNames(linkStyling, disabled, className);

  if (disabled) {
    return (
      <span id={id} className={styledClassName}>
        {children}
      </span>
    );
  }

  return (
    <RouterLink role={role} id={id} to={route.path} className={styledClassName} replace={replace}>
      {children}
    </RouterLink>
  );
};

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
    const className = getClassNames(styling, false, this.props.className);

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
