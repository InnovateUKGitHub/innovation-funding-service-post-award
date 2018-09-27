import * as React from "react";
import classNames from "classnames";

interface TextAreaInputProps extends InputProps<string> {
    maxLength?: number;
    rows?: number;
}

export class TextAreaInput extends React.Component<TextAreaInputProps, InputState> {
    private timeoutId: number | null = null;

    constructor(props: TextAreaInputProps) {
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

    handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
            <textarea
                name={this.props.name}
                className={classNames("govuk-textarea")}
                rows={this.props.rows || 5}
                value={this.state.value}
                disabled={!!this.props.disabled}
                onChange={this.handleChange}
                maxLength={this.props.maxLength}
            />
        );
    }
}
