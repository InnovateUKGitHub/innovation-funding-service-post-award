import React from "react";
import classNames from "classnames";
import { BaseInput } from "./baseInput";
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

export class RadioList extends BaseInput<RadioListProps, {}> {
  render() {
    const className = classNames("govuk-radios", { "govuk-radios--inline": this.props.inline });
    return (
      <div className={className}>
        {this.props.options.map((x, i) => this.renderOption(this.props.name, x, i))}
      </div>
    );
  }

  renderOption(name: string, item: RadioOptionProps, index: number): any {
    const selected = this.props.value ? this.props.value.id === item.id : false;
    const inputId = `${this.props.name}_${item.id}`;
    return (
      <div className="govuk-radios__item" key={"option" + index}>
        <input
          data-qa={item.qa}
          className="govuk-radios__input"
          id={inputId}
          name={this.props.name}
          type="radio"
          value={item.id}
          onChange={() => this.onChange(item)}
          checked={selected}
          aria-checked={selected}
          disabled={this.props.disabled}
        />
        <label className="govuk-label govuk-radios__label" htmlFor={inputId}>{item.value}</label>
      </div>
    );
  }

  private onChange(item: { id: string; value: React.ReactNode }) {
    if (this.props.onChange) {
      this.props.onChange(item);
    }
  }
}
