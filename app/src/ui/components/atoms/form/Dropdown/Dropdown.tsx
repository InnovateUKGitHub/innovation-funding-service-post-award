import { ComponentPropsWithRef, ComponentProps, forwardRef } from "react";
import cx from "classnames";

type OptionProps = ComponentProps<"option">;

type DropdownProps = ComponentPropsWithRef<"select"> & {
  hasEmptyOption?: boolean;
  options: OptionProps[];
  placeholder?: string;
};

const DropdownSelect = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ className, disabled, hasEmptyOption, placeholder, options, ...props }: DropdownProps, ref) => {
    return (
      <select ref={ref} className={cx("govuk-select", className)} disabled={disabled} {...props}>
        {hasEmptyOption && <option data-qa="placeholder-option">{placeholder}</option>}

        {options.map(item => (
          <option key={item.id} value={item.id}>
            {item.value}
          </option>
        ))}
      </select>
    );
  },
);

DropdownSelect.displayName = "DropdownSelect";

export { DropdownSelect };
