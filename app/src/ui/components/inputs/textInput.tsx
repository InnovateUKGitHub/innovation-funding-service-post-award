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

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        this.setState({ value });
        this.ownDebounce(value);
    }

    private ownDebounce(value: string): void {
        // Cancel the debounce timeout before we create a new one
        if (this.timeoutId) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = 0;
        }

        this.timeoutId = window.setTimeout(() => {
            if (this.props.onChange) {
                this.props.onChange(value);
            }
            this.timeoutId = 0;
        }, 250);

    }

    render() {
        return (
            <input
                type="text"
                className={classNames("govuk-input")}
                name={this.props.name}
                value={this.state.value}
                disabled={!!this.props.disabled}
                onChange={this.handleChange}
                onKeyUp={(e) => this.keyTyped(e)}
                maxLength={this.props.maxLength}
            />
        );
    }
}
