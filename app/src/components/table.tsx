// tslint:disable:max-classes-per-file

import React from "react";
import { FullDate } from "./renderers/date";
import { Email } from "./layout/email";

interface TableChildProps<T, ReturnT> {
  header: React.ReactNode;
  value: (data: T) => ReturnT;
  data?: T;
}

type TableChild<T> = React.ReactElement<TableChildProps<T, {}>>;

interface TableProps<T> {
  children: TableChild<T> | TableChild<T>[];
  className?: string;
  qa?: string;
}

export const renderNode = (node: React.ReactNode, key: number) => (
  <td className="govuk-table__cell" scope="row" key={key}>{node}</td>
);

export const renderRow = (row: React.ReactNode[], key: number) => (
  <tr className="govuk-table__row" key={key}>{row.map(renderNode)}</tr>
);

export const renderTableHeading = (heading: React.ReactNode, key: number) => (
  <th className="govuk-table__header" scope="col" key={key}>{heading}</th>
);

export const TableComponent = <T extends {}>(data: T[]) => (props: TableProps<T>) => {
  const iter = Array.isArray(props.children) ? props.children : [props.children];
  const tableBody: React.ReactNode[][] = [];
  const tableHeaders: React.ReactNode[] = iter.map(x => x.props.header);

  data.forEach(x => {
    const rows: React.ReactNode[] = iter.map(i => React.cloneElement(i, { data: x }));
    tableBody.push(rows);
  });

  return (
    <div className={props.className} data-qa={props.qa}>
      <table className="govuk-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            {tableHeaders.map(renderTableHeading)}
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {tableBody.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
};

export const renderColumn = <T extends {}>(render: (x: T) => React.ReactNode, data?: T) =>
  typeof data === "undefined" || data === null ? null : <React.Fragment>{render(data)}</React.Fragment>;

export const CustomColumn = <T extends {}>(): React.SFC<TableChildProps<T, React.ReactNode>> =>
  (props) => renderColumn(props.value, props.data);

export const StringColumn = <T extends {}>(): React.SFC<TableChildProps<T, string>> =>
  (props) => renderColumn(props.value, props.data);

export const NumberColumn = <T extends {}>(): React.SFC<TableChildProps<T, number>> =>
  (props) => renderColumn(props.value, props.data);

const DateColumn = <T extends {}>(): React.SFC<TableChildProps<T, Date>> =>
  (props) => <FullDate value={props.value(props.data!)}/>;

const EmailColumn = <T extends {}>(): React.SFC<TableChildProps<T, string>> =>
  (props) => <Email value={props.value(props.data!)}/>;

export const Table = {
  forData: <T extends {}>(data: T[]) => ({
    Table: TableComponent(data),
    Custom: CustomColumn<T>(),
    String: StringColumn<T>(),
    Number: NumberColumn<T>(),
    Date: DateColumn<T>(),
    Email: EmailColumn<T>(),
  })
};
