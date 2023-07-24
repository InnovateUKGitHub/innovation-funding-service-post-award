import { DetailedHTMLProps, HTMLAttributes, InputHTMLAttributes, ReactNode, createContext, useContext } from "react";
import cx from "classnames";
import { FieldValues, UseFormRegister } from "react-hook-form";

interface IRadioListContext<TFormValues extends FieldValues> {
  name: string;
  register: UseFormRegister<TFormValues>;
}

const RadioListContext = createContext<IRadioListContext<FieldValues> | undefined>(undefined);

const useRadioListContext = () => {
  const context = useContext(RadioListContext);
  if (context === undefined) {
    throw new Error("Radio components must be used within the RadioList component");
  }
  return context;
};

type RadioInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  "data-qa"?: string;
  label: string;
  id: string;
};

const Radio = ({ label, ...props }: RadioInputProps) => {
  const { register, name } = useRadioListContext();
  return (
    <div className="govuk-radios__item">
      <input
        value={props.id}
        className={cx("govuk-radios__input", props.className)}
        type="radio"
        {...props}
        {...register(name)}
      />
      <label className="govuk-label govuk-radios__label" htmlFor={props.id}>
        {label}
      </label>
    </div>
  );
};

type RadioListProps<TFormValues extends FieldValues> = {
  name: string;
  register: UseFormRegister<TFormValues>;
  inline?: boolean;
  children: ReactNode;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const RadioList = <TFormValues extends FieldValues>({
  inline,
  className,
  children,
  name,
  register,
  ...props
}: RadioListProps<TFormValues>) => {
  return (
    <RadioListContext.Provider value={{ name, register: register as UseFormRegister<FieldValues> }}>
      <div className={cx("govuk-radios", { "govuk-radios--inline": inline }, className)} {...props}>
        {children}
      </div>
    </RadioListContext.Provider>
  );
};

export { Radio, RadioList };