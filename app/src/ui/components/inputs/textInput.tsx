import * as React from "react";
import classNames from "classnames";

interface TextInputProps extends InputProps<string> {
    maxLength?: number;
    handleKeyTyped?: boolean;
}

export class TextInput extends React.Component<TextInputProps, InputState> {
    private timeoutId: number | null = null;

    constructor(props: TextInputProps) {
        super(props);
        this.state = { value: props.value || "" };
    }

    componentWillReceiveProps(nextProps: InputProps<string>) {
        if (nextProps.value !== this.props.value) {

            this.setState({ value: nextProps.value || "" });

            // Cancel the debounce timout
            if (this.timeoutId) {
                window.clearTimeout(this.timeoutId);
                this.timeoutId = 0;
            }
        }
    }

    keyTyped = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!this.props.handleKeyTyped) {
            return;
        }
        const value = e.currentTarget.value;
        this.setState({ value });
        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>, debounce: boolean) => {
        const value = e.currentTarget.value;
        this.setState({ value });
        debounce ? this.ownDebounce(value): this.changeNow(value);
    }

    private ownDebounce(value: string): void {
        // Cancel the debounce timeout before we create a new one
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = 0;
        }

        this.timeoutId = window.setTimeout(() => this.changeNow(value), 250);
    }

    private changeNow(value: string) {
        // Cancel the debounce timeout if it exists
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = 0;
        }

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    }

    render() {
        return (
            <input
                type="text"
                className={classNames("govuk-input")}
                name={this.props.name}
                value={this.state.value}
                disabled={!!this.props.disabled}
                onChange={e => this.handleChange(e, true)}
                onKeyUp={(e) => this.keyTyped(e)}
                onBlur={e => this.handleChange(e, false)}
                maxLength={this.props.maxLength}
            />
        );
    }
}
