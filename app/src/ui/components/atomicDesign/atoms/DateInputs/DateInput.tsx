import { useContent } from "@ui/hooks/content.hook";
import cx from "classnames";
import { forwardRef } from "react";
import { Label } from "../form/Label/Label";
import { FormGroup } from "../form/FormGroup/FormGroup";

type DateInputProps = { hasError?: boolean; type: "month" | "year" } & React.ComponentProps<"input">;

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(({ hasError, type, ...props }, ref) => {
  const { getContent } = useContent();

  return (
    <div className="govuk-date-input__item">
      <FormGroup>
        <Label htmlFor={props.id || props.name || ""}>{getContent(x => x.components.dateInput[type])}</Label>

        <input
          ref={ref}
          className={cx(
            "govuk-input",
            "govuk-date-input__input",
            {
              "govuk-input--error": hasError,
            },
            { "govuk-input--width-2": type === "month", "govuk-input--width-4": type === "year" },
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
