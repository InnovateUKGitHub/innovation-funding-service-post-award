import * as React from "react";
import classNames from "classnames";
import { BaseInput } from "./baseInput";

interface TextInputProps extends InputProps<string> {
    maxLength?: number;
    handleKeyTyped?: boolean;
}

export class TextInput extends BaseInput<TextInputProps, InputState> {
    constructor(props: TextInputProps) {
        super(props);
        this.state = { value: props.value || "" };
    }

    public componentWillReceiveProps(nextProps: InputProps<string>) {
        if (nextProps.value !== this.props.value) {

            this.setState({ value: nextProps.value || "" });
            this.cancelTimeout();
        }
    }

    public render() {
        return (
            <input
                type="text"
                className={classNames("govuk-input")}
                name={this.props.name}
                value={this.state.value}
                disabled={!!this.props.disabled}
                onChange={e => this.handleChange(e, true)}
                onKeyUp={this.props.handleKeyTyped ? (e) => this.handleChange(e, false) : undefined}
                onBlur={e => this.handleChange(e, false)}
                maxLength={this.props.maxLength}
            />
        );
    }

    private handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>, debounce: boolean) => {
        const value = e.currentTarget.value;
        this.setState({ value });
        debounce ? this.debounce(() => this.changeNow(value)) : this.changeNow(value);
    }

    private changeNow(value: string) {
        this.cancelTimeout();
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }
}
