import React from "react";
import { TextInput } from "./inputs/textInput";
import { TextAreaInput } from "./inputs/textAreaInput";
import { NumberInput } from "./inputs/numberInput";
import classNames from "classnames";
import { Result } from "../validation/result";
import { ValidationError } from "./validationError";
import { RadioList } from "./inputs";

interface FormProps<T> {
    data: T;
    onChange: (data: T) => void;
    onSubmit: () => void;
    qa?: string;
}

interface FormChildProps<T> {
  key?: string;
  formData: T;
  onChange: (data: T) => void;
  onSubmit: () => void;
  qa?: string;
}

class FormComponent<T> extends React.Component<FormProps<T>, []> {
    render() {
        const parentKey = "form";
        const childProps = (index: number): FormChildProps<T> => ({
          key: parentKey + "child" + index,
          formData: this.props.data,
          onChange: this.props.onChange,
          onSubmit: this.props.onSubmit
        });

        const childrenWithData = React.Children.map(this.props.children, (child, index) => child && React.cloneElement(child as any, childProps(index)));

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
        const props      = this.props as any as FieldsetProps<T> & FormChildProps<T>;
        const parentKey  = "fieldset";
        const childProps = (index: number): FormChildProps<T> => ({
          key: parentKey + "child" + index,
          formData: props.formData,
          onChange: props.onChange,
          onSubmit: props.onSubmit
        });

        const childrenWithData = React.Children.map(this.props.children, (child, index) => child && React.cloneElement(child as any, childProps(index)));

        return (
            <fieldset className="govuk-fieldset" data-qa={this.props.qa}>
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                    {this.props.heading ? <h1 className="govuk-fieldset__heading" data-qa={this.props.headingQa}>{this.props.heading(props.formData)}</h1> : null}
                </legend>
                {childrenWithData}
            </fieldset>
        );
    }
}

interface InternalFieldProps<T> {
    field: (data: T) => React.ReactNode;
    formData?: T;
}

interface ExternalFieldProps<TDto, TValue> {
    label: React.ReactNode;
    hint?: React.ReactNode;
    name: string;
    value: (data: TDto) => TValue|null|undefined;
    update: (data: TDto, value: TValue|null) => void;
    validation?: Result;
}

class FieldComponent<T, TValue> extends React.Component<InternalFieldProps<T> & ExternalFieldProps<T, TValue>, {}> {
    render() {
        const { hint, name, label, field, formData, validation } = this.props;
        return (
            <div data-qa={`field-${name}`} className={classNames("govuk-form-group", {"govuk-form-group--error": validation && validation.showValidationErrors && !validation.isValid})}>
                <label className="govuk-label" htmlFor={name}>{label}</label>
                {hint ? <span id={`${name}-hint`} className="govuk-hint">{hint}</span> : null}
                <ValidationError error={validation}/>
                {field(formData!)}
            </div>
        );
    }
}

const handleSubmit = <TDto extends {}>(props: SubmitProps, e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formProps = props as any as FormProps<TDto>;
    formProps.onSubmit();
};

const handleOtherButton = <TDto extends {}>(props: ButtonProps, e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    props.onClick();
};

const handleChange = <TDto extends {}, TValue extends {}>(props: ExternalFieldProps<TDto, TValue>, value: TValue|null) => {
    const formProps = props as any as FormChildProps<TDto>;
    const data = formProps.formData;
    props.update(data, value);
    formProps.onChange(data);
};

const StringField = <T extends {}>(props: ExternalFieldProps<T, string>) => {
    const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, string> };
    return (
        <TypedFieldComponent field={(data => <TextInput name={props.name} value={props.value(data)} onChange={(val) => handleChange(props, val)} />)} {...props} />
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
        <TypedFieldComponent field={(data => <NumberInput name={props.name} value={props.value(data)} onChange={(val) => handleChange(props, val)} />)} {...props} />
    );
};

export interface SelectOption {
    id: string;
    value: string;
}

interface RadioFieldProps<T extends {}> extends ExternalFieldProps<T, SelectOption> {
    options: SelectOption[];
}

const RadioOptionsField = <T extends {}>(props: RadioFieldProps<T>) => {
    const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, SelectOption> };
    return (
        <TypedFieldComponent field={(data) => <RadioList options={props.options} name={props.name} value={props.value(data)} onChange={(val) => handleChange(props, val)}/>} {...props} />
    );
};

interface SubmitProps {
    qa?: string;
    disabled?: boolean;
}

const SubmitComponent: React.SFC<SubmitProps> = (props) => {
    return <button type="submit" name="button" value="default" disabled={props.disabled} className="govuk-button" onClick={(e) => handleSubmit(props, e)}>{props.children}</button>;
};

interface ButtonProps {
    name: string;
    onClick: () => void;
    qa?: string;
}

const ButtonComponent: React.SFC<ButtonProps> = (props) => {
    return <button type="submit" name="button" value={props.name} className="govuk-button" style={{background:"buttonface", color: "buttontext" }} onClick={(e) => handleOtherButton(props, e)}>{props.children}</button>;
};

export const TypedForm = <T extends {}>() => ({
    Form: FormComponent as { new(): FormComponent<T> },
    Fieldset: FieldsetComponent as { new(): FieldsetComponent<T> },
    String: StringField as React.SFC<ExternalFieldProps<T, string>>,
    MultilineString: MultiStringField as React.SFC<MultiStringFieldProps<T>>,
    Numeric: NumericField as React.SFC<ExternalFieldProps<T, number>>,
    Radio: RadioOptionsField as React.SFC<RadioFieldProps<T>>,
    Submit: SubmitComponent,
    Button: ButtonComponent
});
