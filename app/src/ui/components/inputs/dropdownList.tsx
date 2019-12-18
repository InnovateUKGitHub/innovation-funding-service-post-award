import React from "react";

import { BaseInput } from "./baseInput";

interface DropdownListProps extends InputProps<{ id: string, value: string }> {
  options: { id: string, value: string }[];
  hasEmptyOption?: boolean;
}

export class DropdownList extends BaseInput<DropdownListProps, {}> {
  render() {
    return (
      <select id={this.props.name} name={this.props.name} className="govuk-select" value={this.props.value ? this.props.value.id : undefined} onChange={(e) => this.onChange(e.target.value)}>
        {this.props.hasEmptyOption ? <option key="option-empty" aria-selected={!this.props.value} value=""/> : null}
        {this.props.options.map((item, i) => <option key={`option-${item.id}`} value={item.id} aria-selected={!!(this.props.value && this.props.value.id === item.id)} >{item.value}</option>)}
      </select>
    );
  }

  private onChange(id: string) {
    if (this.props.onChange) {
      const item = id && this.props.options.find(x => x.id === id);
      this.props.onChange(item || null);
    }
  }
}
