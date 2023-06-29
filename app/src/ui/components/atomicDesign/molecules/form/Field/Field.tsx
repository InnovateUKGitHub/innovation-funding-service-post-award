import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
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
