import { Label } from "./Label";
import { FormGroup } from "./FormGroup";
import { Hint } from "./Hint";
import { FieldError } from "react-hook-form";
import { ValidationError } from "./ValidationError";

type FieldProps = {
  hint?: string;
  label?: string;
  id: string;
  "data-qa"?: string;
  error?: FieldError | undefined | null;
  children: JSX.Element;
};

const Field = ({ hint, label, id, error, children, ...props }: FieldProps) => {
  return (
    <FormGroup hasError={!!error}>
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

      <ValidationError data-qa={props["data-qa"] ? `${props["data-qa"]}-error` : ""} error={error} />

      {children}
    </FormGroup>
  );
};

Field.displayName = "Field";
export { Field };
