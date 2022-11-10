import React from "react";
import classNames from "classnames";
import { InputProps } from "./common";

interface RadioOptionProps {
  id: string;
  value: React.ReactNode;
  qa?: string;
}

interface RadioListProps extends InputProps<{ id: string; value: React.ReactNode }> {
  options: RadioOptionProps[];
  inline: boolean;
}

export const RadioList = (props: RadioListProps) => {
  const handleChange = (item: { id: string; value: React.ReactNode }) => {
    if (props.onChange) {
      props.onChange(item);
    }
  };

  const renderOption = (item: RadioOptionProps, index: number) => {
    const selected = props.value ? props.value.id === item.id : false;
    const inputId = `${props.name}_${item.id}`;
    return (
      <div className="govuk-radios__item" key={"option" + index}>
        <input
          data-qa={item.qa}
          className="govuk-radios__input"
          id={inputId}
          name={props.name}
          type="radio"
          value={item.id}
          onChange={() => handleChange(item)}
          checked={selected}
          aria-checked={selected}
          disabled={props.disabled}
        />
        <label className="govuk-label govuk-radios__label" htmlFor={inputId}>
          {item.value}
        </label>
      </div>
    );
  };

  const className = classNames("govuk-radios", { "govuk-radios--inline": props.inline });
  return <div className={className}>{props.options.map((x, i) => renderOption(x, i))}</div>;
};
