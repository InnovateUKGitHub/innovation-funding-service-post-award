import React from "react";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";

type FieldProps = {
  hint?: string;
  label?: string;
  labelBold?: boolean;
  legend?: string;
  id: string;
  "data-qa"?: string;
  error?: RhfError | undefined | null;
  children: JSX.Element;
};

const Field = ({ hint, label, legend, labelBold, id, error, children, ...props }: FieldProps) => {
  return (
    <FormGroup hasError={!!error}>
      {!!legend && (
        <Legend id={`legend-for-${id}`} data-qa={props["data-qa"] ? `${props["data-qa"]}-legend` : ""}>
          {legend}
        </Legend>
      )}

      {!!label && (
        <Label bold={labelBold} htmlFor={id} data-qa={props["data-qa"] ? `${props["data-qa"]}-label` : ""}>
          {label}
        </Label>
      )}
      {!!hint && (
        <Hint id={`hint-for-${id}`} data-qa={props["data-qa"] ? `${props["data-qa"]}-hint` : ""}>
          {hint}
        </Hint>
      )}

      {!!hint && (
        <Hint id={`hint-for-${id}`} data-qa={props["data-qa"] ? `${props["data-qa"]}-hint` : ""}>
          {hint}
        </Hint>
      )}

      {React.cloneElement(children, { hasError: !!error, id })}
    </FormGroup>
  );
};

Field.displayName = "Field";
export { Field };
