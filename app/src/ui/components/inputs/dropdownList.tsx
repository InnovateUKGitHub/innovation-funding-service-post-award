import cx from "classnames";
import { InputProps } from "./common";

export interface DropdownListOption {
  id: string;
  value: string | number;
  /**
   * @description Allows consumer to override the display value, sometimes the value is not descriptive enough.
   */
  displayName?: string;
  qa?: string;
}

export interface DropdownListProps extends InputProps<Exclude<DropdownListOption, "selected">> {
  options: DropdownListOption[];
  hasEmptyOption?: boolean;
  id?: string;
  qa?: string;
  className?: string;
}

export const DropdownList = ({
  id,
  qa,
  className,
  options,
  disabled,
  value,
  onChange,
  hasEmptyOption,
  placeholder,
  name,
}: DropdownListProps) => {
  const handleChange = (id: string) => {
    if (onChange) {
      const item = id && options.find(x => x.id === id);
      onChange(item || null);
    }
  };

  return (
    <select
      id={id || name}
      name={name}
      data-qa={qa}
      className={cx("govuk-select", className)}
      value={value?.id || ""}
      onChange={e => handleChange(e.target.value)}
      disabled={disabled}
    >
      {hasEmptyOption && (
        <option data-qa="placeholder-option" aria-selected={!value} value="">
          {placeholder}
        </option>
      )}

      {options.map(item => (
        <option
          key={item.id}
          data-qa={item.qa || `option-${item.id}-qa`}
          value={item.id}
          aria-selected={value?.id === item.id}
        >
          {item.displayName ?? item.value}
        </option>
      ))}
    </select>
  );
};
