// tslint:disable:max-classes-per-file
import React from "react";
import { FullDate, ShortDate, ShortDateTime } from "./renderers/date";
import { Email } from "./renderers/email";
import { Currency } from "./renderers/currency";
import classNames from "classnames";
import { Percentage } from "./renderers/percentage";
import { Link } from ".";
import * as colour from "../styles/colours";
import { Results } from "../validation/results";
import { ILinkInfo } from "../../types/ILinkInfo";
type dividerTypes = "normal" | "bold";
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
  isDivider?: dividerTypes;
  paddingRight?: string;
}

interface ExternalColumnProps<T, TResult> {
  header: React.ReactNode;
  value: (item: T, index: { column: number, row: number }) => TResult;
  cellClassName?: (data: T, index: { column: number, row: number }) => string | null | undefined;
  footer?: React.ReactNode;
  qa: string;
  width?: number;
  isDivider?: dividerTypes;
  paddingRight?: string;
}

type TableChild<T> = React.ReactElement<ExternalColumnProps<T, {}>> | null;

interface TableProps<T> {
  children: TableChild<T> | (TableChild<T> | TableChild<T>[])[];
  className?: string;
  qa: string;
  footers?: JSX.Element[];
  headers?: JSX.Element[];
  data: T[];
  validationResult?: Results<{}>[];
  bodyRowClass?: (row: T, index: number) => string;
  bodyRowFlag?: (row: T, index: number) => "warning" | "info" | "error" | "edit" | null;
  headerRowClass?: string;
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
    const className = classNames("govuk-table__header", { ["govuk-table__header--" + this.props.classSuffix]: !!this.props.classSuffix });
    return <th className={className} scope="col" key={column}>{this.props.header}</th>;
  }

  renderFooter(column: number) {
    const className = classNames("govuk-table__header", { ["govuk-table__header--" + this.props.classSuffix]: !!this.props.classSuffix });
    return <td className={className} key={column}>{this.props.footer}</td>;
  }

  renderCell(data: T, column: number, row: number) {
    const className = classNames(
      "govuk-table__cell",
      this.props.cellClassName && this.props.cellClassName(data, { column, row }),
      {["govuk-table__cell--" + this.props.classSuffix]: !!this.props.classSuffix}
    );
    return <td style={{paddingRight: this.props.paddingRight}} className={className} key={column}>{this.props.renderCell(data, { column, row })}</td>;
  }

  renderCol(column: number) {
    const style: React.CSSProperties = {};
    if (this.props.width) {
      style.width = this.props.width + "%";
    }

    if(this.props.isDivider) {
      if(this.props.isDivider === "normal") {
        style.borderRight = "1px solid " + colour.GOVUK_BORDER_COLOUR;
      } else {
        style.borderRight = "3px solid " + colour.GOVUK_COLOUR_BLACK;
      }
    }

    return <col key={column} data-qa={`col-${this.props.qa || column.toString()}`} style={style} />;
  }
}

const TableComponent = <T extends {}>(props: TableProps<T> & { data: T[]; validationResult?: Results<{}>[]; }) => {
  // loop through the colums cloning them and assigning the props required
  const children = React.Children.toArray(props.children).filter(x => !!x);
  const customHeaders = props.headers && props.headers.length ? props.headers : null;
  const headers = children.map((column, columnIndex) => React.cloneElement(column as React.ReactElement<any>, { mode: "header", columnIndex }));
  const cols = children.map((column, columnIndex) => React.cloneElement(column as React.ReactElement<any>, { mode: "col", columnIndex }));
  const contents = props.data.map((dataItem, rowIndex) => children.map((column, columnIndex) => React.cloneElement(column as React.ReactElement<any>, { mode: "cell", rowIndex, columnIndex, dataItem, validation: props.validationResult && props.validationResult[rowIndex] })));
  const footerColumns = children.some((x: any) => x.props && x.props.footer)
    ? children.map((column, columnIndex) => React.cloneElement(column as React.ReactElement<any>, { mode: "footer", columnIndex }))
    : [];
  const footers = footerColumns.length ? [<tr key="standardFooter" className="govuk-table__row">{footerColumns}</tr>] : [];
  (props.footers || []).forEach(customFooter => footers.push(customFooter));

  const rowClass = props.data.map((dataItem, rowIndex) => (props.bodyRowClass && props.bodyRowClass(dataItem, rowIndex)) || "");

  const rowFlags = props.data.map((dataItem, rowIndex) => {
    const validation = props.validationResult && props.validationResult[rowIndex];
    if(validation && validation.showValidationErrors && !validation.isValid) {
      return "error";
    }
    if(props.bodyRowFlag) {
      return props.bodyRowFlag(dataItem, rowIndex);
    }
    return null;
  });

  const rowClasses = rowFlags.map(x => {
    switch(x) {
      case "warning": return "table__row--warning";
      case "error":   return "table__row--error";
      case "info":    return "table__row--info";
      case "edit":    return "table__row--info table__row--icon";
      default:        return "";
    }
  });

  return (
    <div data-qa={props.qa} style={{overflowX:"auto"}}>
      <table className={classNames("govuk-table", props.className)}>
        <colgroup>
          {cols}
        </colgroup>
        <thead className="govuk-table__head">
          {customHeaders}
          <tr className={classNames("govuk-table__row", props.headerRowClass)}>
            {headers}
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {
            contents.map((row, rowIndex) => <tr className={classNames("govuk-table__row", rowClass[rowIndex], rowClasses[rowIndex])} key={rowIndex}>{row}</tr>)
          }
        </tbody>
        {footers.length ? <tfoot>{footers}</tfoot> : null}
      </table>
    </div>
  );
};

const CustomColumn = <T extends {}>(props: ExternalColumnProps<T, React.ReactNode> & { classSuffix?: "numeric" }) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn paddingRight={props.paddingRight} renderCell={(data, index) => props.value(data, index)} {...props} />;
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

const ShortDateTimeColumn = <T extends {}>(props: ExternalColumnProps<T, Date | null>) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn renderCell={(data, index) => <ShortDateTime value={props.value(data, index)} />} {...props} />;
};

const EmailColumn = <T extends {}>(props: ExternalColumnProps<T, string | null>) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn renderCell={(data, index) => <Email value={props.value(data, index)} />} {...props} />;
};

const CurrencyColumn = <T extends {}>(props: ExternalColumnProps<T, number | null> & {fractionDigits?: number}) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn classSuffix="numeric" renderCell={(data, index) => <Currency value={props.value(data, index)} fractionDigits={props.fractionDigits} />} {...props} />;
};

const PercentageColumn = <T extends {}>(props: ExternalColumnProps<T, number | null> & {fractionDigits?: number}) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn classSuffix="numeric" renderCell={(data, index) => <Percentage value={props.value(data, index)} fractionDigits={props.fractionDigits} />} {...props} />;
};

interface LinkColumnProps<T> extends ExternalColumnProps<T, ILinkInfo> {
  content: React.ReactNode;
}

const LinkColumn = <T extends {}>(props: LinkColumnProps<T>) => {
  const TypedColumn = TableColumn as { new(): TableColumn<T> };
  return <TypedColumn classSuffix="numeric" renderCell={(data, index) => <Link route={props.value(data, index)} >{props.content}</Link>} {...props} />;
};

export const TypedTable = <T extends {}>() => ({
  Table: TableComponent as React.SFC<TableProps<T>>,
  Custom: CustomColumn as React.SFC<ExternalColumnProps<T, React.ReactNode> & { classSuffix?: "numeric" }>,
  String: StringColumn as React.SFC<ExternalColumnProps<T, string | null>>,
  Number: NumberColumn as React.SFC<ExternalColumnProps<T, number | null>>,
  Currency: CurrencyColumn as React.SFC<ExternalColumnProps<T, number | null> & {fractionDigits?: number}>,
  Percentage: PercentageColumn as React.SFC<ExternalColumnProps<T, number | null> & {fractionDigits?: number}>,
  FullDate: FullDateColumn as React.SFC<ExternalColumnProps<T, Date | null>>,
  ShortDate: ShortDateColumn as React.SFC<ExternalColumnProps<T, Date | null>>,
  ShortDateTime: ShortDateTimeColumn as React.SFC<ExternalColumnProps<T, Date | null>>,
  Email: EmailColumn as React.SFC<ExternalColumnProps<T, string | null>>,
  Link: LinkColumn as React.SFC<LinkColumnProps<T>>
});
