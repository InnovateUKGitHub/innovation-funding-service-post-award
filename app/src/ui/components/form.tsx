import type { ContentSelector } from "@copy/type";
import { IFileWrapper } from "@framework/types";
import { EditorStatus } from "@ui/constants/enums";
import { isContentSolution } from "@ui/hooks";
import { IEditorStore } from "@ui/redux";
import { Result } from "@ui/validation";
import cx from "classnames";
import React, { createContext, CSSProperties, isValidElement, ReactNode, useContext } from "react";
import { Content } from "./content";
import { DropdownList, DropdownListOption } from "./inputs";
import { CheckboxList } from "./inputs/checkboxList";
import { FullDateInput, MonthYearInput } from "./inputs/dateInput";
import { MultipleFileUpload } from "./inputs/fileUpload";
import { FormInputWidths } from "./inputs/input-utils";
import { NumberInput } from "./inputs/numberInput";
import { RadioList } from "./inputs/radioList";
import { SearchInput } from "./inputs/searchInput";
import { TextAreaInput, TextAreaInputProps } from "./inputs/textAreaInput";
import { TextInput } from "./inputs/textInput";
import { SecurityTokenInput } from "./SecurityTokenInput";
import { Button } from "./styledButton";
import { ValidationError } from "./validationError";

// Re-export dropdown option interface
export type DropdownOption = DropdownListOption;

// Return type of our `createTypedForm` function
export type FormBuilder<T> = ReturnType<typeof createTypedForm<T>>;

// Type of a form Select option.
export interface SelectOption {
  id: string;
  value: React.ReactNode;
}

/**
 * Create a unique ID for hints for accessability and screen-reader purposes,
 * based upon the existing name of the field.
 *
 * @param {string} name The name of the form field.
 * @returns {string} A new name for the hint
 */
const createFieldHintId = (name: string) => `${name}-hint`;

/**
 * Create a collection of controlled form elements, and it's corresponding parent form.
 * All returned input elements, such as <Form.String />, <Form.Numeric />, <Form.MonthYear /> etc., **must**
 * be surrounded by the returned <Form.Form /> element.
 *
 * (unsupported!)
 * To use input elements without using controlled input, pass in the `null` type.
 *
 * @example
 * // This form only controls a single string.
 * const InputForm = createTypedForm<string>();
 *
 * const ContentSolutionComponent = () => {
 *   const { getContent } = useContent();
 *   const initialEmailState = "neil.little@iuk.ukri.org";
 *   const [email, setEmail] = useState<string | undefined>(initialEmailState);
 *
 *   return (
 *     <InputForm.Form
 *       data={{ email }}
 *       onChange={e => {
 *         setEmail(e.email);
 *       }}
 *       action="/"
 *     >
 *       <H3>{getContent(x => x.components.userChanger.enterUserSubtitle)}</H3>
 *
 *       <InputForm.String
 *         label="user"
 *         name="user"
 *         labelHidden
 *         value={x => x.email}
 *         update={(x, v) => (x.email = v || "")}
 *       />
 *
 *       <InputForm.Submit>
 *         {getContent(x => x.components.userChanger.changeUserMessage)}
 *       </InputForm.Submit>
 *     </InputForm.Form>
 *   );
 * };
 */
export const createTypedForm = <T,>() => {
  // Props shared by the <Form /> element, whether it is an editor or just a visualizer.
  interface SharedFormProps {
    onChange?: (data: T) => void;
    onSubmit?: () => void;
    qa?: string;
    enctype?: "urlencoded" | "multipart";
    isGet?: boolean;
    action?: string;
    disabled?: boolean;
    children: ReactNode;
  }

  // <Form /> editor specific props
  interface EditorForm extends SharedFormProps {
    editor: IEditorStore<T, AnyObject>;
  }

  // <Form /> visualizer specific props
  interface DataForm extends SharedFormProps {
    data: T;
    isSaving?: boolean;
  }

  // Props that apply to either the editor <Form /> or the visualizer <Form />
  type FormProps = EditorForm | DataForm;

  interface FieldsetProps {
    heading?: string | ContentSelector;
    qa?: string;
    headingQa?: string;
    isSubQuestion?: boolean;
    className?: string;
    children: ReactNode;
  }

  interface FieldParams {
    formData: T;
    disabled: boolean;
    hasError: boolean | undefined;
    onChange?: (data: T) => void;
    onSubmit?: () => void;
  }

  interface InternalFieldProps {
    key?: string;
    qa?: string;
    field: (params: FieldParams) => React.ReactNode;
  }

  interface HiddenFieldProps {
    name: string;
    value: (data: T) => string | number | null | undefined;
  }

  interface FieldComponentProps {
    label?: string | ContentSelector;
    labelBold?: boolean;
    labelHidden?: boolean;
    hint?: React.ReactNode | ContentSelector;
    name: string;
    validation?: Result;
    placeholder?: string;
    id?: string;
  }

  // TODO: Check accessibility - label + hint being required
  interface ExternalFieldProps<TValue> extends FieldComponentProps {
    value: (data: T, disabled: boolean) => TValue | null | undefined;
    update: (data: T, value: TValue | null) => void;
  }

  interface CustomFieldProps extends FieldComponentProps {
    value: (params: FieldParams) => React.ReactNode | null | undefined;
    update?: (data: T, value: React.ReactNode | null) => void;
  }

  interface StringFieldProps extends ExternalFieldProps<string> {
    width?: FormInputWidths;
  }

  interface SearchFieldProps extends ExternalFieldProps<string> {
    width?: FormInputWidths;
    autoComplete?: React.InputHTMLAttributes<T>["autoComplete"];
    qa?: string;
  }

  type MultiStringFieldProps = ExternalFieldProps<string> & Omit<TextAreaInputProps, "value">;

  interface NumericFieldProps extends ExternalFieldProps<number> {
    width?: FormInputWidths;
  }

  interface RadioFieldProps extends ExternalFieldProps<SelectOption> {
    options: SelectOption[];
    inline: boolean;
  }

  interface CheckboxFieldProps extends ExternalFieldProps<SelectOption[]> {
    options: SelectOption[];
  }

  interface DropdownFieldProps extends ExternalFieldProps<DropdownOption> {
    options: DropdownOption[];
    hasEmptyOption?: boolean;
  }

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

  interface MonthYearProps<TValue> extends ExternalFieldProps<TValue> {
    startOrEnd: "start" | "end";
    hideLabel?: boolean;
  }

  interface IFormDataContext {
    formData: T;
    onChange?: (data: T) => void;
    onSubmit?: () => void;
    disabled: boolean;
  }

  // Create a context for all child components to consume form data
  const FormDataContext = createContext<IFormDataContext | undefined>(undefined);
  const FormDataContextProvider = FormDataContext.Provider;

  /**
   * A hook to obtain information from the parent <Form />, such as...
   * - Form Data
   * - Form `onChange` and `onSubmit` handlers
   * - Whether the form is disabled or not
   *
   * @author Leondro Lio <leondro.lio@iuk.ukri.org>
   */
  const useFormDataContext = () => {
    const context = useContext(FormDataContext);
    if (context === undefined) {
      throw new Error("Form components must be used within <FormComponent />");
    }
    return context;
  };

  /**
   * A hook to create an "onChange" handler, by obtaining the parent form "onChange" method with React Context.
   *
   * @author Leondro Lio <leondro.lio@iuk.ukri.org>
   */
  const useHandleChange = <TValue,>(update?: (data: T, value: TValue | null) => void) => {
    const { formData, onChange } = useFormDataContext();

    return (value: TValue | null) => {
      if (update) {
        update(formData, value);
      }

      if (onChange) {
        onChange(formData);
      }
    };
  };

  /**
   * A hook to create an "onSubmit" handler, by obtaining the parent form "onSubmit" method with React Context.
   *
   * @author Leondro Lio <leondro.lio@iuk.ukri.org>
   */
  const useHandleSubmit = () => {
    const { onSubmit } = useFormDataContext();

    return (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onSubmit) {
        e.preventDefault();
        onSubmit();
      }
    };
  };

  /**
   * A controlled form component.
   * Controlled forms pass form data to children automatically via React Context.
   */
  const FormComponent = ({
    action = "",
    enctype,
    isGet,
    qa,
    children,
    onChange,
    onSubmit,
    disabled,
    ...props
  }: FormProps) => {
    const isFormDisabled =
      disabled ||
      ("editor" in props
        ? props.editor.status === EditorStatus.Saving // If we're in an editor form, check for edit status
        : props.isSaving ?? false); /// If we're in a data form, check for "isSaving" prop

    const formData = "editor" in props ? props.editor.data : props.data;

    const methodValue = isGet ? "get" : "post";

    return (
      <form
        encType={enctype === "multipart" ? "multipart/form-data" : "application/x-www-form-urlencoded"}
        method={methodValue}
        action={action}
        data-qa={qa}
        onSubmit={e => {
          if (!onSubmit) return;
          e.preventDefault();
          onSubmit();
        }}
      >
        <SecurityTokenInput />

        <FormDataContextProvider
          value={{
            formData,
            onChange,
            onSubmit,
            disabled: isFormDisabled,
          }}
        >
          {children}
        </FormDataContextProvider>
      </form>
    );
  };

  /**
   * A fieldset component, for grouping a collection of form fields together.
   */
  const FieldsetComponent = ({ children, isSubQuestion, qa, heading, headingQa, className }: FieldsetProps) => {
    const Header = isSubQuestion ? "h3" : "h2";

    // TODO: Check for accessibility - can header be omitted
    const headerContent = heading ? typeof heading === "string" ? heading : <Content value={heading} /> : undefined;

    return (
      <fieldset className={cx("govuk-fieldset", className)} data-qa={qa}>
        <legend
          className={cx({
            "govuk-fieldset__legend": true,
            "govuk-fieldset__legend--s": isSubQuestion,
            "govuk-fieldset__legend--m": !isSubQuestion,
          })}
        >
          {headerContent && (
            <Header className="govuk-fieldset__heading" data-qa={headingQa}>
              {headerContent}
            </Header>
          )}
        </legend>

        {children}
      </fieldset>
    );
  };

  /**
   * A component that helps wrap our non-form-controlled input components.
   */
  const FieldComponent = ({
    hint,
    name,
    label,
    labelHidden,
    labelBold,
    field,
    validation,
  }: InternalFieldProps & FieldComponentProps) => {
    // Obtain information about the form we are within
    const { disabled, formData, onChange, onSubmit } = useFormDataContext();

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
          <HintElement id={createFieldHintId(name)} className="govuk-hint">
            {hintValue}
          </HintElement>
        )}

        {validation && <ValidationError error={validation} />}

        {field({ formData, disabled, hasError, onChange, onSubmit })}
      </div>
    );
  };

  /**
   * A `string` type textbox
   *
   * @returns A single-line form controlled string input component
   */
  const StringField = (props: StringFieldProps) => {
    const handleChange = useHandleChange(props.update);
    return (
      <FieldComponent
        {...props}
        field={({ formData, disabled }) => (
          <TextInput
            width={props.width}
            name={props.name}
            id={props.id}
            value={props.value(formData, disabled)}
            onChange={handleChange}
            placeholder={props.placeholder}
            disabled={disabled}
          />
        )}
      />
    );
  };

  /**
   * A `string` type textbox, geared towards acting as a search box
   *
   * @returns A single-line form controlled string input component, styled as a search box.
   */
  const SearchField = (props: SearchFieldProps) => {
    const handleChange = useHandleChange(props.update);
    return (
      <FieldComponent
        {...props}
        field={({ formData, disabled }) => (
          <SearchInput {...props} disabled={disabled} value={props.value(formData, disabled)} onChange={handleChange} />
        )}
      />
    );
  };

  /**
   * A `string` type textarea
   *
   * @returns A multi-line form controlled string textarea component
   */
  const MultiStringField = (props: MultiStringFieldProps) => {
    const handleChange = useHandleChange(props.update);
    return (
      <FieldComponent
        {...props}
        field={({ formData, disabled }) => (
          <TextAreaInput
            name={props.name}
            value={props.value(formData, disabled)}
            onChange={handleChange}
            rows={props.rows}
            qa={props.qa}
            ariaDescribedBy={props.hint ? createFieldHintId(props.name) : undefined}
            disabled={disabled}
            characterCountOptions={props.characterCountOptions}
          />
        )}
      />
    );
  };

  /**
   * A `number` type textbox
   *
   * @returns A single-line form controlled number input component
   */
  const NumericField = (props: NumericFieldProps) => {
    const handleChange = useHandleChange(props.update);
    return (
      <FieldComponent
        {...props}
        field={({ formData, disabled }) => (
          <NumberInput
            name={props.name}
            value={props.value(formData, disabled)}
            onChange={handleChange}
            width={props.width}
            disabled={disabled}
          />
        )}
      />
    );
  };

  /**
   * Radio Buttons
   *
   * @returns A set of form controlled radio buttons
   */
  const RadioOptionsField = (props: RadioFieldProps) => {
    const handleChange = useHandleChange(props.update);
    return (
      <FieldComponent
        {...props}
        field={({ formData, disabled }) => (
          <RadioList
            options={props.options}
            name={props.name}
            value={props.value(formData, disabled)}
            inline={props.inline}
            onChange={handleChange}
            disabled={disabled}
          />
        )}
      />
    );
  };

  /**
   * Checkboxes
   *
   * @returns A set of form controlled checkboxes
   */
  const CheckboxOptionsField = (props: CheckboxFieldProps) => {
    const handleChange = useHandleChange(props.update);
    return (
      <FieldComponent
        {...props}
        field={({ formData, disabled }) => (
          <CheckboxList
            options={props.options}
            name={props.name}
            value={props.value(formData, disabled)}
            onChange={handleChange}
            disabled={disabled}
          />
        )}
      />
    );
  };

  /**
   * Dropdown
   *
   * @returns A form controlled dropdown
   */
  const DropdownListField = (props: DropdownFieldProps) => {
    const handleChange = useHandleChange(props.update);
    return (
      <FieldComponent
        {...props}
        field={({ formData, disabled }) => (
          <DropdownList
            placeholder={props.placeholder}
            options={props.options}
            name={props.name}
            hasEmptyOption={props.hasEmptyOption}
            value={props.value(formData, disabled)}
            onChange={handleChange}
            disabled={disabled}
          />
        )}
      />
    );
  };

  /**
   * Inject a hidden value into the form.
   *
   * @returns An invisible form controlled input field
   */
  const HiddenField = (props: HiddenFieldProps) => {
    const { formData } = useFormDataContext();
    return <input type="hidden" name={props.name} value={props.value(formData) || ""} />;
  };

  /**
   * Form submission button
   *
   * @returns A "submit" button
   */
  const SubmitComponent = ({ name, ...props }: SubmitProps) => {
    const handleSubmit = useHandleSubmit();
    const { disabled } = useFormDataContext();
    const content = props.type ? buttonContentConfig[props.type] : props.children;
    const nameValue = `button_${name || "default"}`;

    return (
      <Button
        type="submit"
        name={nameValue}
        className={props.className}
        disabled={disabled || props.disabled}
        style={props.style}
        styling={props.styling || "Primary"}
        onClick={handleSubmit}
      >
        {content}
      </Button>
    );
  };

  /**
   * Form "Save and Continue" button
   *
   * @returns A "submit and continue" button
   */
  const SubmitAndContinueComponent = (props: SubmitPropsBase) => {
    return <SubmitComponent {...props} type="SAVE_AND_CONTINUE" />;
  };

  /**
   * Form button.
   * For a submit/save and continue button, check out <Submit /> or <SubmitAndContinue /> components.
   *
   * @returns A button
   */
  const ButtonComponent = (props: ButtonProps) => {
    const { disabled } = useFormDataContext();
    return (
      <Button
        type="submit"
        name={`button_${props.name}`}
        className={cx(props.className, { ["govuk-button--disabled"]: disabled || props.disabled })}
        disabled={disabled || props.disabled}
        style={props.style}
        styling={props.styling || "Secondary"}
        value={props.value}
        onClick={e => {
          if (props.onClick) {
            e.preventDefault();
            props.onClick();
          }
        }}
        qa={props.qa}
      >
        {props.children}
      </Button>
    );
  };

  /**
   * A multi-file upload input.
   *
   * @returns A form-controlled multi-file upload area
   */
  const MultipleFileUploadComponent = (props: ExternalFieldProps<IFileWrapper[]>) => {
    const handleChange = useHandleChange(props.update);
    return (
      <FieldComponent
        {...props}
        field={({ formData, disabled, hasError }) => (
          <MultipleFileUpload
            value={props.value(formData, disabled)}
            name={props.name}
            onChange={handleChange}
            disabled={disabled}
            error={hasError}
          />
        )}
      />
    );
  };

  /**
   * A full date (dd/mm/yyyy) component.
   *
   * @returns A full date (dd/mm/yyyy) controlled form component
   */
  const FullDateComponent = (props: ExternalFieldProps<Date>) => {
    const handleChange = useHandleChange(props.update);
    return (
      <FieldComponent
        {...props}
        field={({ formData, disabled, hasError }) => (
          <FullDateInput
            name={props.name}
            disabled={disabled}
            value={props.value(formData, disabled)}
            onChange={handleChange}
            ariaDescribedBy={props.hint ? createFieldHintId(props.name) : undefined}
            hasError={hasError}
          />
        )}
      />
    );
  };

  /**
   * A partial date (mm/yyyy) component.
   *
   * @returns A partial date (mm/yyyy) controlled form component
   */
  const MonthYearComponent = (props: MonthYearProps<Date>) => {
    const handleChange = useHandleChange(props.update);
    return (
      <FieldComponent
        {...props}
        field={({ formData, disabled, hasError }) => (
          <MonthYearInput
            name={props.name}
            disabled={disabled}
            value={props.value(formData, disabled)}
            onChange={handleChange}
            ariaDescribedBy={props.hint ? createFieldHintId(props.name) : undefined}
            hasError={hasError}
            startOrEnd={props.startOrEnd}
            hideLabel={props.hideLabel}
            debounce={false}
          />
        )}
      />
    );
  };

  /**
   * A provider of parent form data and disabled state.
   *
   * @returns A React component that provides form data and disabled state.
   */
  const CustomComponent = ({ value, ...params }: CustomFieldProps) => {
    return <FieldComponent {...params} field={value} />;
  };

  return {
    Form: FormComponent,
    Fieldset: FieldsetComponent,
    String: StringField,
    Search: SearchField,
    MultilineString: MultiStringField,
    Numeric: NumericField,
    Radio: RadioOptionsField,
    DropdownList: DropdownListField,
    Checkboxes: CheckboxOptionsField,
    Hidden: HiddenField,
    Submit: SubmitComponent,
    SubmitAndContinue: SubmitAndContinueComponent,
    Button: ButtonComponent,
    MultipleFileUpload: MultipleFileUploadComponent,
    Date: FullDateComponent,
    MonthYear: MonthYearComponent,
    Custom: CustomComponent,
  };
};
