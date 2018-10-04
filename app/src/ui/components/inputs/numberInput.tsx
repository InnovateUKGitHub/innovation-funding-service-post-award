import React from "react";
import classNames from "classnames";

interface NumberInputProps extends InputProps<number> {
}

interface NumberInputState extends InputState {
    invalid: boolean;
}

export class NumberInput extends React.Component<NumberInputProps, NumberInputState> {
    private timeoutId: number | null = null;

    constructor(props: NumberInputProps) {
        super(props);
        this.state = this.getStateFromProps(props);
    }

    private getStateFromProps(props: NumberInputProps): NumberInputState {
        return {
            value: props.value && props.value.toString() || "",
            invalid: !!props.value && isNaN(props.value!)
        };
    }

    componentWillReceiveProps(nextProps: NumberInputProps) {
        //if both new and current is nan then dont change
        if (nextProps.value !== this.props.value && !(isNaN(nextProps.value!) || isNaN(nextProps.value!))) {
            this.setState({ value: nextProps.value && nextProps.value.toString() || "" });

            // Cancel the debounce timout
            if (this.timeoutId) {
                window.clearTimeout(this.timeoutId);
                this.timeoutId = 0;
            }
        }
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>, debounce: boolean) => {
        const value = e.currentTarget.value;
        this.setState({ value });
        debounce ? this.debounce(value) : this.changeNow(value);
    }

    private debounce(value: string): void {
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

        let newValue: number | null = null;
        let invalid = false;
        if (isFinite(value as any)) {
            newValue = parseFloat(value);
        }
        else {
            newValue = NaN;
            invalid = true;
        }

        if (this.props.onChange) {
            this.props.onChange(newValue);
        }

        this.setState({ invalid: invalid })
    }

    public render() {
        return (
            <input
                type="text"
                className={classNames("govuk-input", { "govuk-input--error": this.state.invalid })}
                name={this.props.name}
                value={this.state.value}
                disabled={!!this.props.disabled}
                onChange={x => this.handleChange(x, true)}
                onBlur={x => this.handleChange(x, false)}
            />
        );
    }
}
