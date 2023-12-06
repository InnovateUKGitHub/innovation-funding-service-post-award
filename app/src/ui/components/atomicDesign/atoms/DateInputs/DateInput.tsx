import { useContent } from "@ui/hooks/content.hook";
import cx from "classnames";
import { forwardRef } from "react";
import { Label } from "../form/Label/Label";
import { FormGroup } from "../form/FormGroup/FormGroup";

type DateInputProps = {
  hasError?: boolean;
  noLabel?: boolean;
  type: "month" | "year" | "day";
} & React.ComponentProps<"input">;

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(({ hasError, noLabel, type, ...props }, ref) => {
  const { getContent } = useContent();

  return (
    <div className="govuk-date-input__item">
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
});

DateInput.displayName = "DateInput";
