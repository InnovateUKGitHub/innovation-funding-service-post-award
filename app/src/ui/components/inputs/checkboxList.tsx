import * as React from "react";
import { BaseInput } from "./baseInput";
import classNames from "classnames";

interface CheckboxOptionProps {
  id: string;
  value: React.ReactNode;
  disabled?: boolean;
  qa?: string;
}

interface CheckboxListProps extends InputProps<{ id: string, value: React.ReactNode }[]> {
  options: CheckboxOptionProps[];
}

export class CheckboxList extends BaseInput<CheckboxListProps, {}> {
  render() {
    const className = classNames("govuk-checkboxes");
    return (
      <div className={className}>
        {this.props.options.map((x, i) => this.renderOption(this.props.name, x, i))}
      </div>
    );
  }

  renderOption(name: string, item: CheckboxOptionProps, index: number): any {
    const selected = this.props.value ? !!this.props.value.find(x => x.id === item.id) : false;
    return (
      <div className="govuk-checkboxes__item" key={`option` + index}>
        <input
          data-qa={item.qa}
          className="govuk-checkboxes__input"
          id={`${name}_${item.id}`}
          name={name}
          type="checkbox"
          value={item.id}
          onChange={e => this.onChange(item, e.target.checked)}
          checked={selected}
          aria-checked={selected}
          disabled={this.props.disabled || item.disabled}
        />
        <label className="govuk-label govuk-checkboxes__label" htmlFor={`${name}_${item.id}`}>{item.value}</label>
      </div>
    );
  }

  private onChange(item: { id: string; value: React.ReactNode; }, checked: boolean) {
    const original = this.props.value || [];
    if (this.props.onChange) {
      const values = this.props.options.filter(x => x.id === item.id ? checked : !!original.find(y => y.id === x.id));
      this.props.onChange(values);
    }
  }
}
