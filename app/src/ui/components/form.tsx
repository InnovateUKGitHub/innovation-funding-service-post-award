import React, { CSSProperties } from "react";
import { TextInput } from "./inputs/textInput";
import { TextAreaInput } from "./inputs/textAreaInput";
import { NumberInput } from "./inputs/numberInput";
import classNames from "classnames";
import { Result } from "../validation/result";
import { ValidationError } from "./validationError";
import { FileUpload, RadioList } from "./inputs";
import { Button } from "./styledButton";

interface FormProps<T> {
    data: T;
    onChange?: (data: T) => void;
    onSubmit?: () => void;
    qa?: string;
    enctype?: "urlencoded" | "multipart";
}

interface FormChildProps<T> {
    key?: string;
    formData: T;
    onChange?: (data: T) => void;
    onSubmit?: () => void;
    qa?: string;
}

class FormComponent<T> extends React.Component<FormProps<T>, []> {
    render() {
        const childProps = (index: number): FormChildProps<T> => ({
            key: "formchild" + index,
            formData: this.props.data,
            onChange: this.props.onChange,
            onSubmit: this.props.onSubmit
        });

        const childrenWithData = React.Children.map(this.props.children, (child, index) => child && React.cloneElement(child as any, childProps(index)));
        return (
            <form encType={this.mapEncType()} method="post" action="" onSubmit={(e) => this.onSubmit(e)} data-qa={this.props.qa}>
                {childrenWithData}
            </form>
        );
    }

    private mapEncType() {
      return this.props.enctype === "multipart" ? "multipart/form-data" : "application/x-www-form-urlencoded";
    }

    private onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        if (this.props.onSubmit) {
            e.preventDefault();
            this.props.onSubmit();
        }
    }
}

interface FieldsetProps<T> {
    heading?: React.ReactNode;
    qa?: string;
    headingQa?: string;
}

class FieldsetComponent<T> extends React.Component<FieldsetProps<T>, []> {
    render() {
        const props = this.props as any as FieldsetProps<T> & FormChildProps<T>;
        const parentKey = "fieldset";
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
                    {this.props.heading ? <h2 className="govuk-fieldset__heading" data-qa={this.props.headingQa}>{this.props.heading}</h2> : null}
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

interface HiddenFieldProps<TDto> {
    name: string;
    value: (data: TDto) => string | number | null | undefined;
}

interface ExternalFieldProps<TDto, TValue> {
    label?: React.ReactNode;
    labelBold?: boolean;
    labelHidden?: boolean;
    hint?: React.ReactNode;
    name: string;
    value: (data: TDto) => TValue | null | undefined;
    update: (data: TDto, value: TValue | null) => void;
    validation?: Result;
}

// encapsulate logic for hint it generation
const createFieldHintId = <TDto, TValue>(props: ExternalFieldProps<TDto, TValue>) => `${props.name}-hint`;

class FieldComponent<T, TValue> extends React.Component<InternalFieldProps<T> & ExternalFieldProps<T, TValue>, {}> {
  render() {
    const { hint, name, label, labelHidden, labelBold, field, formData, validation } = this.props;
    const isValid = validation && validation.showValidationErrors && !validation.isValid;

    return (
      <div data-qa={`field-${name}`} className={classNames("govuk-form-group", { "govuk-form-group--error": isValid })}>
        {!!label ? <label className={classNames("govuk-label", { "govuk-visually-hidden" : labelHidden, "govuk-label--m" : labelBold })} htmlFor={name}>{label}</label> : null}
        {hint ? <span id={createFieldHintId(this.props)} className="govuk-hint">{hint}</span> : null}
        <ValidationError error={validation} />
        {field(formData!)}
      </div>
    );
  }
}

const handleSubmit = <TDto extends {}>(props: SubmitProps, e: React.MouseEvent<{}>) => {
    const formProps = props as any as FormProps<TDto>;
    if (formProps.onSubmit) {
        e.preventDefault();
        formProps.onSubmit();
    }
};

const handleOtherButton = <TDto extends {}>(props: ButtonProps, e: React.MouseEvent<{}>) => {
    if (props.onClick) {
        e.preventDefault();
        props.onClick();
    }
};

const handleChange = <TDto extends {}, TValue extends {}>(props: ExternalFieldProps<TDto, TValue>, value: TValue | null) => {
    const formProps = props as any as FormChildProps<TDto>;
    const data = formProps.formData;
    props.update(data, value);

    if (!!formProps.onChange) {
        formProps.onChange(data);
    }
};

const StringField = <T extends {}>(props: ExternalFieldProps<T, string>) => {
  const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, string> };
  return (
    <TypedFieldComponent
      field={(data => <TextInput name={props.name} value={props.value(data)} onChange={(val) => handleChange(props, val)} />)}
      {...props}
    />
  );
};

interface MultiStringFieldProps<T> extends ExternalFieldProps<T, string> {
  rows?: number;
  qa?: string;
}

const MultiStringField = <T extends {}>(props: MultiStringFieldProps<T>) => {
  const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, string> };
  return (
    <TypedFieldComponent
      field={(data => <TextAreaInput name={props.name} value={props.value(data)} onChange={(val) => handleChange(props, val)} rows={props.rows} qa={props.qa} ariaDescribedBy={props.hint ? createFieldHintId(props) : undefined} />)}
      {...props}
    />
  );
};

interface NumericFieldProps<T> extends ExternalFieldProps<T, number> {
  width?: "small" | "medium" | "normal";
}

const NumericField = <T extends {}>(props: NumericFieldProps<T>) => {
  const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, number> };
  return (
    <TypedFieldComponent
      field={(data => <NumberInput name={props.name} value={props.value(data)} onChange={(val) => handleChange(props, val)} width={props.width} />)}
      {...props}
    />
  );
};

export interface SelectOption {
    id: string;
    value: string;
}

interface RadioFieldProps<T extends {}> extends ExternalFieldProps<T, SelectOption> {
    options: SelectOption[];
    inline: boolean;
}

const RadioOptionsField = <T extends {}>(props: RadioFieldProps<T>) => {
  const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, SelectOption> };
  return (
    <TypedFieldComponent
      field={(data) => <RadioList options={props.options} name={props.name} value={props.value(data)} inline={props.inline} onChange={(val) => handleChange(props, val)} />}
      {...props}
    />
  );
};

const HiddenField = <T extends {}>(props: HiddenFieldProps<T>) => {
  return (
    <input type="hidden" name={props.name} value={props.value((props as any as InternalFieldProps<T>).formData!) || ""} />
  );
};

interface SubmitProps {
    disabled?: boolean;
    styling?: "Link" | "Secondary" | "Primary";
    className?: string;
    style?: CSSProperties;
}

const SubmitComponent: React.SFC<SubmitProps> = (props) => {
    const { disabled, children, style, styling, className } = props;
    const buttonProps = { disabled, style, className };
    return <Button type="submit" name="button_default" styling={styling || "Primary"} onClick={(e) => handleSubmit(props, e)} {...buttonProps}>{children}</Button>;
};

interface ButtonProps {
    name: string;
    onClick?: () => void;
    styling?: "Link" | "Secondary" | "Primary";
    className?: string;
    style?: CSSProperties;
    value?: string;
}

const ButtonComponent: React.SFC<ButtonProps> = (props) => {
  const { name, children, style, styling, className, value } = props;
  const buttonProps = { style, className };

  return (
    <Button
      type="submit"
      name={`button_${name}`}
      styling={styling || "Secondary"}
      value={value}
      onClick={(e) => handleOtherButton(props, e)}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

const FileUploadComponent = <T extends {}>(props: ExternalFieldProps<T, File>) => {
  const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, File> };
  return (
    <TypedFieldComponent
      field={((data) => <FileUpload value={props.value(data)} name={props.name} onChange={(val) => handleChange(props, val)} />)}
      {...props}
    />
  );
};

export const TypedForm = <T extends {}>() => ({
    Form: FormComponent as { new(): FormComponent<T> },
    Fieldset: FieldsetComponent as { new(): FieldsetComponent<T> },
    String: StringField as React.SFC<ExternalFieldProps<T, string>>,
    MultilineString: MultiStringField as React.SFC<MultiStringFieldProps<T>>,
    Numeric: NumericField as React.SFC<NumericFieldProps<T>>,
    Radio: RadioOptionsField as React.SFC<RadioFieldProps<T>>,
    Hidden: HiddenField as React.SFC<HiddenFieldProps<T>>,
    Submit: SubmitComponent,
    Button: ButtonComponent,
    FileUpload: FileUploadComponent as React.SFC<ExternalFieldProps<T, File>>,
});
