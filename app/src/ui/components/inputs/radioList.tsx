import * as React from "react";
import { BaseInput } from "./baseInput";
import classNames from "classnames";

interface RadioListProps extends InputProps<{ id: string, value: string }> {
  options: { id: string, value: string }[];
  inline: boolean;
}

export class RadioList extends BaseInput<RadioListProps, {}> {
  render() {
    const className = classNames("govuk-radios", {"govuk-radios--inline": this.props.inline});
    return (
      <div className={className}>
        {this.props.options.map((x,i) => this.renderOption(this.props.name, x, i))}
      </div>
    );
  }

  renderOption(name: string, item: { id: string; value: string; }, index: number): any {
    const selected = this.props.value ? this.props.value.id === item.id : false;
    return (
      <div className="govuk-radios__item" key={`option` + index}>
        <input className="govuk-radios__input" id={`${this.props.name}_${item.id}`} name={this.props.name} type="radio" value={item.id} onChange={e => this.onChange(item)} checked={selected} />
        <label className="govuk-label govuk-radios__label" htmlFor={`${this.props.name}_${item.id}`}>{item.value}</label>
      </div>
    );
  }

  private onChange(item: { id: string; value: string; }) {
    if (this.props.onChange) {
      this.props.onChange(item);
    }
  }
}
