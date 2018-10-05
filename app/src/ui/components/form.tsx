import React from "react";
import { TextInput } from "./inputs/textInput";
import { TextAreaInput } from "./inputs/textAreaInput";
import { NumberInput } from "./inputs/numberInput";
import { Result as ValidationResult} from "../validators/common";
import classNames from "classnames";

interface FormProps<T> {
    data: T;
    onChange: (data: T) => void;
    onSubmit: () => void;
    qa?: string;
}

const cloneChildrenWithData = <T extends {}>(formProps: FormProps<T>, children: React.ReactNode, parentKey: string) => {
    return React.Children.map(children, (child, index) => React.cloneElement(child as any, { key: parentKey + "child" + index, data: formProps.data, onChange: formProps.onChange, onSubmit: formProps.onSubmit }));
};

class FormComponent<T> extends React.Component<FormProps<T>, []> {
    render() {
        const childrenWithData = cloneChildrenWithData(this.props, this.props.children, "form");
        return (
            <form method="post" action="" onSubmit={(e) => this.onSubmit(e)} data-qa={this.props.qa}>
                {childrenWithData}
            </form>
        );
    }

    private onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();
        this.props.onSubmit();
    }
}

interface FieldsetProps<T> {
    heading?: (data: T) => React.ReactNode;
    qa?: string;
    headingQa?: string;
}

class FieldsetComponent<T> extends React.Component<FieldsetProps<T>, []> {
    render() {
        const formProps = (this.props as any as FormProps<T>);
        const childrenWithData = cloneChildrenWithData(formProps, this.props.children, "fieldset");// React.Children.map(this.props.children, child => React.cloneElement(child as any, {data: this.props.data}));
        return (
            <fieldset className="govuk-fieldset" data-qa={this.props.qa}>
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                    {this.props.heading ? <h1 className="govuk-fieldset__heading" data-qa={this.props.headingQa}>{this.props.heading(formProps.data)}</h1> : null}
                </legend>
                {childrenWithData}
            </fieldset>
        );
    }
}

interface InternalFieldProps<T> {
    field: (data: T) => React.ReactNode;
    data?: T;
}

interface ExternalFieldProps<TDto, TValue> {
    label: React.ReactNode;
    hint?: React.ReactNode;
    name: string;
    value: (data: TDto) => TValue|null;
    update: (data: TDto, value: TValue|null) => void;
    validation?: ValidationResult;
}

class FieldComponent<T, TValue> extends React.Component<InternalFieldProps<T> & ExternalFieldProps<T, TValue>, {}> {
    render() {
        const { hint, name, label, field, data, validation } = this.props;
        return (
            <div data-qa={`field-${name}`} className={classNames("govuk-form-group", {"govuk-form-group--error": validation && validation.showValidationErrors() && !validation.isValid()})}>
                <label className="govuk-label" htmlFor={name}>{label}</label>
                {hint ? <span id={`${name}-hint`} className="govuk-hint">{hint}</span> : null}
                {validation && validation.showValidationErrors() && !validation.isValid() ? <span className="govuk-error-message">{validation.errorMessage}</span> : null}
                {field(data!)}
            </div>
        );
    }
}

const handleSubmit = <TDto extends {}>(props: SubmitProps, e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formProps = props as any as FormProps<TDto>;
    formProps.onSubmit();
};

const handleChange = <TDto extends {}, TValue extends {}>(props: ExternalFieldProps<TDto, TValue>, value: TValue|null) => {
    const formProps = props as any as FormProps<TDto>;
    const data = formProps.data;
    props.update(data, value);
    formProps.onChange(data);
};

const StringField = <T extends {}>(props: ExternalFieldProps<T, string>) => {
    const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, string> };
    return (
        <TypedFieldComponent field={(data => <TextInput value={props.value(data)} onChange={(val) => handleChange(props, val)} />)} {...props} />
    );
};

interface MultiStringFieldProps<T> extends ExternalFieldProps<T, string> {
    rows?: number;
    qa?: string;
}

const MultiStringField = <T extends {}>(props: MultiStringFieldProps<T>) => {
    const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, string> };
    return (
        <TypedFieldComponent field={(data => <TextAreaInput name={props.name} value={props.value(data)} onChange={(val) => handleChange(props, val)} rows={props.rows} qa={props.qa} />)}  {...props} />
    );
};

const NumericField = <T extends {}>(props: ExternalFieldProps<T, number>) => {
    const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, number> };
    return (
        <TypedFieldComponent field={(data => <NumberInput value={props.value(data)} onChange={(val) => handleChange(props, val)} />)} {...props} />
    );
};

interface SubmitProps {
    qa?: string;
}

const SubmitComponent: React.SFC<SubmitProps> = (props) => {
    return <button type="submit" className="govuk-button" onClick={(e) => handleSubmit(props, e)}>{props.children}</button>;
};

interface ButtonProps {
    name: string;
    onClick: () => void;
    qa?: string;
}

const ButtonComponent: React.SFC<ButtonProps> = (props) => {
    return <button type="button" name={props.name} className="govuk-button" style={{background:"buttonface", color: "buttontext" }} onClick={(e) => props.onClick()}>{props.children}</button>;

};

export const TypedForm = <T extends {}>() => ({
    Form: FormComponent as { new(): FormComponent<T> },
    Fieldset: FieldsetComponent as { new(): FieldsetComponent<T> },
    String: StringField as React.SFC<ExternalFieldProps<T, string>>,
    MultilineString: MultiStringField as React.SFC<MultiStringFieldProps<T>>,
    Numeric: NumericField as React.SFC<ExternalFieldProps<T, number>>,
    Submit: SubmitComponent,
    Button: ButtonComponent
});
