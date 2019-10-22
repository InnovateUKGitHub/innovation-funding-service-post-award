// tslint:disable
import * as React from "react";
import classnames from "classnames";
import { Currency } from "./renderers/currency";
import { FullDate, FullDateTime } from "./renderers/date";
import { Percentage } from "./renderers/percentage";

interface DetailsProps {
    displayDensity?: "Compact" | "Comfortable";
    labelWidth?: "Wide" | "Narrow";
    qa?: string;
    title?: string;
}

interface InternalFieldProps<T> {
    label: React.ReactNode;
    render: (item: T) => React.ReactNode;
    labelClass?: string;
    valueClass?: string;
    data?: T;
}

interface ExternalFieldProps<T, TValue> {
    label: React.ReactNode;
    qa: string;
    value: (item: T) => TValue | null;
}

interface ExternalHeadingProps<T> {
    label: React.ReactNode;
    qa: string;
}

const DetailsComponent = <T extends {}>(props: DetailsProps & { data: T } & { children?: React.ReactNode }) => {
    // distribute children accross array adding props
    const { displayDensity = "Comfortable", qa, labelWidth, data, children } = props;

    const rows = React.Children.toArray(children).map((field) => {
        const newProps = {
            data,
            labelClass: classnames({
                "govuk-grid-column-one-quarter": labelWidth === "Narrow",
                "govuk-grid-column-three-quarters": labelWidth === "Wide",
                "govuk-grid-column-one-half": !labelWidth,
            }),
            valueClass: classnames({
                "govuk-grid-column-one-quarter": labelWidth === "Wide",
                "govuk-grid-column-three-quarters": labelWidth === "Narrow",
                "govuk-grid-column-one-half": !labelWidth,
            })
        };
        return React.cloneElement(field as React.ReactElement<any>, newProps);
    });

    const rowClasses = classnames({
        "govuk-grid-row": true,
        "govuk-!-margin-top-4": displayDensity === "Comfortable"
    });
    return (
        <React.Fragment>
            {
                rows.map((x, i) => <div data-qa={`${qa}-${x.props.qa}`} className={rowClasses} key={`details-row-${i}`}>{x}</div>)
            }
        </React.Fragment>
    );
};

export const DualDetails: React.SFC<DetailsProps> = ({ children, ...rest }) => {
    const columns = React.Children.toArray(children).map((field) => {
        return React.cloneElement(field as React.ReactElement<any>, rest);
    });

    const titles = !columns.every(x => !x.props.title) && columns.map(x => x.props.title);

    const header = titles ? (
        <div className="govuk-grid-row">
            {titles.map((x, i) => (
                <div key={`dual-details-title-${i}`} className="govuk-grid-column-one-half">
                    <h2 className="govuk-heading-m govuk-!-margin-bottom-6">{x}</h2>
                </div>
            ))}
        </div>
    ) : null;

    return (
        <React.Fragment>
            {header}
            <div className="govuk-grid-row">
                {columns.map((column, i) => (
                    <div key={`dual-details-row-${i}`} className="govuk-grid-column-one-half">{column}</div>))}
            </div>
        </React.Fragment>
    );
};

export class FieldComponent<T> extends React.Component<InternalFieldProps<T>, {}> {
    render() {
        return (
            <React.Fragment>
                <div className={this.props.labelClass}>
                    <p className="govuk-heading-s">{this.props.label}</p>
                </div>
                <div className={this.props.valueClass}>
                    {this.props.render(this.props.data!)}
                </div>
            </React.Fragment>
        );
    }
}

const CustomField = <T extends {}>(props: ExternalFieldProps<T, React.ReactNode>) => {
    const TypedField = FieldComponent as  new() => FieldComponent<T> ;
    return <TypedField {...props} render={(item) => props.value(item)} />;
};

const StringField = <T extends {}>(props: ExternalFieldProps<T, string>) => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    return <TypedField {...props} render={(item) => <p className="govuk-body">{props.value(item)}</p>} />;
};

const MultilineStringField = <T extends {}>(props: ExternalFieldProps<T, string>) => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    const splitString = (v: string | null) => (v || "").split("\n").filter(x => !!x);
    return <TypedField {...props} render={(item) => splitString(props.value(item)).map((line, index) => <p className="govuk-body" key={index}>{line}</p>)} />;
};

const DateField = <T extends {}>(props: ExternalFieldProps<T, Date>) => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    return <TypedField {...props} render={(item) => <p className="govuk-body"><FullDate value={props.value(item)} /></p>} />;
};

const DateTimeField = <T extends {}>(props: ExternalFieldProps<T, Date>) => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    return <TypedField {...props} render={(item) => <p className="govuk-body"><FullDateTime value={props.value(item)} /></p>} />;
};

const NumberField = <T extends {}>(props: ExternalFieldProps<T, number>) => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    return <TypedField {...props} render={(item) => <p className="govuk-body">{props.value(item)}</p>} />;
};

const CurrencyField = <T extends {}>(props: ExternalFieldProps<T, number> & { fractionDigits?: number }) => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    return <TypedField {...props} render={(item) => <p className="govuk-body"><Currency fractionDigits={props.fractionDigits} value={props.value(item)} /></p>} />;
};

const PercentageField = <T extends {}>(props: ExternalFieldProps<T, number> & { fractionDigits?: number }) => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    return <TypedField {...props} render={(item) => <p className="govuk-body"><Percentage fractionDigits={props.fractionDigits} value={props.value(item)} /></p>} />;
};

const HeadingField = (props: ExternalHeadingProps<React.ReactNode>) => {
    return (
        <div className={"govuk-grid-column-full"} data-qa={props.qa}><h4 className="govuk-heading-s">{props.label}</h4></div>
    );
};

export const TypedDetails = <T extends {}>() => ({
    Details: DetailsComponent as React.SFC<DetailsProps & { data: T }>,
    String: StringField as React.SFC<ExternalFieldProps<T, string>>,
    MultilineString: MultilineStringField as React.SFC<ExternalFieldProps<T, string>>,
    Date: DateField as React.SFC<ExternalFieldProps<T, Date>>,
    DateTime: DateTimeField as React.SFC<ExternalFieldProps<T, Date>>,
    Number: NumberField as React.SFC<ExternalFieldProps<T, number>>,
    Currency: CurrencyField as React.SFC<ExternalFieldProps<T, number> & { fractionDigits?: number }>,
    Percentage: PercentageField as React.SFC<ExternalFieldProps<T, number> & { fractionDigits?: number }>,
    Custom: CustomField as React.SFC<ExternalFieldProps<T, React.ReactNode>>,
    Heading: HeadingField as React.SFC<ExternalHeadingProps<React.ReactNode>>,
});
