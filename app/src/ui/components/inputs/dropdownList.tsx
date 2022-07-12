import cx from "classnames";
import { BaseInput } from "./baseInput";
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

export class DropdownList extends BaseInput<DropdownListProps, {}> {
  render() {
    return (
      <select
        id={this.props.id || this.props.name}
        name={this.props.name}
        data-qa={this.props.qa}
        className={cx("govuk-select", this.props.className)}
        value={this.props.value?.id || ""}
        onChange={e => this.onChange(e.target.value)}
        disabled={this.props.disabled}
      >
        {this.props.hasEmptyOption && (
          <option data-qa="placeholder-option" aria-selected={!this.props.value} value="">
            {this.props.placeholder}
          </option>
        )}

        {this.props.options.map(item => (
          <option
            key={item.id}
            data-qa={item.qa || `option-${item.id}-qa`}
            value={item.id}
            aria-selected={this.props?.value?.id === item.id}
          >
            {item.displayName ?? item.value}
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
