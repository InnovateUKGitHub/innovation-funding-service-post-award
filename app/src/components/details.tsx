import * as React from 'react';

interface Props<T> {
    data: T;
}

interface ItemProps<T, TField> {
    label: React.ReactNode;
    value: (item: T) => TField;
    data: T;
}

class Details<T> extends React.Component<Props<T>, {}> {
    render() {
        return this.props.children;
    }
}

abstract class DetailsItem<T, TField> extends React.Component<ItemProps<T, TField>, {}> {
    render() {
        return (
            <div className="govuk-grid-row govuk-!-margin-top-4">
                <div className="govuk-grid-column-one-quarter">
                    <h4 className="govuk-heading-s">{this.props.label}</h4>
                </div>
                <div className="govuk-grid-column-three-quarters">
                    {this.renderContent(this.props.value(this.props.data))}
                </div>
            </div>
        );
    }

    protected abstract renderContent(item: TField): React.ReactNode;

}

class StringItem<T> extends DetailsItem<T, string> {
    protected renderContent(item: string) {
        return <p className="govuk-body">{item}</p>;
    }
}

class MulilineStringItem<T> extends DetailsItem<T, string> {
    protected renderContent(item: string) {
        if(!item) return <p className="govuk-body"></p>;
        return item.split("\n").map(v => <p className="govuk-body">{v}</p>);
    }
}

class DateItem<T> extends DetailsItem<T, Date> {
    protected renderContent(item: Date) {
        return <p className="govuk-body">{item && item.toDateString()}</p>;
    }
}

export default {
    forData: <T extends {}>(data: T) => ({
        Details: Details as { new(): Details<T> },
        String: StringItem as { new(): StringItem<T> },
        MulilineString: MulilineStringItem as { new(): MulilineStringItem<T> },
        Date: DateItem as { new(): DateItem<T> }
    })
}