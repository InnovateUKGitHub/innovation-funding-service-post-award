import React, { cloneElement } from "react";
import cx from "classnames";
import { Currency } from "./renderers/currency";
import { FullDate, FullDateTime } from "./renderers/date";
import { Percentage } from "./renderers/percentage";
import { SimpleString } from "./renderers/simpleString";
import { H3, H4 } from "./typography/Heading.variants";

interface InternalFieldProps<T> {
  label: React.ReactNode;
  children: (item: T) => React.ReactElement | React.ReactElement[] | null;
  labelClass?: string;
  valueClass?: string;
  data?: T;
}

interface ExternalFieldProps<T, TValue> {
  label: React.ReactNode;
  qa: string;
  value: (item: T) => TValue | null;
}

interface ExternalHeadingProps {
  label: React.ReactNode;
  qa: string;
}

interface DetailsComponentProps<T> {
  data: T;
  qa?: string;
  children?: React.ReactElement | React.ReactElement[];
  displayDensity?: "Compact" | "Comfortable";
  labelWidth?: "Wide" | "Narrow";
  title?: React.ReactNode;
  labelClassName?: string;
  valueClassName?: string;
}

/**
 * Details Component
 */
function DetailsComponent<T extends AnyObject>({
  displayDensity = "Comfortable",
  qa,
  labelWidth,
  labelClassName,
  valueClassName,
  data,
  children,
}: DetailsComponentProps<T>) {
  const childElements = React.Children.toArray(children);
  const detailItems = childElements.map(field =>
    React.cloneElement(field as React.ReactElement, {
      data,
      labelClass: cx(labelClassName, {
        "govuk-grid-column-one-quarter": labelWidth === "Narrow",
        "govuk-grid-column-three-quarters": labelWidth === "Wide",
        "govuk-grid-column-one-half": !labelWidth,
      }),
      valueClass: cx(valueClassName, {
        "govuk-grid-column-one-quarter": labelWidth === "Wide",
        "govuk-grid-column-three-quarters": labelWidth === "Narrow",
        "govuk-grid-column-one-half": !labelWidth,
      }),
    }),
  );

  return (
    <>
      {detailItems.map((detail, i) => {
        const qaValue = qa ? `${qa}-${detail.props.qa}` : detail.props.qa;

        return (
          <div
            key={i}
            data-qa={qaValue}
            className={cx("govuk-grid-row", {
              "govuk-!-margin-top-4": displayDensity === "Comfortable",
            })}
          >
            {detail}
          </div>
        );
      })}
    </>
  );
}

// Note: This was added as ternary's or shortcuts will return falsy values
type OptionalChild<T> = null | false | T;

type DualDetailsChild = React.ReactElement<{ title?: string }>;

export interface DualDetailsProps {
  children: OptionalChild<DualDetailsChild> | OptionalChild<DualDetailsChild>[];
}

/**
 * DualDetails component
 */
export function DualDetails({ children }: DualDetailsProps) {
  const elementChildren = React.Children.toArray(children) as DualDetailsChild[];
  const clonedChildren = elementChildren.map(field => cloneElement(field));

  // Note: TSC is not smart enough to infer title is always defined due to .every former check, hence therefore I have to use the non-null "!"
  const titles: string[] = clonedChildren.every(x => x.props.title)
    ? clonedChildren.map(x => x.props.title as string)
    : [];

  return (
    <>
      {titles.length > 0 && (
        <div className="govuk-grid-row">
          {titles.map((columnTitle, i) => (
            <div key={i} className="govuk-grid-column-one-half">
              <H3 as="h2" className="govuk-!-margin-bottom-6">
                {columnTitle}
              </H3>
            </div>
          ))}
        </div>
      )}

      <div className="govuk-grid-row">
        {clonedChildren.map((column, i) => (
          <div key={i} className="govuk-grid-column-one-half">
            {column}
          </div>
        ))}
      </div>
    </>
  );
}

export class FieldComponent<T> extends React.Component<InternalFieldProps<T>> {
  render() {
    const { labelClass, label, valueClass, children, data } = this.props;

    const value = children(data as T);

    return (
      <>
        <div className={labelClass}>
          <H4 as="p">{label}</H4>
        </div>

        <div className={valueClass}>{value}</div>
      </>
    );
  }
}

/**
 * Field with custom props
 */
function CustomField<T extends AnyObject>(props: ExternalFieldProps<T, React.ReactElement>) {
  const TypedField = FieldComponent as new () => FieldComponent<T>;

  return <TypedField {...props}>{item => (item ? props.value(item) : null)}</TypedField>;
}

/**
 * StringOrNumberField
 */
function StringOrNumberField<T extends AnyObject, Value extends string | number>(props: ExternalFieldProps<T, Value>) {
  const TypedField = FieldComponent as new () => FieldComponent<T>;

  return <TypedField {...props}>{item => <SimpleString>{props.value(item)}</SimpleString>}</TypedField>;
}

/**
 * MultilineStringField AKA TextArea
 */
function MultilineStringField<T extends AnyObject>(props: ExternalFieldProps<T, string>) {
  const TypedField = FieldComponent as new () => FieldComponent<T>;
  const splitString = (v: string | null) => (v || "").split("\n").filter(x => !!x);

  return (
    <TypedField {...props}>
      {item => splitString(props.value(item)).map((line, index) => <SimpleString key={index}>{line}</SimpleString>)}
    </TypedField>
  );
}

/**
 * Date Input field
 */
function DateField<T extends AnyObject>(props: ExternalFieldProps<T, Date>) {
  const TypedField = FieldComponent as new () => FieldComponent<T>;

  return (
    <TypedField {...props}>
      {item => (
        <SimpleString>
          <FullDate value={props.value(item)} />
        </SimpleString>
      )}
    </TypedField>
  );
}

/**
 * DateTime field
 */
function DateTimeField<T extends AnyObject>(props: ExternalFieldProps<T, Date>) {
  const TypedField = FieldComponent as new () => FieldComponent<T>;

  return (
    <TypedField {...props}>
      {item => (
        <SimpleString>
          <FullDateTime value={props.value(item)} />
        </SimpleString>
      )}
    </TypedField>
  );
}

type CurrencyFieldProps<T> = ExternalFieldProps<T, number> & { fractionDigits?: number };

/**
 * Currency field
 */
function CurrencyField<T extends AnyObject>(props: CurrencyFieldProps<T>) {
  const TypedField = FieldComponent as new () => FieldComponent<T>;

  return (
    <TypedField {...props}>
      {item => (
        <SimpleString>
          <Currency fractionDigits={props.fractionDigits} value={props.value(item)} />
        </SimpleString>
      )}
    </TypedField>
  );
}

type PercentageFieldProps<T> = ExternalFieldProps<T, number> & { fractionDigits?: number };

/**
 * Percentage format field
 */
function PercentageField<T extends AnyObject>(props: PercentageFieldProps<T>) {
  const TypedField = FieldComponent as new () => FieldComponent<T>;

  return (
    <TypedField {...props}>
      {item => (
        <SimpleString>
          <Percentage fractionDigits={props.fractionDigits} value={props.value(item)} />
        </SimpleString>
      )}
    </TypedField>
  );
}

/**
 * Heading field, set as H4
 */
function HeadingField({ label, qa }: ExternalHeadingProps) {
  return (
    <div className={"govuk-grid-column-full"} data-qa={qa}>
      <H4>{label}</H4>
    </div>
  );
}

export const TypedDetails = <T extends AnyObject>() => ({
  Details: DetailsComponent as React.FunctionComponent<DetailsComponentProps<T>>,
  String: StringOrNumberField as React.FunctionComponent<ExternalFieldProps<T, string>>,
  Number: StringOrNumberField as React.FunctionComponent<ExternalFieldProps<T, number>>,
  MultilineString: MultilineStringField as React.FunctionComponent<ExternalFieldProps<T, string>>,
  Date: DateField as React.FunctionComponent<ExternalFieldProps<T, Date>>,
  DateTime: DateTimeField as React.FunctionComponent<ExternalFieldProps<T, Date>>,
  Currency: CurrencyField as React.FunctionComponent<CurrencyFieldProps<T>>,
  Percentage: PercentageField as React.FunctionComponent<PercentageFieldProps<T>>,
  Custom: CustomField as React.FunctionComponent<ExternalFieldProps<T, React.ReactNode>>,
  Heading: HeadingField as React.FunctionComponent<ExternalHeadingProps>,
});
