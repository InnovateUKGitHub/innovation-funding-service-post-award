// tslint:disable:max-classes-per-file

import React from "react";

interface TableChildProps<T, ReturnT> {
  header: React.ReactNode;
  value: (data: T) => ReturnT;
  data?: T;
}

type TableChild<T> = React.ReactElement<TableChildProps<T, any>>;

interface TableProps<T> {
  children: TableChild<T> | Array<TableChild<T>>;
  className?: string;
}

const renderNode = (node: React.ReactNode) => (
  <td className="govuk-table__cell" scope="row">{node}</td>
);

const renderRow = (row: React.ReactNode[]) => (
  <tr className="govuk-table__row">{row.map(renderNode)}</tr>
);

const renderTableHeadings = (heading: React.ReactNode) => (
  <th className="govuk-table__header" scope="col">{heading}</th>
);

const TableComponent = <T extends {}>(data: T[]) => (props: TableProps<T>) => {
  const iter = Array.isArray(props.children) ? props.children : [props.children];
  const tableBody: React.ReactNode[][] = [];
  const tableHeaders: React.ReactNode[] = iter.map(x => x.props.header);

  data.forEach(x => {
    const rows: React.ReactNode[] = iter.map(i => React.cloneElement(i, { data: x }));
    tableBody.push(rows);
  });

  return (
    <div className={props.className}>
      <table className="govuk-table">
        <thead className="govuk-table__head">
          <tr className="govuk-table__row">
            {tableHeaders.map(renderTableHeadings)}
          </tr>
        </thead>
        <tbody className="govuk-table__body">
          {tableBody.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
};

const renderColumn = <T extends {}>(render: (x: T) => React.ReactNode, data?: T) =>
  typeof data === "undefined" ? null : <span>{render(data)}</span>;

const CustomColumn = <T extends {}>(): React.SFC<TableChildProps<T, React.ReactNode>> =>
  (props) => renderColumn(props.value, props.data);

const StringColumn = <T extends {}>(): React.SFC<TableChildProps<T, string>> =>
  (props) => renderColumn(props.value, props.data);

const NumberColumn = <T extends {}>(): React.SFC<TableChildProps<T, number>> =>
  (props) => renderColumn(props.value, props.data);

const DateColumn = <T extends {}>(): React.SFC<TableChildProps<T, Date>> =>
  (props) => typeof props.data === "undefined" ? null : <span>{props.value(props.data).toISOString()}</span>;

export function forData<T>(data: T[]) {
  return {
    Table: TableComponent(data),
    Custom: CustomColumn<T>(),
    String: StringColumn<T>(),
    Number: NumberColumn<T>(),
    Date: DateColumn<T>()
  };
}
