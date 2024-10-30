import { ButtonHTMLAttributes } from "react";
import { Path, PathValue, UseFormSetValue } from "react-hook-form";

export type RegisterButton<TFormValues> = (value: PathValue<TFormValues, Path<TFormValues>>) => {
  name: Path<TFormValues>;
  onClick: () => void;
};

/**
 * @template {object} TFormValues
 * @returns a function that is called with the value and will register the button for
 * use with discriminated unions in zod handlers for forms with two or more submit buttons.
 * @param {UseFormSetValue<TFormValues>} setValue is the setValue function from react-hook-form useForm.
 * @param {PathValue<TFormValues>} name is the name for the submit buttons (same for all buttons)
 * @example
 * const registerButton = createRegisterButton(setValue, "submitButton");
 * return (
 * <button type="submit" {...registerButton("submit")}>Submit</button>
 * <button type="submit" {...registerButton("save-and-return")}>Save and return</button>
 * )
 */
export function createRegisterButton<TFormValues extends AnyObject>(
  setValue: UseFormSetValue<TFormValues>,
  name: Path<TFormValues>,
) {
  return function registerButton(
    value: PathValue<TFormValues, Path<TFormValues>>,
  ): ButtonHTMLAttributes<HTMLButtonElement> {
    return {
      name,
      // need to be able to programatically set value because react will strip the value property
      onClick() {
        setValue(name, value);
      },
      // also set the value in rendered html for when js disabled
      value: String(value),
    };
  };
}
