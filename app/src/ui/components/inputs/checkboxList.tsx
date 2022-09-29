import React from "react";
import classNames from "classnames";
import { InputProps } from "./common";

interface CheckboxOptionProps {
  id: string;
  value: React.ReactNode;
  disabled?: boolean;
  qa?: string;
}

interface CheckboxListProps extends InputProps<{ id: string; value: React.ReactNode }[]> {
  options: CheckboxOptionProps[];
}

export const CheckboxList = (props: CheckboxListProps) => {
  const onChange = (item: { id: string; value: React.ReactNode }, checked: boolean) => {
    const original = props.value || [];
    if (props.onChange) {
      const values = props.options.filter(x => (x.id === item.id ? checked : !!original.find(y => y.id === x.id)));
      props.onChange(values);
    }
  };

  const renderOption = (name: string, item: CheckboxOptionProps, index: number): any => {
    const selected = props.value ? !!props.value.find(x => x.id === item.id) : false;
    return (
      <div className="govuk-checkboxes__item" key={"option" + index}>
        <input
          data-qa={item.qa}
          className="govuk-checkboxes__input"
          id={`${name}_${item.id}`}
          name={name}
          type="checkbox"
          value={item.id}
          onChange={e => onChange(item, e.target.checked)}
          checked={selected}
          aria-checked={selected}
          disabled={props.disabled || item.disabled}
        />
        <label className="govuk-label govuk-checkboxes__label" htmlFor={`${name}_${item.id}`}>
          {item.value}
        </label>
      </div>
    );
  };

  const className = classNames("govuk-checkboxes");
  return <div className={className}>{props.options.map((x, i) => renderOption(props.name, x, i))}</div>;
};
