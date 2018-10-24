import * as React from "react";
import classNames from "classnames";
import { BaseInput } from "./baseInput";

interface RadioListProps extends InputProps<{ id: string, value: string }> {
  options: { id: string, value: string }[];
}

export class RadioList extends BaseInput<RadioListProps, {}> {
  render() {
    return (
      <div className="govuk-radios govuk-radios--inline">
        {this.props.options.map((x,i) => this.renderOption(x, i))}
      </div>
    );
  }

  renderOption(item: { id: string; value: string; }, index: number): any {
    const selected = this.props.value ? this.props.value.id === item.id : false;
    return (
      <div className="govuk-radios__item" key={`option` + index}>
        <input className="govuk-radios__input" id={item.id} name={this.props.name} type="radio" value={item.id} onChange={e => this.onChange(item)} checked={selected} />
        <label className="govuk-label govuk-radios__label" htmlFor={item.id}>{item.value}</label>
      </div>
    );
  }

  private onChange(item: { id: string; value: string; }) {
    if (this.props.onChange) {
      this.props.onChange(item);
    }
  }
}
