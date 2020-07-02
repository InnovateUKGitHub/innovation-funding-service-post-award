import React, { CSSProperties } from "react";
import classNames from "classnames";

export interface StyledButtonProps extends React.ButtonHTMLAttributes<{}> {
  styling: "Link" | "Secondary" | "Primary" | "Warning";
  className?: string;
  style?: CSSProperties;
}

export class Button extends React.PureComponent<StyledButtonProps, {}> {

  private elem: HTMLElement | null = null;
  private readonly govukButton = "govuk-button govuk-!-margin-right-1";

  componentDidMount() {
    const govFrontend = window && (window as any).GOVUKFrontend;
    if (this.elem && govFrontend) {
      new govFrontend.Button(this.elem).init();
    }
  }

  private getLinkButtonStyling(className?: string, style?: CSSProperties) {
    const linkStyles = classNames(className, "govuk-link");
    return { className: linkStyles, style };
  }

  private getPrimaryButtonStyling(className?: string, style?: CSSProperties) {
    const linkStyles = classNames(className, this.govukButton);
    return { className: linkStyles, style };
  }

  private getSecondaryButtonStyling(className?: string, style?: CSSProperties) {
    const linkStyles = classNames(className, this.govukButton, "govuk-button--secondary");
    return { className: linkStyles, style };
  }

  private getWarningButtonStyling(className?: string, style?: CSSProperties) {
    const linkStyles = classNames(className, this.govukButton, "govuk-button--warning");
    return { className: linkStyles, style };
  }

  private getButtonStyling({ styling, className, style }: StyledButtonProps) {
    switch (styling) {
      case "Warning": return this.getWarningButtonStyling(className, style);
      case "Link": return this.getLinkButtonStyling(className, style);
      case "Secondary": return this.getSecondaryButtonStyling(className, style);
      case "Primary":
      default: return this.getPrimaryButtonStyling(className, style);
    }
  }

  render() {
    const { className, styling, style, children, ...rest } = this.props;
    const buttonStyling = this.getButtonStyling({ className, styling, style });

    return (
      <button data-module="govuk-button" ref={(e) => this.elem = e} {...buttonStyling} {...rest} >{children}</button>
    );
  }
}
