import { forwardRef, type DetailedHTMLProps, type TextareaHTMLAttributes, Ref } from "react";
import { CharacterCount } from "@ui/components/inputs/CharacterCount";
import { FormGroup } from "../FormGroup";
import { Hint } from "../Hint";
import { Label } from "../Label";
import { ValidationError } from "../ValidationError";
import { Textarea } from "../Textarea";
import { claimCommentsMaxLength } from "@ui/validators/claimDtoValidator";
import { FieldError } from "react-hook-form";

type TextAreaRef = Ref<HTMLTextAreaElement>;

type TextAreaFieldProps = DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & {
  error: FieldError | null | undefined;
  disabled?: boolean;
  hint?: string;
  label?: string;
  id: string;
  name: string;
  characterCount: number;
  "data-qa"?: string;
};

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (
    { id, error, hint, disabled, label, characterCount, "data-qa": dataQa = "textarea", ...props }: TextAreaFieldProps,
    ref: TextAreaRef,
  ) => {
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
        <CharacterCount type="descending" count={characterCount} maxValue={claimCommentsMaxLength}>
          <Textarea
            aria-label={label}
            aria-describedby={`hint-for-${id}`}
            id={id}
            hasError={!!error}
            disabled={disabled}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
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
