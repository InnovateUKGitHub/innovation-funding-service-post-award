import React, { cloneElement, CSSProperties, isValidElement, ReactNode } from "react";
import cx from "classnames";

import { IEditorStore } from "@ui/redux";
import { Result } from "@ui/validation";
import type { ContentSelector } from "@copy/type";
import { IFileWrapper } from "@framework/types";
import { EditorStatus } from "@ui/constants/enums";
import { isContentSolution } from "@ui/hooks";
import { TextAreaInput, TextAreaInputProps } from "./inputs/textAreaInput";
import { ValidationError } from "./validationError";
import { TextInput } from "./inputs/textInput";
import { NumberInput } from "./inputs/numberInput";
import { RadioList } from "./inputs/radioList";
import { CheckboxList } from "./inputs/checkboxList";
import { MultipleFileUpload } from "./inputs/fileUpload";
import { FullDateInput, MonthYearInput } from "./inputs/dateInput";
import { Button } from "./styledButton";
import { SearchInput } from "./inputs/searchInput";
import { FormInputWidths } from "./inputs/input-utils";
import { DropdownList, DropdownListOption } from "./inputs";
import { SecurityTokenInput } from "./SecurityTokenInput";

import { Content } from "./content";

interface SharedFormProps<T> {
  onChange?: (data: T) => void;
  onSubmit?: () => void;
  qa?: string;
  enctype?: "urlencoded" | "multipart";
  isGet?: boolean;
  action?: string;
  children: ReactNode;
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
  private onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    if (!this.props.onSubmit) return;

    e.preventDefault();
    this.props.onSubmit();
  }

  // TODO: Refactor '"editor" in props' when tsc is updated, it cannot infer when made a variable :(
  public render() {
    const { action = "", enctype, isGet, qa, children, onChange, onSubmit, ...props } = this.props;

    const isFormDisabled = "editor" in props ? props.editor.status === EditorStatus.Saving : props.isSaving;

    // TODO: find out why we need to spread onSubmit and onChange on to each of the immediate children of the form.
    const childrenWithProps = React.Children.toArray(children).map((child, index) => {
      const formData = "editor" in props ? props.editor.data : props.data;

      return (
        isValidElement<FormChildProps<T>>(child) &&
        cloneElement(child, {
          ...child.props,
          key: `formchild-${index}`,
          onChange,
          onSubmit,
          formData,
          disabled: isFormDisabled || child.props.disabled,
        })
      );
    });

    const encType = enctype === "multipart" ? "multipart/form-data" : "application/x-www-form-urlencoded";
    const methodValue = isGet ? "get" : "post";

    return (
      <form encType={encType} method={methodValue} action={action} data-qa={qa} onSubmit={e => this.onSubmit(e)}>
        <SecurityTokenInput />

        {childrenWithProps}
      </form>
    );
  }
}

interface FieldsetProps {
  heading?: string | ContentSelector;
  qa?: string;
  headingQa?: string;
  isSubQuestion?: boolean;
  className?: string;
  children: ReactNode;
}

class FieldsetComponent<T> extends React.Component<FieldsetProps, []> {
  render() {
    const props = this.props as any as FieldsetProps & FormChildProps<T>;

    const fieldsetChildren = React.Children.toArray(this.props.children);
    const childrenWithData = fieldsetChildren.map(
      (child, index) =>
        isValidElement<FieldsetProps & FormChildProps<T>>(child) &&
        cloneElement(child, {
          key: `fieldset-child-${index}`,
          formData: props.formData,
          disabled: props.disabled,
          onChange: props.onChange,
          onSubmit: props.onSubmit,
        }),
    );

    const Header = this.props.isSubQuestion ? "h3" : "h2";

    const { heading } = this.props;

    // TODO: Check for accessibility - can header be ommited
    const headerContent = heading ? typeof heading === "string" ? heading : <Content value={heading} /> : undefined;

    return (
      <fieldset className={cx("govuk-fieldset", this.props.className)} data-qa={this.props.qa}>
        <legend
          className={cx({
            "govuk-fieldset__legend": true,
            "govuk-fieldset__legend--s": this.props.isSubQuestion,
            "govuk-fieldset__legend--m": !this.props.isSubQuestion,
          })}
        >
          {headerContent && (
            <Header className="govuk-fieldset__heading" data-qa={this.props.headingQa}>
              {headerContent}
            </Header>
          )}
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

// TODO: Check accessibility - label + hint being required
interface ExternalFieldProps<TDto, TValue> {
  label?: string | ContentSelector;
  labelBold?: boolean;
  labelHidden?: boolean;
  hint?: React.ReactNode | ContentSelector;
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
    const { hint, name, label, labelHidden, labelBold, field, formData, validation } = this.props;
    const hasError = validation && validation.showValidationErrors && !validation.isValid;

    let hintValue: ReactNode;

    if (!hint) {
      hintValue = undefined;
    } else if (isValidElement(hint)) {
      hintValue = hint;
    } else if (isContentSolution(hint)) {
      hintValue = <Content value={hint} />;
    }

    const HintElement = typeof hintValue === "string" ? "p" : "div";

    return (
      <div data-qa={`field-${name}`} className={cx("govuk-form-group", { "govuk-form-group--error": hasError })}>
        {label && (
          <label
            className={cx("govuk-label", {
              "govuk-visually-hidden": labelHidden,
              "govuk-label--m": labelBold,
            })}
            htmlFor={name}
          >
            {typeof label === "string" ? label : <Content value={label} />}
          </label>
        )}

        {hintValue && (
          <HintElement id={createFieldHintId(this.props)} className="govuk-hint">
            {hintValue}
          </HintElement>
        )}

        {validation && <ValidationError error={validation} />}

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

const handleChange = <TDto extends {}, TValue extends {}>(
  props: ExternalFieldProps<TDto, TValue>,
  value: TValue | null,
) => {
  const formProps = props as any as FormChildProps<TDto>;
  const data = formProps.formData;
  props.update(data, value);

  if (formProps.onChange) {
    formProps.onChange(data);
  }
};

interface StringFieldProps<T> extends ExternalFieldProps<T, string> {
  width?: FormInputWidths;
}

const StringField = <T extends {}>({ field, ...props }: StringFieldProps<T> & InternalFieldProps<T>) => (
  <FieldComponent
    {...props}
    field={
      field ||
      ((data, disabled) => (
        <TextInput
          width={props.width}
          name={props.name}
          value={props.value(data, disabled)}
          onChange={val => handleChange(props, val)}
          placeholder={props.placeholder}
          disabled={disabled}
        />
      ))
    }
  />
);

interface SearchFieldProps<T> extends ExternalFieldProps<T, string> {
  width?: FormInputWidths;
  autoComplete?: React.InputHTMLAttributes<T>["autoComplete"];
  qa?: string;
}

const SearchField = <T extends {}>({ field, ...props }: SearchFieldProps<T> & InternalFieldProps<T>) => (
  <FieldComponent
    {...props}
    field={
      field ||
      ((data, disabled) => (
        <SearchInput
          {...props}
          disabled={disabled}
          value={props.value(data, disabled)}
          onChange={val => handleChange(props, val)}
        />
      ))
    }
  />
);

type MultiStringFieldProps<T> = ExternalFieldProps<T, string> & Omit<TextAreaInputProps, "value">;

const MultiStringField = <T extends {}>({ field, ...props }: MultiStringFieldProps<T> & InternalFieldProps<T>) => (
  <FieldComponent
    {...props}
    field={
      field ||
      ((data, disabled) => (
        <TextAreaInput
          name={props.name}
          value={props.value(data, disabled)}
          onChange={val => handleChange(props, val)}
          rows={props.rows}
          qa={props.qa}
          ariaDescribedBy={props.hint ? createFieldHintId(props) : undefined}
          disabled={disabled}
          characterCountOptions={props.characterCountOptions}
        />
      ))
    }
  />
);

interface NumericFieldProps<T> extends ExternalFieldProps<T, number> {
  width?: FormInputWidths;
}

const NumericField = <T extends {}>(props: NumericFieldProps<T> & InternalFieldProps<T>) => {
  const TypedFieldComponent = FieldComponent as new () => FieldComponent<T, number>;

  return (
    <TypedFieldComponent
      {...props}
      field={(data, disabled) => (
        <NumberInput
          name={props.name}
          value={props.value(data, disabled)}
          onChange={val => handleChange(props, val)}
          width={props.width}
          disabled={disabled}
        />
      )}
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
  const TypedFieldComponent = FieldComponent as new () => FieldComponent<T, SelectOption>;

  return (
    <TypedFieldComponent
      {...props}
      field={(data, disabled) => (
        <RadioList
          options={props.options}
          name={props.name}
          value={props.value(data, disabled)}
          inline={props.inline}
          onChange={val => handleChange(props, val)}
          disabled={disabled}
        />
      )}
    />
  );
};

interface CheckboxFieldProps<T extends {}> extends ExternalFieldProps<T, SelectOption[]> {
  options: SelectOption[];
}

const CheckboxOptionsField = <T extends {}>(props: CheckboxFieldProps<T> & InternalFieldProps<T>) => {
  const TypedFieldComponent = FieldComponent as new () => FieldComponent<T, SelectOption[]>;

  return (
    <TypedFieldComponent
      {...props}
      field={(data, disabled) => (
        <CheckboxList
          options={props.options}
          name={props.name}
          value={props.value(data, disabled)}
          onChange={val => handleChange(props, val)}
          disabled={disabled}
        />
      )}
    />
  );
};

export type DropdownOption = DropdownListOption;
interface DropdownFieldProps<T extends {}> extends ExternalFieldProps<T, DropdownOption> {
  options: DropdownOption[];
  hasEmptyOption?: boolean;
}

const DropdownListField = <T extends {}>(props: DropdownFieldProps<T> & InternalFieldProps<T>) => {
  const TypedFieldComponent = FieldComponent as new () => FieldComponent<T, DropdownOption>;

  return (
    <TypedFieldComponent
      {...props}
      field={(data, disabled) => (
        <DropdownList
          placeholder={props.placeholder}
          options={props.options}
          name={props.name}
          hasEmptyOption={props.hasEmptyOption}
          value={props.value(data, disabled)}
          onChange={val => handleChange(props, val)}
          disabled={disabled}
        />
      )}
    />
  );
};

const HiddenField = <T extends {}>(props: HiddenFieldProps<T> & InternalFieldProps<T>) => (
  <input type="hidden" name={props.name} value={props.value((props as any as InternalFieldProps<T>).formData) || ""} />
);

const buttonContentConfig = {
  SAVE_AND_CONTINUE: "Save and continue",
};

interface SubmitPropsBase {
  name?: string;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  styling?: "Link" | "Secondary" | "Primary";
}

interface SubmitPropsWithType {
  children?: never;
  type: keyof typeof buttonContentConfig;
}

interface SubmitPropsWithoutType {
  type?: never;
  // Note: <ACC.Content> returns an element not a string :(
  children: string | React.ReactElement;
}

type SubmitProps = SubmitPropsBase & (SubmitPropsWithType | SubmitPropsWithoutType);

const SubmitComponent = <T extends {}>({ name, ...props }: SubmitProps & InternalFieldProps<T>) => {
  const content = props.type ? buttonContentConfig[props.type] : props.children;

  const nameValue = `button_${name || "default"}`;

  return (
    <Button
      type="submit"
      name={nameValue}
      className={props.className}
      disabled={props.disabled}
      style={props.style}
      styling={props.styling || "Primary"}
      onClick={e => handleSubmit(props, e)}
    >
      {content}
    </Button>
  );
};

function SubmitAndContinueComponent<T extends {}>(props: SubmitPropsBase & InternalFieldProps<T>) {
  return <SubmitComponent {...props} type="SAVE_AND_CONTINUE" />;
}

interface ButtonProps {
  name: string;
  className?: string;
  disabled?: boolean;
  style?: CSSProperties;
  styling?: "Link" | "Secondary" | "Primary" | "Warning";
  value?: string;
  onClick?: () => void;
  qa?: string;
  children: ReactNode;
}

const ButtonComponent = <T extends {}>(props: ButtonProps & InternalFieldProps<T>) => (
  <Button
    type="submit"
    name={`button_${props.name}`}
    className={cx(props.className, { ["govuk-button--disabled"]: props.disabled })}
    disabled={props.disabled}
    style={props.style}
    styling={props.styling || "Secondary"}
    value={props.value}
    onClick={e => handleOtherButton(props, e)}
    qa={props.qa}
  >
    {(props as any).children}
  </Button>
);

const MultipleFileUploadComponent = <T extends {}>(
  props: ExternalFieldProps<T, IFileWrapper[]> & InternalFieldProps<T>,
) => (
  <FieldComponent
    {...props}
    field={(data, disabled, hasError) => (
      <MultipleFileUpload
        value={props.value(data, disabled)}
        name={props.name}
        onChange={val => handleChange(props, val)}
        disabled={disabled}
        error={hasError}
      />
    )}
  />
);

const FullDateComponent = <T extends {}>(props: ExternalFieldProps<T, Date> & InternalFieldProps<T>) => (
  <FieldComponent
    {...props}
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
  />
);

interface MonthYearProps<TDto, TValue> extends ExternalFieldProps<TDto, TValue> {
  startOrEnd: "start" | "end";
  hideLabel?: boolean;
}

const MonthYearComponent = <T extends {}>(props: MonthYearProps<T, Date> & InternalFieldProps<T>) => {
  return (
    <FieldComponent
      {...props}
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
          debounce={false}
        />
      )}
    />
  );
};

const CustomComponent = <T extends {}>(props: ExternalFieldProps<T, React.ReactNode> & InternalFieldProps<T>) => {
  return <FieldComponent {...props} field={(data, disabled) => props.value(data, disabled)} />;
};

export interface FormBuilder<T extends {}> {
  Form: new () => FormComponent<T>;
  Fieldset: new () => FieldsetComponent<T>;
  String: React.FunctionComponent<StringFieldProps<T>>;
  Search: React.FunctionComponent<SearchFieldProps<T>>;
  MultilineString: React.FunctionComponent<MultiStringFieldProps<T>>;
  Numeric: React.FunctionComponent<NumericFieldProps<T>>;
  Radio: React.FunctionComponent<RadioFieldProps<T>>;
  DropdownList: React.FunctionComponent<DropdownFieldProps<T>>;
  Checkboxes: React.FunctionComponent<CheckboxFieldProps<T>>;
  Hidden: React.FunctionComponent<HiddenFieldProps<T>>;
  Submit: React.FunctionComponent<SubmitProps>;
  SubmitAndContinue: React.FunctionComponent<SubmitPropsBase>;
  Button: React.FunctionComponent<ButtonProps>;
  MultipleFileUpload: React.FunctionComponent<ExternalFieldProps<T, IFileWrapper[]>>;
  Date: React.FunctionComponent<ExternalFieldProps<T, Date>>;
  MonthYear: React.FunctionComponent<MonthYearProps<T, Date>>;
  Custom: React.FunctionComponent<ExternalFieldProps<T, React.ReactNode>>;
}

export const TypedForm = <T extends {}>(): FormBuilder<T> => ({
  Form: FormComponent as new () => FormComponent<T>,
  Fieldset: FieldsetComponent as new () => FieldsetComponent<T>,
  String: StringField as React.FunctionComponent<StringFieldProps<T>>,
  Search: SearchField as React.FunctionComponent<SearchFieldProps<T>>,
  MultilineString: MultiStringField as React.FunctionComponent<MultiStringFieldProps<T>>,
  Numeric: NumericField as React.FunctionComponent<NumericFieldProps<T>>,
  Radio: RadioOptionsField as React.FunctionComponent<RadioFieldProps<T>>,
  DropdownList: DropdownListField as React.FunctionComponent<DropdownFieldProps<T>>,
  Checkboxes: CheckboxOptionsField as React.FunctionComponent<CheckboxFieldProps<T>>,
  Hidden: HiddenField as React.FunctionComponent<HiddenFieldProps<T>>,
  Submit: SubmitComponent as React.FunctionComponent<SubmitProps>,
  SubmitAndContinue: SubmitAndContinueComponent as React.FunctionComponent<SubmitPropsBase>,
  Button: ButtonComponent as React.FunctionComponent<ButtonProps>,
  MultipleFileUpload: MultipleFileUploadComponent as React.FunctionComponent<ExternalFieldProps<T, IFileWrapper[]>>,
  Date: FullDateComponent as React.FunctionComponent<ExternalFieldProps<T, Date>>,
  MonthYear: MonthYearComponent as React.FunctionComponent<MonthYearProps<T, Date>>,
  Custom: CustomComponent as React.FunctionComponent<ExternalFieldProps<T, React.ReactNode>>,
});
