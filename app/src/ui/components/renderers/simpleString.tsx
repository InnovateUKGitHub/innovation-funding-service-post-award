import classNames from "classnames";

type ParagraphAttributes = React.HTMLAttributes<HTMLParagraphElement>;

interface SimpleStringProps extends ParagraphAttributes {
  as?: "p" | "span" | "div";
  qa?: string;
  multiline?: boolean;
  bold?: boolean;
}

export function SimpleString({ as: Element = "p", qa, className, multiline, bold, ...props }: SimpleStringProps) {
  return (
    <Element
      {...props}
      data-qa={qa}
      className={classNames(className, "govuk-body", {
        "govuk-body--multiline": multiline,
        "govuk-!-font-weight-bold": bold,
      })}
    />
  );
}
