// tslint:disable:max-classes-per-file
import React from "react";
import { FullDate, ShortDate } from "./renderers/date";
import { Email } from "./renderers/email";
import { Currency } from "./renderers/currency";
import classNames from "classnames";
import { Percentage } from "./renderers/percentage";
import { Link } from ".";
import { Result } from "../validation/result";
import { NestedResult } from "../validation/nestedResult";
import { Results } from "../validation/results";

type columnMode = "cell" | "header" | "footer" | "col";
interface InternalColumnProps<T> {
  header: React.ReactNode;
  dataItem?: T;
  footer?: React.ReactNode;
  classSuffix?: "numeric";
  cellClassName?: (data: T, index: { column: number, row: number }) => string | null | undefined;
  renderCell: (data: T, index: { column: number, row: number }) => React.ReactNode;
  mode?: columnMode;
  rowIndex?: number;
  columnIndex?: number;
  qa: string;
  width?: number;
  validation?: Results<{}>;
}

interface ExternalColumnProps<T, TResult> {
  header: React.ReactNode;
  value: (item: T, index: { column: number, row: number }) => TResult;
  cellClassName?: (data: T, index: { column: number, row: number }) => string | null | undefined;
  footer?: React.ReactNode;
  qa: string;
  width?: number;
}

type TableChild<T> = React.ReactElement<ExternalColumnProps<T, {}>>;

interface TableProps<T> {
  children: TableChild<T> | (TableChild<T> | TableChild<T>[])[];
  className?: string;
  qa: string;
  footers?: JSX.Element[];
  headers?: JSX.Element[];
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
    // if its the first column check for error
    const rowHasError = this.props.validation && this.props.validation.showValidationErrors && !this.props.validation.isValid();
    const className = classNames("govuk-table__cell", this.props.classSuffix ? "govuk-table__cell--" + this.props.classSuffix : "", this.props.cellClassName && this.props.cellClassName(data, { column, row }));
    const style: React.CSSProperties = {};
    if(column === 0 && rowHasError) {
      style.borderLeft = "10px #b10e1e solid";
      style.paddingLeft = "10px";
    }
    if(rowHasError) {
      style.verticalAlign = "bottom";
    }
    return <td className={className} style={style} key={column}>{this.props.renderCell(data, { column, row })}</td>;
  }

  renderCol(column: number) {
    const style: React.CSSProperties = {};
    if (this.props.width) {
      style.width = this.props.width + "%";
    }

    return <col key={column} data-qa={`col-${this.props.qa || column.toString()}`} style={style} />;
  }
}

const TableComponent2 = <T extends {}>(props: TableProps<T> & { data: T[]; validationResult?: NestedResult<Results<{}>>; }) => {
  // loop through the colums cloning them and assigning the props required
  const customHeaders = props.headers && props.headers.length ? props.headers : null;
  const headers = React.Children.map(props.children, (column, columnIndex) => React.cloneElement(column as React.ReactElement<any>, { mode: "header", columnIndex }));
  const cols = React.Children.map(props.children, (column, columnIndex) => React.cloneElement(column as React.ReactElement<any>, { mode: "col", columnIndex }));
  const contents = props.data.map((dataItem, rowIndex) => React.Children.map(props.children, (column, columnIndex) => React.cloneElement(column as React.ReactElement<any>, { mode: "cell", rowIndex, columnIndex, dataItem, validation: props.validationResult && props.validationResult.results && props.validationResult.results[rowIndex]  })));
  const footerColumns = React.Children.toArray(props.children).some((x: any) => x.props && x.props.footer) ? React.Children.map(props.children, (column, columnIndex) => React.cloneElement(column as React.ReactElement<any>, { mode: "footer", columnIndex })) : [];
  const footers = footerColumns.length ? [<tr key="standardFooter" className="govuk-table__row">{footerColumns}</tr>] : [];
  (props.footers || []).forEach(customFooter => footers.push(customFooter));

  return (
    <div className={props.className} data-qa={props.qa}>
      <table className="govuk-table">
        <colgroup>
          {cols}
        </colgroup>
        <thead className="govuk-table__head">
          {customHeaders}
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

const TableComponent = <T extends {}>(data: T[]) => (props: TableProps<T>) => {
  return <TableComponent2 {...props} data={data} />;
};

const CustomColumn = <T extends {}>(props: ExternalColumnProps<T, React.ReactNode> & { classSuffix?: "numeric" }) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn renderCell={(data, index) => props.value(data, index)} {...props} />;
};

const StringColumn = <T extends {}>(props: ExternalColumnProps<T, string | null>) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn renderCell={(data, index) => props.value(data, index)} {...props} />;
};

const NumberColumn = <T extends {}>(props: ExternalColumnProps<T, number | null>) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn classSuffix="numeric" renderCell={(data, index) => props.value(data, index)} {...props} />;
};

const FullDateColumn = <T extends {}>(props: ExternalColumnProps<T, Date | null>) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn renderCell={(data, index) => <FullDate value={props.value(data, index)} />} {...props} />;
};

const ShortDateColumn = <T extends {}>(props: ExternalColumnProps<T, Date | null>) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn renderCell={(data, index) => <ShortDate value={props.value(data, index)} />} {...props} />;
};

const EmailColumn = <T extends {}>(props: ExternalColumnProps<T, string | null>) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn renderCell={(data, index) => <Email value={props.value(data, index)} />} {...props} />;
};

const CurrencyColumn = <T extends {}>(props: ExternalColumnProps<T, number | null>) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn classSuffix="numeric" renderCell={(data, index) => <Currency value={props.value(data, index)} />} {...props} />;
};

const PercentageColumn = <T extends {}>(props: ExternalColumnProps<T, number | null>) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn classSuffix="numeric" renderCell={(data, index) => <Percentage value={props.value(data, index)} />} {...props} />;
};

interface LinkColumnProps<T> extends ExternalColumnProps<T, ILinkInfo> {
  content: React.ReactNode;
}

const LinkColumn = <T extends {}>(props: LinkColumnProps<T>) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn classSuffix="numeric" renderCell={(data, index) => <Link route={props.value(data, index)} >{props.content}</Link>} {...props} />;
};

export const Table = {
  forData: <T extends {}>(data: T[]) => ({
    Table: TableComponent(data),
    Custom: CustomColumn as React.SFC<ExternalColumnProps<T, React.ReactNode>>,
    String: StringColumn as React.SFC<ExternalColumnProps<T, string | null>>,
    Number: NumberColumn as React.SFC<ExternalColumnProps<T, number | null>>,
    Currency: CurrencyColumn as React.SFC<ExternalColumnProps<T, number | null>>,
    Percentage: PercentageColumn as React.SFC<ExternalColumnProps<T, number | null>>,
    FullDate: FullDateColumn as React.SFC<ExternalColumnProps<T, Date | null>>,
    ShortDate: ShortDateColumn as React.SFC<ExternalColumnProps<T, Date | null>>,
    Email: EmailColumn as React.SFC<ExternalColumnProps<T, string | null>>,
    Link: LinkColumn as React.SFC<LinkColumnProps<T>>
  })
};

export const TypedTable = <T extends {}>() => ({
  Table: TableComponent2 as React.SFC<TableProps<T> & { data: T[]; validationResult?: NestedResult<Results<{}>>; }>,
  Custom: CustomColumn as React.SFC<ExternalColumnProps<T, React.ReactNode> & { classSuffix?: "numeric" }>,
  String: StringColumn as React.SFC<ExternalColumnProps<T, string | null>>,
  Number: NumberColumn as React.SFC<ExternalColumnProps<T, number | null>>,
  Currency: CurrencyColumn as React.SFC<ExternalColumnProps<T, number | null>>,
  Percentage: PercentageColumn as React.SFC<ExternalColumnProps<T, number | null>>,
  FullDate: FullDateColumn as React.SFC<ExternalColumnProps<T, Date | null>>,
  ShortDate: ShortDateColumn as React.SFC<ExternalColumnProps<T, Date | null>>,
  Email: EmailColumn as React.SFC<ExternalColumnProps<T, string | null>>,
  Link: LinkColumn as React.SFC<LinkColumnProps<T>>
});
