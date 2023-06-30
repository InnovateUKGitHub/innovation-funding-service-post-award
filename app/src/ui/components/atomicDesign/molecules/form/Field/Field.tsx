import { mapErrors } from "@framework/mappers/mapRhfError";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { useMemo } from "react";
import { FieldError } from "react-hook-form";
import { ValidationError } from "../../../atoms/validation/ValidationError/ValidationError";

type FieldProps = {
  hint?: string;
  label?: string;
  id: string;
  "data-qa"?: string;
  error?: FieldError | undefined | null;
  children: JSX.Element;
};

const Field = ({ hint, label, id, error, children, ...props }: FieldProps) => {
  const describedBy = useMemo(() => {
    const descriptions = [];

    if (error) {
      const numberOfErrors = mapErrors(error).length;
      for (let i = 0; i < numberOfErrors; i++) {
        descriptions.push(`error-for-${id}-${i}`);
      }
    }

    return descriptions.join(" ");
  }, [id, error]);

  return (
    <FormGroup hasError={!!error}>
      <Fieldset aria-describedby={describedBy}>
        {!!label && (
          <Label htmlFor={id} data-qa={props["data-qa"] ? `${props["data-qa"]}-label` : ""}>
            {label}
          </Label>
        )}

        {!!hint && (
          <Hint id={`hint-for-${id}`} data-qa={props["data-qa"] ? `${props["data-qa"]}-hint` : ""}>
            {hint}
          </Hint>
        )}

        <ValidationError
          id={`error-for-${id}`}
          data-qa={props["data-qa"] ? `${props["data-qa"]}-error` : ""}
          error={error}
        />

        {children}
      </Fieldset>
    </FormGroup>
  );
};

Field.displayName = "Field";
export { Field };
