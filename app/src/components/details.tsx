import * as React from 'react';
import { FullDate } from './renderers/date';

interface DetailsProps {

}

interface Props<T> {
    data: T;
}

interface ItemProps<T, TField> {
    label: React.ReactNode;
    value: (item: T) => TField;
}

const DetailsComponent = <T extends {}>(data: T): React.SFC<DetailsProps> => (props) => {
    return (
        <React.Fragment>
            {
                React.Children.map(props.children, (x,i) =>
                    <div className="govuk-grid-row govuk-!-margin-top-4" key={`details-row-${i}`}>{x}</div>
                )
            }
        </React.Fragment>
    );
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
}

const DetailsString = <T extends {}>(data: T): React.SFC<ItemProps<T, string>> => (props) => {
    return renderField(props.label, props.value(data), (x) => <p className="govuk-body">{x}</p>);
};


const DetailsMultilineString = <T extends {}>(data: T): React.SFC<ItemProps<T, string>> => (props) => {
    return renderField(props.label, props.value(data), (x) => (x || "").split("\n").filter(x => !!x).map((line, i) => <p className="govuk-body" key={`multiline-string-${i}`}>{line}</p>));
};

const DetailsDate = <T extends {}>(data: T): React.SFC<ItemProps<T, Date>> => (props) => {
    return renderField(props.label, props.value(data), (y) => <p className="govuk-body"><FullDate value={y}/> </p>);
};

export const Details = {
    forData: <T extends {}>(data: T) => ({
        Details: DetailsComponent(data),
        String: DetailsString(data),
        MulilineString: DetailsMultilineString(data),
        Date: DetailsDate(data),
    })
}