import cx from "classnames";
import { forwardRef, type DetailedHTMLProps, type TextareaHTMLAttributes, Ref } from "react";

type TextareaProps = DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & {
  "data-qa"?: string;
  hasError?: boolean;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ hasError, className, ...props }: TextareaProps, ref: Ref<HTMLTextAreaElement>) => {
    return (
      <textarea ref={ref} className={cx("govuk-textarea", { "govuk-input--error": hasError }, className)} {...props} />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
