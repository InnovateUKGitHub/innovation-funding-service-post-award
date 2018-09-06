import * as React from "react";
import * as Renderers from "./renderers";
import { copyFileSync } from "fs";

interface DetailsProps {
    layout?: "Single" | "Double";
}

interface ItemProps<T, TField> {
    label: React.ReactNode;
    value: (item: T) => TField;
}

const DetailsComponent = <T extends {}>(data: T): React.SFC<DetailsProps> => (props) => {
    let noCols = props.layout === "Double" ? 2 : 1;

    let cols: React.ReactNode[][] = props.layout === "Double" ? [[], []] : [[]];

    //distribute children accross array adding props
    React.Children.toArray(props.children).forEach((field, index) => {
        let newProps = {
            data: data,
            labelClass: "govuk-grid-column-one-quarter",
            valueClass: noCols === 2 ? "govuk-grid-column-one-quarter" : "govuk-grid-column-three-quarters",
        }
        let cloned = React.cloneElement(field as React.ReactElement<any>, newProps);
        cols[index % noCols].push(cloned);
    });

    return (
        <React.Fragment>
            {
                cols.map((x, i) =>
                    <div className="govuk-grid-row govuk-!-margin-top-4" key={`details-row-${i}`}>{x}</div>
                )
            }
        </React.Fragment>
    );
};

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

class FieldComponent<T> extends React.Component<InternalFieldProps<T>, {}> {
    render() {
        return (
            <React.Fragment>
                <div className={this.props.labelClass}>
                    <h4 className="govuk-heading-s">{this.props.label}</h4>
                </div>
                <div className={this.props.valueClass}>
                    {this.props.render(this.props.data!)}
                </div>
            </React.Fragment>
        );
    }
}

const renderField = <T extends {}>(label: React.ReactNode, value: T, render: (item: T) => React.ReactNode) => {
    return (
        <React.Fragment>
            <div className="govuk-grid-column-one-quarter">
                <h4 className="govuk-heading-s">{label}</h4>
            </div>
            <div className="govuk-grid-column-three-quarters">
                {render(value)}
            </div>
        </React.Fragment>
    );
};

const CustomField = <T extends {}>(): React.SFC<ExternalFieldProps<T, React.ReactNode>> => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> }
    return (props) =>  <TypedField {...props} render={(item) => props.value(item)}/>;
};

const StringField = <T extends {}>(): React.SFC<ExternalFieldProps<T, string>> => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> }
    return (props) =>  <TypedField {...props} render={(item) => <p className="govuk-body">{props.value(item)}</p>}/>;
};

const MultilineStringField = <T extends {}>(): React.SFC<ExternalFieldProps<T, string>> => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> }
    const splitString = (v: string) => {
        return (v||"").split("\n").filter(x => !!x);
    }
    return (props) =>  <TypedField {...props} render={(item) => splitString(props.value(item)).map((line, index) => <p className="govuk-body" key={`multiline-string-${index}`}>{line}</p>)}/>;
};

const DateField = <T extends {}>(): React.SFC<ExternalFieldProps<T, Date>> => {
    const TypedField = FieldComponent as { new(): FieldComponent<T> }
    return (props) => <TypedField {...props} render={(item) => <p className="govuk-body"><Renderers.FullDate value={props.value(item)} /> </p>}/>;
};

const DateTimeField = <T extends {}>(): React.SFC<ExternalFieldProps<T, Date>> =>  {
    const TypedField = FieldComponent as { new(): FieldComponent<T> }
    return (props) => <TypedField {...props} render={(item) => <p className="govuk-body"><Renderers.FullDateTime value={props.value(item)} /> </p>}/>;
};

export const Details = {
    forData: <T extends {}>(data: T) => ({
        Details: DetailsComponent(data),
        String: StringField<T>(),
        MulilineString: MultilineStringField<T>(),
        Date: DateField<T>(),
        DateTime: DateTimeField<T>(),
        Custom: CustomField<T>(),
    })
};
