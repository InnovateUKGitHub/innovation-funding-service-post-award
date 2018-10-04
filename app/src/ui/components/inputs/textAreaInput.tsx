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

    handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>, debounce: boolean) => {
        const value = e.currentTarget.value;
        this.setState({ value });
        debounce ? this.ownDebounce(value) : this.changeNow(value);
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
            <textarea
                name={this.props.name}
                className={classNames("govuk-textarea")}
                rows={this.props.rows || 5}
                value={this.state.value}
                disabled={!!this.props.disabled}
                onChange={x => this.handleChange(x, true)}
                onBlur={x => this.handleChange(x, false)}
                maxLength={this.props.maxLength}
            />
        );
    }
}
