// tslint:disable:max-classes-per-file

import React from "react";

interface TableChildProps<T, ReturnT> {
  header: React.ReactNode;
  value: (data: T) => ReturnT;
  data?: T;
}

type TableChild<T> = React.ReactElement<TableChildProps<T, {}>>;

interface TableProps<T> {
  children: TableChild<T> | Array<TableChild<T>>;
  className?: string;
  qa?: string;
}

export const renderNode = (node: React.ReactNode, key: number = 1) => (
  <td className="govuk-table__cell" scope="row" key={key}>{node}</td>
);

export const renderRow = (row: React.ReactNode[]) => (
  <tr className="govuk-table__row">{row.map(renderNode)}</tr>
);

export const renderTableHeading = (heading: React.ReactNode) => (
  <th className="govuk-table__header" scope="col">{heading}</th>
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

export const DateColumn = <T extends {}>(): React.SFC<TableChildProps<T, Date>> =>
  (props) => typeof props.data === "undefined" ? null : <span>{props.value(props.data).toISOString()}</span>;

export const Table = {
  forData: <T extends {}>(data: T[]) => ({
    Table: TableComponent(data),
    Custom: CustomColumn<T>(),
    String: StringColumn<T>(),
    Number: NumberColumn<T>(),
    Date: DateColumn<T>()
  })
}
