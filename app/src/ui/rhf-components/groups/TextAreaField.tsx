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
};

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ id, error, hint, disabled, label, characterCount, ...props }: TextAreaFieldProps, ref: TextAreaRef) => {
    return (
      <FormGroup hasError={!!error}>
        {label && <Label htmlFor={id}>{label}</Label>}
        {hint && <Hint id={`hint-for-${id}`}>{hint}</Hint>}
        <ValidationError error={error} />
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
            {...props}
          />
        </CharacterCount>
      </FormGroup>
    );
  },
);
TextAreaField.displayName = "TextAreaField";

export { TextAreaField };
