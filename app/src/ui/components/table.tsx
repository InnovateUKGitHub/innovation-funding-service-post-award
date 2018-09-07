// tslint:disable:max-classes-per-file
import React from "react";
import { FullDate, ShortDate } from "./renderers/date";
import { Email } from "./renderers/email";
import { Currency } from "./renderers/currency";
import classNames from "classnames";

type columnMode = "cell" | "header" | "footer" | "col";
interface InternalColumnProps<T> {
  header: React.ReactNode;
  dataItem?: T;
  footer?: React.ReactNode;
  classSuffix?: "numeric";
  renderCell: (data: T, index: { column: number, row: number }) => React.ReactNode;
  mode?: columnMode;
  rowIndex?: number;
  columnIndex?: number;
  qa: string;
}

interface ExternalColumnProps<T, TResult> {
  header: React.ReactNode;
  value: (item: T, index: { column: number, row: number }) => TResult;
  footer?: React.ReactNode;
  qa: string;
}

type TableChild<T> = React.ReactElement<ExternalColumnProps<T, {}>>;

interface TableProps<T> {
  children: TableChild<T> | TableChild<T>[];
  className?: string;
  qa?: string;
}

export class TableColumn<T> extends React.Component<InternalColumnProps<T>> {
  render() {
    switch (this.props.mode) {
      case "cell":
        return this.renderCell(this.props.dataItem!, this.props.columnIndex!, this.props.rowIndex!);
      case "header":
        return this.renderHeader(this.props.columnIndex!);
      case "footer":
        return this.renderFooter(this.props.columnIndex!);
      case "col":
        return this.renderCol(this.props.columnIndex!);
    }
    return null;
  }

  renderHeader(column: number) {
    const className = classNames("govuk-table__header", this.props.classSuffix ? "govuk-table__header--" + this.props.classSuffix : "");
    return <th className={className} scope="col" key={column}>{this.props.header}</th>;
  }

  renderFooter(column: number) {
    const className = classNames("govuk-table__header", this.props.classSuffix ? "govuk-table__header--" + this.props.classSuffix : "");
    return <td className={className} key={column}>{this.props.footer}</td>;
  }

  renderCell(data: T, column: number, row: number) {
    const className = classNames("govuk-table__cell", this.props.classSuffix ? "govuk-table__cell--" + this.props.classSuffix : "");
    return <td className={className} key={column}>{this.props.renderCell(data, { column, row })}</td>;
  }

  renderCol(column: number) {
    return <col key={column} data-qa={`col-${this.props.qa || column.toString()}`} />;
  }
}

const TableComponent = <T extends {}>(data: T[]) => (props: TableProps<T>) => {
  // loop through the colums cloning them and assigning the props required
  const headers = React.Children.map(props.children, (column, columnIndex) => React.cloneElement(column as React.ReactElement<any>, { mode: "header", columnIndex }));
  const cols = React.Children.map(props.children, (column, columnIndex) => React.cloneElement(column as React.ReactElement<any>, { mode: "col", columnIndex }));
  const contents = data.map((dataItem, rowIndex) => React.Children.map(props.children, (column, columnIndex) => React.cloneElement(column as React.ReactElement<any>, { mode: "cell", rowIndex, columnIndex, dataItem })));
  const footers = React.Children.toArray(props.children).some((x: any) => x.props && x.props.footer) ? React.Children.map(props.children, (column, columnIndex) => React.cloneElement(column as React.ReactElement<any>, { mode: "footer", columnIndex })) : [];

  return (
    <div className={props.className} data-qa={props.qa}>
      <table className="govuk-table">
        <colgroup>
          {cols}
        </colgroup>
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            {headers}
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {
            contents.map((row, rowIndex) => <tr className="govuk-table__row" key={rowIndex}>{row}</tr>)
          }
        </tbody>
        {footers.length ? <tfoot>{footers}</tfoot> : null}
      </table>
    </div>
  );
};

const CustomColumn = <T extends {}>(): React.SFC<ExternalColumnProps<T, React.ReactNode>> => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return (props) => <TypedColumn renderCell={(data, index) => props.value(data, index)} {...props} />;
};

const StringColumn = <T extends {}>(): React.SFC<ExternalColumnProps<T, string>> => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return (props) => <TypedColumn renderCell={(data, index) => props.value(data, index)} {...props} />;
};

const NumberColumn = <T extends {}>(): React.SFC<ExternalColumnProps<T, number>> => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return (props) => <TypedColumn classSuffix="numeric" renderCell={(data, index) => props.value(data, index)} {...props} />;
};

const FullDateColumn = <T extends {}>(): React.SFC<ExternalColumnProps<T, Date>> => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return (props) => <TypedColumn renderCell={(data, index) => <FullDate value={props.value(data, index)} />} {...props} />;
};

const ShortDateColumn = <T extends {}>(): React.SFC<ExternalColumnProps<T, Date>> => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return (props) => <TypedColumn renderCell={(data, index) => <ShortDate value={props.value(data, index)} />} {...props} />;
};

const EmailColumn = <T extends {}>(): React.SFC<ExternalColumnProps<T, string>> => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return (props) => <TypedColumn renderCell={(data, index) => <Email value={props.value(data, index)} />} {...props} />;
};

const CurrencyColumn = <T extends {}>(): React.SFC<ExternalColumnProps<T, number>> => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return (props) => <TypedColumn classSuffix="numeric" renderCell={(data, index) => <Currency value={props.value(data, index)} />} {...props} />;
};

export const Table = {
  forData: <T extends {}>(data: T[]) => ({
    Table: TableComponent(data),
    Custom: CustomColumn<T>(),
    String: StringColumn<T>(),
    Number: NumberColumn<T>(),
    Currency: CurrencyColumn<T>(),
    FullDate: FullDateColumn<T>(),
    ShortDate: ShortDateColumn<T>(),
    Email: EmailColumn<T>(),
  })
};
