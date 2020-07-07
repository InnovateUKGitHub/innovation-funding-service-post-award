import { TextAreaInput } from "./inputs/textAreaInput";
import React, { CSSProperties } from "react";
import { Result } from "@ui/validation";
import { EditorStatus, IEditorStore, StoresConsumer } from "@ui/redux";
import { ValidationError } from "./validationError";
import { TextInput } from "./inputs/textInput";
import classNames from "classnames";
import { NumberInput } from "./inputs/numberInput";
import { RadioList } from "./inputs/radioList";
import { CheckboxList } from "./inputs/checkboxList";
import { FileUpload, MulipleFileUpload } from "./inputs/fileUpload";
import { FullDateInput, MonthYearInput } from "./inputs/dateInput";
import { Button } from "./styledButton";
import { SearchInput } from "./inputs/searchInput";
import { FormInputWidths } from "./inputs/baseInput";
import { DropdownList } from "./inputs";
import { ContentSelector } from "@content/content";
import { Content } from "./content";

interface SharedFormProps<T> {
  onChange?: (data: T) => void;
  onSubmit?: () => void;
  qa?: string;
  enctype?: "urlencoded" | "multipart";
  isGet?: boolean;
}

interface EditorForm<T> extends SharedFormProps<T> {
  editor: IEditorStore<T, any>;
}

interface DataForm<T> extends SharedFormProps<T> {
  data: T;
  isSaving?: boolean;
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
      disabled: this.isEditor(this.props) ? this.props.editor.status === EditorStatus.Saving : (this.props.isSaving || false),
      onChange: this.props.onChange,
      onSubmit: this.props.onSubmit
    });

    const childrenWithData = React.Children.map(this.props.children, (child, index) => child && React.cloneElement(child as any, childProps(index)));
    return (
      <StoresConsumer>
        {
          stores => (
            <form encType={this.mapEncType()} method={this.props.isGet ? "get" : "post"} action="" onSubmit={(e) => this.onSubmit(e)} data-qa={this.props.qa}>
              <input type="hidden" name="_csrf" value={stores && stores.users.getCurrentUser().csrf}/>
              {childrenWithData}
            </form>
          )
        }
      </StoresConsumer>
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
  headingContent?: ContentSelector;
  qa?: string;
  headingQa?: string;
  isSubQuestion?: boolean;
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

    const legendClassName = classNames({
      "govuk-fieldset__legend": true,
      "govuk-fieldset__legend--s": this.props.isSubQuestion,
      "govuk-fieldset__legend--m": !this.props.isSubQuestion,
    });

    const Header = this.props.isSubQuestion ? "h3" : "h2";
    const headerContent = this.props.headingContent ? <Content value={this.props.headingContent} /> : this.props.heading;
    return (
      <fieldset className="govuk-fieldset" data-qa={this.props.qa}>
        <legend className={legendClassName}>
          {headerContent ? <Header className="govuk-fieldset__heading" data-qa={this.props.headingQa}>{headerContent}</Header> : null}
        </legend>
        {childrenWithData}
      </fieldset>
    );
  }
}

interface InternalFieldProps<T> extends FormChildProps<T> {
  field: (data: T, disabled: boolean, hasError: boolean | undefined) => React.ReactNode;
}

interface HiddenFieldProps<TDto> {
  name: string;
  value: (data: TDto) => string | number | null | undefined;
}

interface ExternalFieldProps<TDto, TValue> {
  label?: React.ReactNode;
  labelContent?: ContentSelector;
  labelBold?: boolean;
  labelHidden?: boolean;
  hint?: React.ReactNode;
  hintContent?: ContentSelector;
  name: string;
  value: (data: TDto, disabled: boolean) => TValue | null | undefined;
  update: (data: TDto, value: TValue | null) => void;
  validation?: Result;
  placeholder?: string;
}

// encapsulate logic for hint it generation
const createFieldHintId = <TDto, TValue>(props: ExternalFieldProps<TDto, TValue>) => `${props.name}-hint`;

class FieldComponent<T, TValue> extends React.Component<InternalFieldProps<T> & ExternalFieldProps<T, TValue>, {}> {
  render() {
    const { hint, hintContent, name, label, labelContent, labelHidden, labelBold, field, formData, validation } = this.props;
    const hasError = validation && validation.showValidationErrors && !validation.isValid;

    const hintValue = hintContent ? <Content value={hintContent} /> : hint;
    return (
      <div data-qa={`field-${name}`} className={classNames("govuk-form-group", { "govuk-form-group--error": hasError })}>
        {!!label || !!labelContent ? <label className={classNames("govuk-label", { "govuk-visually-hidden": labelHidden, "govuk-label--m": labelBold })} htmlFor={name}>{labelContent ? <Content value={labelContent} /> : label}</label> : null}
        {hintValue ? <span id={createFieldHintId(this.props)} className="govuk-hint">{hintValue}</span> : null}
        <ValidationError error={validation} />
        {field(formData, this.props.disabled, hasError)}
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

interface StringFieldProps<T> extends ExternalFieldProps<T, string> {
  width?: FormInputWidths;
}

const StringField = <T extends {}>(props: StringFieldProps<T> & InternalFieldProps<T>) => {
  return (
    <FieldComponent
      field={((data, disabled) => <TextInput width={props.width} name={props.name} value={props.value(data, disabled)} onChange={(val) => handleChange(props, val)} placeholder={props.placeholder} disabled={disabled} />)}
      {...props}
    />
  );
};

interface SearchFieldProps<T> extends ExternalFieldProps<T, string> {
  width?: FormInputWidths;
}

const SearchField = <T extends {}>(props: SearchFieldProps<T> & InternalFieldProps<T>) => {
  return (
    <FieldComponent
      field={((data, disabled) => <SearchInput width={props.width} name={props.name} value={props.value(data, disabled)} onChange={(val) => handleChange(props, val)} placeholder={props.placeholder} disabled={disabled} />)}
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
      field={((data, disabled) => <TextAreaInput name={props.name} value={props.value(data, disabled)} onChange={(val) => handleChange(props, val)} rows={props.rows} qa={props.qa} ariaDescribedBy={props.hint ? createFieldHintId(props) : undefined} disabled={disabled} />)}
      {...props}
    />
  );
};

interface NumericFieldProps<T> extends ExternalFieldProps<T, number> {
  width?: FormInputWidths;
}

const NumericField = <T extends {}>(props: NumericFieldProps<T> & InternalFieldProps<T>) => {
  const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, number> };
  return (
    <TypedFieldComponent
      field={((data, disabled) => <NumberInput name={props.name} value={props.value(data, disabled)} onChange={(val) => handleChange(props, val)} width={props.width} disabled={disabled} />)}
      {...props}
    />
  );
};

export interface SelectOption {
  id: string;
  value: React.ReactNode;
}

interface RadioFieldProps<T extends {}> extends ExternalFieldProps<T, SelectOption> {
  options: SelectOption[];
  inline: boolean;
}

const RadioOptionsField = <T extends {}>(props: RadioFieldProps<T> & InternalFieldProps<T>) => {
  const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, SelectOption> };
  return (
    <TypedFieldComponent
      field={(data, disabled) => <RadioList options={props.options} name={props.name} value={props.value(data, disabled)} inline={props.inline} onChange={(val) => handleChange(props, val)} disabled={disabled} />}
      {...props}
    />
  );
};

interface CheckboxFieldProps<T extends {}> extends ExternalFieldProps<T, SelectOption[]> {
  options: SelectOption[];
}

const CheckboxOptionsField = <T extends {}>(props: CheckboxFieldProps<T> & InternalFieldProps<T>) => {
  const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, SelectOption[]> };
  return (
    <TypedFieldComponent
      field={(data, disabled) => <CheckboxList options={props.options} name={props.name} value={props.value(data, disabled)} onChange={(val) => handleChange(props, val)} disabled={disabled} />}
      {...props}
    />
  );
};

export interface DropdownOption {
  id: string;
  value: string | number;
}

interface DropdownFieldProps<T extends {}> extends ExternalFieldProps<T, DropdownOption> {
  options: DropdownOption[];
  hasEmptyOption?: boolean;
}

const DropdownListField = <T extends {}>(props: DropdownFieldProps<T> & InternalFieldProps<T>) => {
  const TypedFieldComponent = FieldComponent as { new(): FieldComponent<T, DropdownOption> };
  return (
    <TypedFieldComponent
      field={(data, disabled) => <DropdownList placeholder={props.placeholder} options={props.options} name={props.name} hasEmptyOption={props.hasEmptyOption} value={props.value(data, disabled)} onChange={(val) => handleChange(props, val)} disabled={disabled} />}
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
  <Button
    type="submit"
    name="button_default"
    className={props.className}
    disabled={props.disabled}
    style={props.style}
    styling={props.styling || "Primary"}
    onClick={(e) => handleSubmit(props, e)}
  >
    {(props as any).children}
  </Button>
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
  <Button
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
  </Button>
);

const FileUploadComponent = <T extends {}>(props: ExternalFieldProps<T, IFileWrapper> & InternalFieldProps<T>) => {
  return (
    <FieldComponent
      field={((data, disabled, hasError) => <FileUpload value={props.value(data, disabled)} name={props.name} onChange={(val) => handleChange(props, val)} disabled={disabled} error={hasError} />)}
      {...props}
    />
  );
};

const MulipleFileUploadComponent = <T extends {}>(props: ExternalFieldProps<T, IFileWrapper[]> & InternalFieldProps<T>) => {
  return (
    <FieldComponent
      field={((data, disabled, hasError) => <MulipleFileUpload value={props.value(data, disabled)} name={props.name} onChange={(val) => handleChange(props, val)} disabled={disabled} error={hasError} />)}
      {...props}
    />
  );
};

const FullDateComponent = <T extends {}>(props: ExternalFieldProps<T, Date> & InternalFieldProps<T>) => {
  return (
    <FieldComponent
      field={(data, disabled, hasError) => (
        <FullDateInput
          name={props.name}
          disabled={disabled}
          value={props.value(data, disabled)}
          onChange={val => handleChange(props, val)}
          ariaDescribedBy={props.hint ? createFieldHintId(props) : undefined}
          hasError={hasError}
        />
      )}
      {...props}
    />
  );
};

interface MonthYearProps<TDto, TValue> extends ExternalFieldProps<TDto, TValue> {
  startOrEnd: "start" | "end";
  hideLabel?: boolean;
}

const MonthYearComponent = <T extends {}>(props: MonthYearProps<T, Date> & InternalFieldProps<T>) => {
  return (
    <FieldComponent
      field={(data, disabled, hasError) => (
        <MonthYearInput
          name={props.name}
          disabled={disabled}
          value={props.value(data, disabled)}
          onChange={val => handleChange(props, val)}
          ariaDescribedBy={props.hint ? createFieldHintId(props) : undefined}
          hasError={hasError}
          startOrEnd={props.startOrEnd}
          hideLabel={props.hideLabel}
        />
      )}
      {...props}
    />
  );
};

const CustomComponent = <T extends {}>(props: ExternalFieldProps<T, React.ReactNode> & InternalFieldProps<T>) => {
  return (
    <FieldComponent
      field={(data, disabled) => props.value(data, disabled)}
      {...props}
    />
  );
};

export interface FormBuilder<T> {
  Form: { new(): FormComponent<T> };
  Fieldset: { new(): FieldsetComponent<T> };
  String: React.FunctionComponent<StringFieldProps<T>>;
  Search: React.FunctionComponent<SearchFieldProps<T>>;
  MultilineString: React.FunctionComponent<MultiStringFieldProps<T>>;
  Numeric: React.FunctionComponent<NumericFieldProps<T>>;
  Radio: React.FunctionComponent<RadioFieldProps<T>>;
  DropdownList: React.FunctionComponent<DropdownFieldProps<T>>;
  Checkboxes: React.FunctionComponent<CheckboxFieldProps<T>>;
  Hidden: React.FunctionComponent<HiddenFieldProps<T>>;
  Submit: React.FunctionComponent<SubmitProps>;
  Button: React.FunctionComponent<ButtonProps>;
  FileUpload: React.FunctionComponent<ExternalFieldProps<T, IFileWrapper>>;
  MulipleFileUpload: React.FunctionComponent<ExternalFieldProps<T, IFileWrapper[]>>;
  Date: React.FunctionComponent<ExternalFieldProps<T, Date>>;
  MonthYear: React.FunctionComponent<MonthYearProps<T, Date>>;
  Custom: React.FunctionComponent<ExternalFieldProps<T, React.ReactNode>>;
}

export const TypedForm = <T extends {}>(): FormBuilder<T> => ({
  Form: FormComponent as { new(): FormComponent<T> },
  Fieldset: FieldsetComponent as { new(): FieldsetComponent<T> },
  String: StringField as React.FunctionComponent<StringFieldProps<T>>,
  Search: SearchField as React.FunctionComponent<SearchFieldProps<T>>,
  MultilineString: MultiStringField as React.FunctionComponent<MultiStringFieldProps<T>>,
  Numeric: NumericField as React.FunctionComponent<NumericFieldProps<T>>,
  Radio: RadioOptionsField as React.FunctionComponent<RadioFieldProps<T>>,
  DropdownList: DropdownListField as React.FunctionComponent<DropdownFieldProps<T>>,
  Checkboxes: CheckboxOptionsField as React.FunctionComponent<CheckboxFieldProps<T>>,
  Hidden: HiddenField as React.FunctionComponent<HiddenFieldProps<T>>,
  Submit: SubmitComponent as React.FunctionComponent<SubmitProps>,
  Button: ButtonComponent as React.FunctionComponent<ButtonProps>,
  FileUpload: FileUploadComponent as React.FunctionComponent<ExternalFieldProps<T, IFileWrapper>>,
  MulipleFileUpload: MulipleFileUploadComponent as React.FunctionComponent<ExternalFieldProps<T, IFileWrapper[]>>,
  Date: FullDateComponent as React.FunctionComponent<ExternalFieldProps<T, Date>>,
  MonthYear: MonthYearComponent as React.FunctionComponent<MonthYearProps<T, Date>>,
  Custom: CustomComponent as React.FunctionComponent<ExternalFieldProps<T, React.ReactNode>>
});
