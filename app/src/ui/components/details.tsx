import * as React from "react";
import classNames from "classnames";
import * as Renderers from "./renderers";
import { range } from "../../shared/range";
import { Currency } from "./renderers/currency";

interface DetailsProps {
    layout?: "Single" | "Double";
    displayDensity?: "Compact" | "Default";
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
    value: (item: T) => TValue;
}

const DetailsComponent = <T extends {}>(data: T): React.SFC<DetailsProps> => ({ displayDensity = "Default", ...props }) => {
    const noCols = props.layout === "Double" ? 2 : 1;
    const cols: React.ReactNode[][] = range(noCols).map(x => []);

    // distribute children accross array adding props
    React.Children.toArray(props.children).forEach((field, index) => {
        const newProps = {
            data,
            labelClass: "govuk-grid-column-one-quarter",
            valueClass: noCols === 2 ? "govuk-grid-column-one-quarter" : "govuk-grid-column-three-quarters",
        };
        cols[index % noCols].push(React.cloneElement(field as React.ReactElement<any>, newProps));
    });

    const rowClasses = classNames({
        "govuk-grid-row": true,
        "govuk-!-margin-bottom-2": displayDensity === "Compact",
        "govuk-!-margin-bottom-7": displayDensity === "Default"
    });

    return (
        <React.Fragment>
            {
                cols[0].map((x, i) =>
                    <div className={rowClasses} key={`details-row-${i}`}>{x}{cols[1] && cols[1][i]}</div>
                )
            }
        </React.Fragment>
    );
};

class FieldComponent<T> extends React.Component<InternalFieldProps<T>, {}> {
    render() {
        return (
            <React.Fragment>
                <div className={this.props.labelClass}>
                    <h4 style={{ marginBottom: "unset" }} className="govuk-heading-s">{this.props.label}</h4>
                </div>
                <div className={this.props.valueClass}>
                    {this.props.render(this.props.data!)}
                </div>
            </React.Fragment>
        );
    }
}

const CustomField = <T extends {}>(): React.SFC<ExternalFieldProps<T, React.ReactNode>> => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    return (props) => <TypedField {...props} render={(item) => props.value(item)} />;
};

const StringField = <T extends {}>(): React.SFC<ExternalFieldProps<T, string>> => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    return (props) => <TypedField {...props} render={(item) => <p style={{ marginBottom: "unset" }} className="govuk-body">{props.value(item)}</p>} />;
};

const MultilineStringField = <T extends {}>(): React.SFC<ExternalFieldProps<T, string>> => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    const splitString = (v: string) => {
        return (v || "").split("\n").filter(x => !!x);
    };
    return (props) => <TypedField {...props} render={(item) => splitString(props.value(item)).map((line, index) => <p style={{ marginBottom: "unset" }} className="govuk-body" key={`multiline-string-${index}`}>{line}</p>)} />;
};

const DateField = <T extends {}>(): React.SFC<ExternalFieldProps<T, Date>> => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    return (props) => <TypedField {...props} render={(item) => <p style={{ marginBottom: "unset" }} className="govuk-body"><Renderers.FullDate value={props.value(item)} /></p>} />;
};

const DateTimeField = <T extends {}>(): React.SFC<ExternalFieldProps<T, Date>> => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    return (props) => <TypedField {...props} render={(item) => <p style={{ marginBottom: "unset" }} className="govuk-body"><Renderers.FullDateTime value={props.value(item)} /></p>} />;
};

const NumberField = <T extends {}>(): React.SFC<ExternalFieldProps<T, number>> => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    return (props) => <TypedField {...props} render={(item) =>  <p style={{ marginBottom: "unset" }} className="govuk-body">{props.value(item)}</p>} />;
};

const CurrencyField = <T extends {}>(): React.SFC<ExternalFieldProps<T, number>> => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> };
    return (props) => <TypedField {...props} render={(item) =>  <p style={{ marginBottom: "unset" }} className="govuk-body"><Currency value={props.value(item)}/></p>} />;
};

export const Details = {
    forData: <T extends {}>(data: T) => ({
        Details: DetailsComponent(data),
        String: StringField<T>(),
        MulilineString: MultilineStringField<T>(),
        Date: DateField<T>(),
        DateTime: DateTimeField<T>(),
        Number: NumberField<T>(),
        Currency: CurrencyField<T>(),
        Custom: CustomField<T>(),
        Empty: ()=>null,
    })
};
