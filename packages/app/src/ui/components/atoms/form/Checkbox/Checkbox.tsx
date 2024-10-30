import { ReactNode, createContext, useContext, ComponentPropsWithoutRef } from "react";
import cx from "classnames";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface ICheckboxListContext<TFormValues extends FieldValues> {
  name: string;
  register: UseFormRegister<TFormValues>;
}

const CheckboxListContext = createContext<ICheckboxListContext<FieldValues> | undefined>(undefined);

const useCheckboxListContext = () => {
  const context = useContext(CheckboxListContext);
  if (context === undefined) {
    throw new Error("Checkbox components must be used within the CheckboxList component");
  }
  return context;
};

type CheckboxInputProps = ComponentPropsWithoutRef<"input"> & {
  "data-qa"?: string;
  label: string | ReactNode;
  id: string;
};

const Checkbox = ({ label, ...props }: CheckboxInputProps) => {
  const { register, name } = useCheckboxListContext();
  return (
    <div className="govuk-checkboxes__item">
      <input
        className={cx("govuk-checkboxes__input", props.className)}
        type="checkbox"
        {...props}
        {...register(name)}
      />
      <label className="govuk-label govuk-checkboxes__label" htmlFor={props.id}>
        {label}
      </label>
    </div>
  );
};

type CheckboxListProps<TFormValues extends FieldValues> = {
  name: string;
  register: UseFormRegister<TFormValues>;
  inline?: boolean;
  children: ReactNode;
  hasError?: boolean;
} & ComponentPropsWithoutRef<"input">;

const CheckboxList = <TFormValues extends FieldValues>({
  inline,
  className,
  children,
  name,
  register,
  // TODO: Stop using cloneElement for field inputs!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasError,
  ...props
}: CheckboxListProps<TFormValues>) => {
  return (
    <CheckboxListContext.Provider value={{ name, register: register as UseFormRegister<FieldValues> }}>
      <div className={cx("govuk-checkboxes", { "govuk-checkboxes--inline": inline }, className)} {...props}>
        {children}
      </div>
    </CheckboxListContext.Provider>
  );
};

export { Checkbox, CheckboxList };
