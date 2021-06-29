import classNames from "classnames";

type ParagraphAttributes = React.HTMLAttributes<HTMLParagraphElement>;

interface SimpleStringProps extends ParagraphAttributes {
  qa?: string;
  multiline?: boolean;
  bold?: boolean;
}

export function SimpleString({ qa, className, multiline, bold, ...props }: SimpleStringProps) {
  return (
    <p
      {...props}
      data-qa={qa}
      className={classNames(className, "govuk-body", {
        "govuk-body--multiline": multiline,
        "govuk-!-font-weight-bold": bold,
      })}
    />
  );
}
