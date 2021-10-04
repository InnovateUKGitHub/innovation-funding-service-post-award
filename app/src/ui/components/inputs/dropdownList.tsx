import { BaseInput } from "./baseInput";
import { InputProps } from "./common";

export interface DropdownListProps extends InputProps<{ id: string; value: string | number; qa?: string }> {
  options: { id: string; value: string | number; qa?: string }[];
  hasEmptyOption?: boolean;
  qa?: string;
}

export class DropdownList extends BaseInput<DropdownListProps, {}> {
  render() {
    return (
      <select
        id={this.props.name}
        name={this.props.name}
        data-qa={this.props.qa}
        className="govuk-select"
        value={this.props.value?.id || ""}
        onChange={e => this.onChange(e.target.value)}
      >
        {this.props.hasEmptyOption && (
          <option data-qa="placeholder-option" aria-selected={!this.props.value} value="">
            {this.props.placeholder}
          </option>
        )}
        {this.props.options.map((item) => (
          <option
            key={item.id}
            data-qa={item.qa || `option-${item.id}-qa`}
            value={item.id}
            aria-selected={this.props?.value?.id === item.id}
          >
            {item.value}
          </option>
        ))}
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
