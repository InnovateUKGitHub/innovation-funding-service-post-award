import { forwardRef, type DetailedHTMLProps, type TextareaHTMLAttributes, Ref } from "react";
import { ValidationError } from "../../../atoms/validation/ValidationError/ValidationError";
import { Textarea } from "../../../atoms/form/TextArea/Textarea";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { CharacterCount } from "@ui/components/bjss/inputs/CharacterCount";
import { claimCommentsMaxLength } from "@ui/validation/validators/claimDtoValidator";

type TextAreaRef = Ref<HTMLTextAreaElement>;

type TextAreaFieldProps = DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & {
  error?: RhfError;
  disabled?: boolean;
  hint?: string | JSX.Element;
  label?: string;
  id: string;
  name: string;
  characterCount: number;
  characterCountType?: "descending" | "ascending";
  characterCountMax?: number;
  "data-qa"?: string;
};

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (
    {
      id,
      error,
      hint,
      disabled,
      label,
      characterCount,
      characterCountType = "descending",
      characterCountMax = claimCommentsMaxLength,
      "data-qa": dataQa = "textarea",
      ...props
    }: TextAreaFieldProps,
    ref: TextAreaRef,
  ) => {
    const characterCountProps =
      characterCountType === "descending"
        ? {
            type: characterCountType,
            maxValue: characterCountMax,
          }
        : { type: characterCountType, minValue: 0 };

    return (
      <FormGroup hasError={!!error} data-qa={`field-${dataQa}`}>
        {label && (
          <Label htmlFor={id} data-qa={`label-${dataQa}`}>
            {label}
          </Label>
        )}
        {hint && (
          <Hint id={`hint-for-${id}`} data-qa={`hint-${dataQa}`}>
            {hint}
          </Hint>
        )}
        <ValidationError error={error} data-qa={`error-${dataQa}`} />
        <CharacterCount count={characterCount} {...characterCountProps}>
          <Textarea
            aria-label={label}
            aria-describedby={!!hint ? `hint-for-${id}` : undefined}
            id={id}
            hasError={!!error}
            disabled={disabled}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore difficult to match exact types of ref and has no consequence elsewhere
            ref={ref}
            data-qa={dataQa}
            {...props}
          />
        </CharacterCount>
      </FormGroup>
    );
  },
);
TextAreaField.displayName = "TextAreaField";

export { TextAreaField };
