import React, { CSSProperties } from "react";
import classNames from "classnames";
import * as ACC from "@ui/components";
import { Result } from "@ui/validation";
import { EditorStatus, IEditorStore } from "@ui/redux";

interface SharedFormProps<T> {
    onChange?: (data: T) => void;
    onSubmit?: () => void;
    qa?: string;
    enctype?: "urlencoded" | "multipart";
}

interface EditorForm<T> extends SharedFormProps<T> {
  editor: IEditorStore<T, any>;
}

interface DataForm<T> extends SharedFormProps<T> {
  data: T;
}

type FormProps<T> = EditorForm<T> | DataForm<T>;

interface FormChildProps<T> {
    key?: string;
    formData: T;
    onChange?: (data: T) => void;
    onSubmit?: () => void;
    disabled: boolean;
    qa?: string;
}

class FormComponent<T> extends React.Component<FormProps<T>, []> {
    render() {
        const childProps = (index: number): FormChildProps<T> => ({
            key: "formchild" + index,
            formData: this.isEditor(this.props) ? this.props.editor.data : this.props.data,
            disabled: this.isEditor(this.props) && this.props.editor.status === EditorStatus.Saving,
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

    private isEditor(props: EditorForm<T> | DataForm<T>): props is EditorForm<T> {
      return (props as EditorForm<T>).editor !== undefined;
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
            disabled: props.disabled,
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

interface InternalFieldProps<T> extends FormChildProps<T> {
  field: (data: T, disabled: boolean) => React.ReactNode;
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
    placeholder?: string;
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
        <ACC.ValidationError error={validation} />
        {field(formData, this.props.disabled)}
      </div>
    );
  }
}

const handleSubmit = <TDto extends {}>(props: SubmitProps, e: React.MouseEvent<{}>) => {
    const formProps = props as any as SharedFormProps<TDto>;
    if (formProps.onSubmit) {
        e.preventDefault();
        formProps.onSubmit();
    }
};

const handleOtherButton = (props: ButtonProps, e: React.MouseEvent<{}>) => {
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

const StringField = <T extends {}>(props: ExternalFieldProps<T, string> & InternalFieldProps<T>) => {
  return (
    <FieldComponent
      field={((data,disabled) => <ACC.Inputs.TextInput name={props.name} value={props.value(data)} onChange={(val) => handleChange(props, val)} placeholder={props.placeholder} disabled={disabled}/>)}
      {...props}
    />
  );
};

interface MultiStringFieldProps<T> extends ExternalFieldProps<T, string> {
  rows?: number;
  qa?: string;
}

const MultiStringField = <T extends {}>(props: MultiStringFieldProps<T> & InternalFieldProps<T>) => {
  return (
    <FieldComponent
      field={((data, disabled) => <ACC.Inputs.TextAreaInput name={props.name} value={props.value(data)} onChange={(val) => handleChange(props, val)} rows={props.rows} qa={props.qa} ariaDescribedBy={props.hint ? createFieldHintId(props) : undefined} disabled={disabled} />)}
      {...props}
    />
  );
};

interface NumericFieldProps<T> extends ExternalFieldProps<T, number> {
  width?: "small" | "medium" | "normal";
}

const NumericField = <T extends {}>(props: NumericFieldProps<T> & InternalFieldProps<T>) => {
  const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, number> };
  return (
    <TypedFieldComponent
      field={((data,disabled) => <ACC.Inputs.NumberInput name={props.name} value={props.value(data)} onChange={(val) => handleChange(props, val)} width={props.width} disabled={disabled} />)}
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

const RadioOptionsField = <T extends {}>(props: RadioFieldProps<T> & InternalFieldProps<T>) => {
  const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, SelectOption> };
  return (
    <TypedFieldComponent
      field={(data, disabled) => <ACC.Inputs.RadioList options={props.options} name={props.name} value={props.value(data)} inline={props.inline} onChange={(val) => handleChange(props, val)} disabled={disabled} />}
      {...props}
    />
  );
};

const HiddenField = <T extends {}>(props: HiddenFieldProps<T> & InternalFieldProps<T>) => {
  return (
    <input type="hidden" name={props.name} value={props.value((props as any as InternalFieldProps<T>).formData) || ""} />
  );
};

interface SubmitProps {
  className?: string;
  style?: CSSProperties;
  styling?: "Link" | "Secondary" | "Primary";
}

const SubmitComponent = <T extends {}>(props: SubmitProps & InternalFieldProps<T>) => (
  <ACC.Button
    type="submit"
    name="button_default"
    className={props.className}
    disabled={props.disabled}
    style={props.style}
    styling={props.styling || "Primary"}
    onClick={(e) => handleSubmit(props, e)}
  >
    {(props as any).children}
  </ACC.Button>
);

interface ButtonProps {
  name: string;
  className?: string;
  style?: CSSProperties;
  styling?: "Link" | "Secondary" | "Primary" | "Warning";
  value?: string;
  onClick?: () => void;
}

const ButtonComponent = <T extends {}>(props: ButtonProps & InternalFieldProps<T>) => (
  <ACC.Button
    type="submit"
    name={`button_${props.name}`}
    className={props.className}
    disabled={props.disabled}
    style={props.style}
    styling={props.styling || "Secondary"}
    value={props.value}
    onClick={(e) => handleOtherButton(props, e)}
  >
    {(props as any).children}
  </ACC.Button>
);

const FileUploadComponent = <T extends {}>(props: ExternalFieldProps<T, IFileWrapper> & InternalFieldProps<T>) => {
  return (
    <FieldComponent
      field={((data, disabled) => <ACC.Inputs.FileUpload value={props.value(data)} name={props.name} onChange={(val) => handleChange(props, val)} disabled={disabled}  error={props.validation && !props.validation.isValid && props.validation.showValidationErrors}/>)}
      {...props}
    />
  );
};

const MulipleFileUploadComponent = <T extends {}>(props: ExternalFieldProps<T, IFileWrapper[]> & InternalFieldProps<T>) => {
  return (
    <FieldComponent
      field={((data, disabled) => <ACC.Inputs.MulipleFileUpload value={props.value(data)} name={props.name} onChange={(val) => handleChange(props, val)} disabled={disabled} error={props.validation && !props.validation.isValid && props.validation.showValidationErrors}/>)}
      {...props}
    />
  );
};

export interface FormBuilder<T> {
  Form: { new(): FormComponent<T> };
  Fieldset: { new(): FieldsetComponent<T> };
  String: React.SFC<ExternalFieldProps<T, string>>;
  MultilineString: React.SFC<MultiStringFieldProps<T>>;
  Numeric: React.SFC<NumericFieldProps<T>>;
  Radio: React.SFC<RadioFieldProps<T>>;
  Hidden: React.SFC<HiddenFieldProps<T>>;
  Submit: React.SFC<SubmitProps>;
  Button: React.SFC<ButtonProps>;
  FileUpload: React.SFC<ExternalFieldProps<T, IFileWrapper>>;
  MulipleFileUpload: React.SFC<ExternalFieldProps<T, IFileWrapper[]>>;
}

export const TypedForm = <T extends {}>(): FormBuilder<T> => ({
  Form: FormComponent as { new(): FormComponent<T> },
  Fieldset: FieldsetComponent as { new(): FieldsetComponent<T> },
  String: StringField as React.SFC<ExternalFieldProps<T, string>>,
  MultilineString: MultiStringField as React.SFC<MultiStringFieldProps<T>>,
  Numeric: NumericField as React.SFC<NumericFieldProps<T>>,
  Radio: RadioOptionsField as React.SFC<RadioFieldProps<T>>,
  Hidden: HiddenField as React.SFC<HiddenFieldProps<T>>,
  Submit: SubmitComponent as React.SFC<SubmitProps>,
  Button: ButtonComponent as React.SFC<ButtonProps>,
  FileUpload: FileUploadComponent as React.SFC<ExternalFieldProps<T, IFileWrapper>>,
  MulipleFileUpload: MulipleFileUploadComponent as React.SFC<ExternalFieldProps<T, IFileWrapper[]>>,
});
