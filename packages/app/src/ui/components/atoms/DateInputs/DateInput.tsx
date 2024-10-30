import { useContent } from "@ui/hooks/content.hook";
import cx from "classnames";
import { forwardRef } from "react";
import { Label } from "../form/Label/Label";
import { FormGroup } from "../form/FormGroup/FormGroup";

type DateInputProps = {
  hasError?: boolean;
  noLabel?: boolean;
  type: "month" | "year" | "day";
  noMarginBottom?: boolean;
} & React.ComponentProps<"input">;

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ hasError, noLabel, noMarginBottom, type, ...props }, ref) => {
    const { getContent } = useContent();

    return (
      <div className={cx("govuk-date-input__item", { "govuk-!-padding-bottom-0": noMarginBottom })}>
        <FormGroup>
          {!noLabel && (
            <Label htmlFor={props.id || props.name || ""}>{getContent(x => x.components.dateInput[type])}</Label>
          )}

          <input
            ref={ref}
            className={cx(
              "govuk-input",
              "govuk-date-input__input",
              {
                "govuk-input--error": hasError,
              },
              { "govuk-input--width-2": type === "month" || type === "day", "govuk-input--width-4": type === "year" },
            )}
            type="text"
            id={props.id || props.name}
            {...props}
          />
        </FormGroup>
      </div>
    );
  },
);

DateInput.displayName = "DateInput";
