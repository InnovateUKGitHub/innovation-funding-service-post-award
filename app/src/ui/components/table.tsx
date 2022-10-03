import React, { cloneElement, isValidElement, useMemo } from "react";
import cx from "classnames";
import _isPlainObject from "lodash.isplainobject";

import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Result, Results } from "@ui/validation";
import { Link } from "@ui/components/links";
import {
  FullDate,
  FullNumericDate,
  ShortDate,
  ShortDateTime,
  Email,
  Currency,
  Percentage,
  AccessibilityText,
} from "@ui/components/renderers";
import * as colour from "@ui/styles/colours";
import { ContentSelector } from "@content/content";
import { useContent } from "@ui/hooks";

import { TableSortKey, useTableSorter } from "./documents/table-sorter";

export type DividerTypes = "normal" | "bold";
type ColumnMode = "cell" | "header" | "footer" | "col";
interface InternalColumnProps<T> {
  header?: string | ContentSelector | React.ReactElement<unknown>; // Note: Some currency components return values as element not strings
  onSortClick?: () => void;
  "aria-sort"?: "none" | "ascending" | "descending";
  dataItem?: T;
  footer?: React.ReactNode;
  classSuffix?: "numeric";
  cellClassName?: (data: T, index: { column: number; row: number }) => string | null | undefined;
  colClassName?: (col: number) => string;
  renderCell: (data: T, index: { column: number; row: number }) => React.ReactNode;
  mode?: ColumnMode;
  rowIndex?: number;
  columnIndex?: number;
  qa: string;
  width?: number;
  validation?: Results<{}>;
  isDivider?: DividerTypes;
  paddingRight?: string;
  hideHeader?: boolean;
}

interface ExternalColumnProps<T, TResult> {
  header?: string | ContentSelector | React.ReactElement<unknown>; // Note: Some currency components return values as element not strings
  sortByKey?: keyof T;
  value: (item: T, index: { column: number; row: number }) => TResult;
  cellClassName?: (data: T, index: { column: number; row: number }) => string | null | undefined;
  colClassName?: (col: number) => string;
  footer?: React.ReactNode;
  qa: string;
  width?: number;
  isDivider?: DividerTypes;
  paddingRight?: string;
  hideHeader?: boolean;
}

export type TableChild<T> = React.ReactElement<ExternalColumnProps<T, {}>> | null;

interface TableProps<T> {
  children: TableChild<T> | (TableChild<T> | TableChild<T>[])[];
  className?: string;
  qa: string;
  footers?: React.ReactElement[];
  headers?: React.ReactElement[];
  data: T[];
  validationResult?: (Results<{}> | null | undefined)[] | Result;
  caption?: React.ReactNode;
  bodyRowClass?: (row: T, index: number) => string;
  bodyRowFlag?: (row: T, index: number) => "warning" | "info" | "error" | "edit" | null;
  headerRowClass?: string;
  footerRowClass?: string;
}

interface SortButtonProps {
  children: React.ReactNode;
  isSortable: boolean;
}

function SortButton({ isSortable, ...props }: SortButtonProps) {
  if (!isSortable) return <>{props.children}</>;

  return <button {...props} type="button" className="table-sort-button" />;
}

export function TableColumn<T>({
  header,
  columnIndex,
  classSuffix,
  paddingRight,
  "aria-sort": ariaSort,
  ...props
}: InternalColumnProps<T>) {
  const { getContent } = useContent();
  if (!props.mode) return null;

  const renderHeader = (column: number): JSX.Element => {
    const headerValue: string | JSX.Element = isValidElement(header) ? header : getContent(header || "");
    const noHeaderValue: boolean = typeof headerValue === "string" ? !headerValue.length : false;

    const displayForScreenReaders = props.hideHeader || noHeaderValue;

    return (
      <th
        key={column}
        onClick={props.onSortClick}
        aria-sort={ariaSort}
        scope="col"
        className={cx("govuk-table__header", props.colClassName?.(column), {
          [`govuk-table__header--${classSuffix}`]: !!classSuffix,
        })}
      >
        {displayForScreenReaders ? (
          <AccessibilityText>{headerValue}</AccessibilityText>
        ) : (
          <SortButton isSortable={!!ariaSort}>{headerValue}</SortButton>
        )}
      </th>
    );
  };

  const renderFooter = (column: number) => (
    <td
      key={column}
      className={cx("govuk-table__header", {
        [`govuk-table__header--${classSuffix}`]: !!classSuffix,
      })}
    >
      {props.footer}
    </td>
  );

  const renderCell = (data: T, column: number, row: number) => {
    const renderedValue = props.renderCell(data, { column, row });

    return (
      <td
        key={column}
        style={{ paddingRight }}
        className={cx("govuk-table__cell", props.cellClassName?.(data, { column, row }), props.colClassName?.(column), {
          ["govuk-table__cell--" + classSuffix]: !!classSuffix,
        })}
      >
        {renderedValue}
      </td>
    );
  };

  const renderCol = (column: number): JSX.Element => {
    const qaValue = `col-${props.qa || column}`;
    const styles: React.CSSProperties = {};

    if (props.width) {
      styles.width = `${props.width}%`;
    }

    if (props.isDivider) {
      const hasStandardBorder = props.isDivider === "normal";
      const border = hasStandardBorder ? colour.govukBorderColour : colour.govukColourBlack;

      styles.borderRight = `1px solid ${border}`;
    }

    return <col key={column} data-qa={qaValue} style={styles} />;
  };

  const tableColumnOptions: Record<ColumnMode, () => JSX.Element> = {
    header: () => renderHeader(columnIndex ?? 0),
    footer: () => renderFooter(columnIndex ?? 0),
    col: () => renderCol(columnIndex ?? 0),
    cell: () => renderCell(props.dataItem as T, columnIndex ?? 0, props.rowIndex ?? 0),
  };

  return tableColumnOptions[props.mode]();
}

const rowClassesStates: Record<"warning" | "error" | "info" | "edit", string> = {
  warning: "table__row--warning",
  error: "table__row--error",
  info: "table__row--info",
  edit: "table__row--info",
};

const standardRowCssClass = "govuk-table__row";

function getSortKeys<T>(items: TableChild<T>[]): TableSortKey[] {
  // Note: We check all data items are an object as we need keys to sort from
  const isSortableHeader: boolean = items.every(_isPlainObject);

  if (!isSortableHeader) {
    return Array(items.length).fill(null);
  }

  return items.map(x => (x?.props.sortByKey ? String(x.props.sortByKey) : null));
}

const TableComponent = <T extends {}>({
  children: unflattenedChildren,
  validationResult,
  data,
  footers,
  qa,
  className,
  caption,
  ...props
}: TableProps<T> & { validationResult?: Results<{}>[] }) => {
  const { getContent } = useContent();
  const children = useMemo(
    () => React.Children.toArray(unflattenedChildren).filter(Boolean) as TableChild<T>[],
    [unflattenedChildren],
  );

  const { handleSort, getColumnOption, sortedRows } = useTableSorter(getSortKeys(children), data);

  const headers = children.map(
    (column, columnIndex) =>
      isValidElement<InternalColumnProps<T>>(column) &&
      cloneElement(column, {
        mode: "header",
        columnIndex,
        header: isValidElement(column?.props.header) ? column?.props.header : getContent(column?.props.header || ""),
        "aria-sort": getColumnOption?.(columnIndex),
        onSortClick: () => handleSort(columnIndex),
      }),
  );

  const cols = children.map((column, columnIndex) =>
    cloneElement(column as React.ReactElement<any>, { mode: "col", columnIndex }),
  );

  const contents = sortedRows.map((dataItem, rowIndex) =>
    children.map((column, columnIndex) =>
      cloneElement(column as React.ReactElement<any>, {
        mode: "cell",
        rowIndex,
        columnIndex,
        dataItem,
        validation: validationResult?.[rowIndex],
      }),
    ),
  );

  const rowClass = data.map((dataItem, rowIndex) => props.bodyRowClass?.(dataItem, rowIndex) || "");

  const rowFlags = data.map((dataItem, rowIndex) => {
    const validation = validationResult?.[rowIndex];
    const hasError = validation?.showValidationErrors && !validation.isValid;

    if (hasError) return "error";

    return props.bodyRowFlag?.(dataItem, rowIndex) || null;
  });

  const rowIds = data.map((_, rowIndex) => {
    const validation = validationResult?.[rowIndex];

    return validation?.showValidationErrors && !validation.isValid ? validation.errors[0].key : undefined;
  });

  const rowClasses = rowFlags.map(x => (x ? rowClassesStates[x] : ""));

  const childColumnsHasFooters = children.some(x => x?.props?.footer);

  const footerColumns = childColumnsHasFooters
    ? children.map((column, columnIndex) =>
        cloneElement(column as React.ReactElement<any>, { mode: "footer", columnIndex }),
      )
    : [];
  const hasFooterColumns = !!footerColumns.length;
  const displayFooter = hasFooterColumns || !!footers?.length;

  return (
    <div className="govuk-table-wrapper" data-qa={qa}>
      <table className={cx("govuk-table", className)}>
        {caption && <caption className="govuk-visually-hidden">{caption}</caption>}

        <colgroup>{cols}</colgroup>

        <thead className="govuk-table__head">
          {!!props.headers?.length && props.headers}

          <tr className={cx(standardRowCssClass, props.headerRowClass)}>{headers}</tr>
        </thead>

        <tbody className="govuk-table__body">
          {contents.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              id={rowIds[rowIndex]}
              className={cx(standardRowCssClass, rowClass[rowIndex], rowClasses[rowIndex])}
            >
              {row}
            </tr>
          ))}
        </tbody>

        {displayFooter && (
          <tfoot>
            {hasFooterColumns && (
              <tr key="standardFooter" className={cx(standardRowCssClass, props.footerRowClass)}>
                {footerColumns}
              </tr>
            )}

            {footers || null}
          </tfoot>
        )}
      </table>
    </div>
  );
};

function CustomColumn<T extends {}>(props: ExternalColumnProps<T, React.ReactNode> & { classSuffix?: "numeric" }) {
  return <TableColumn<T> {...props} renderCell={(data, index) => props.value(data, index)} />;
}

function StringColumn<T extends {}>(props: ExternalColumnProps<T, string | null>) {
  return <TableColumn<T> {...props} renderCell={(data, index) => props.value(data, index)} />;
}

function NumberColumn<T extends {}>(props: ExternalColumnProps<T, number | null>) {
  return <TableColumn<T> {...props} classSuffix="numeric" renderCell={(data, index) => props.value(data, index)} />;
}

function FullDateColumn<T extends {}>(props: ExternalColumnProps<T, Date | null>) {
  return <TableColumn<T> {...props} renderCell={(data, index) => <FullDate value={props.value(data, index)} />} />;
}

function FullNumericDateColumn<T extends {}>(props: ExternalColumnProps<T, Date | null>) {
  return (
    <TableColumn<T> {...props} renderCell={(data, index) => <FullNumericDate value={props.value(data, index)} />} />
  );
}

function ShortDateColumn<T extends {}>(props: ExternalColumnProps<T, Date | null>) {
  return <TableColumn<T> {...props} renderCell={(data, index) => <ShortDate value={props.value(data, index)} />} />;
}

function ShortDateTimeColumn<T extends {}>(props: ExternalColumnProps<T, Date | null>) {
  return <TableColumn<T> {...props} renderCell={(data, index) => <ShortDateTime value={props.value(data, index)} />} />;
}

function EmailColumn<T extends {}>(props: ExternalColumnProps<T, string>) {
  return <TableColumn<T> {...props} renderCell={(data, index) => <Email>{props.value(data, index)}</Email>} />;
}

function CurrencyColumn<T extends {}>(props: ExternalColumnProps<T, number | null> & { fractionDigits?: number }) {
  return (
    <TableColumn<T>
      {...props}
      classSuffix="numeric"
      renderCell={(data, index) => <Currency value={props.value(data, index)} fractionDigits={props.fractionDigits} />}
    />
  );
}

const PercentageColumn = <T extends {}>(props: ExternalColumnProps<T, number | null> & { fractionDigits?: number }) => {
  return (
    <TableColumn<T>
      {...props}
      classSuffix="numeric"
      renderCell={(data, index) => (
        <Percentage value={props.value(data, index)} fractionDigits={props.fractionDigits} />
      )}
    />
  );
};

const LinkColumn = <T extends {}>(props: ExternalColumnProps<T, ILinkInfo> & { content: React.ReactNode }) => {
  return (
    <TableColumn<T>
      {...props}
      renderCell={(data, index) => <Link route={props.value(data, index)}>{props.content}</Link>}
    />
  );
};

export interface ITypedTable<T extends Record<keyof T, unknown>> {
  Table: React.FunctionComponent<TableProps<T>>;
  Custom: React.FunctionComponent<ExternalColumnProps<T, React.ReactNode> & { classSuffix?: "numeric" }>;
  String: React.FunctionComponent<ExternalColumnProps<T, string | null>>;
  Number: React.FunctionComponent<ExternalColumnProps<T, number | null>>;
  Currency: React.FunctionComponent<ExternalColumnProps<T, number | null> & { fractionDigits?: number }>;
  Percentage: React.FunctionComponent<ExternalColumnProps<T, number | null> & { fractionDigits?: number }>;
  FullDate: React.FunctionComponent<ExternalColumnProps<T, Date | null>>;
  FullNumericDate: React.FunctionComponent<ExternalColumnProps<T, Date | null>>;
  ShortDate: React.FunctionComponent<ExternalColumnProps<T, Date | null>>;
  ShortDateTime: React.FunctionComponent<ExternalColumnProps<T, Date | null>>;
  Email: React.FunctionComponent<ExternalColumnProps<T, string>>;
  Link: React.FunctionComponent<ExternalColumnProps<T, ILinkInfo> & { content: React.ReactNode }>;
}

export const TypedTable = <T extends Partial<Record<keyof T, unknown>>>(): ITypedTable<T> => ({
  Table: TableComponent as React.FunctionComponent<TableProps<T>>,
  Custom: CustomColumn as React.FunctionComponent<
    ExternalColumnProps<T, React.ReactNode> & { classSuffix?: "numeric" }
  >,
  String: StringColumn as React.FunctionComponent<ExternalColumnProps<T, string | null>>,
  Number: NumberColumn as React.FunctionComponent<ExternalColumnProps<T, number | null>>,
  Currency: CurrencyColumn as React.FunctionComponent<
    ExternalColumnProps<T, number | null> & { fractionDigits?: number }
  >,
  Percentage: PercentageColumn as React.FunctionComponent<
    ExternalColumnProps<T, number | null> & { fractionDigits?: number }
  >,
  FullDate: FullDateColumn as React.FunctionComponent<ExternalColumnProps<T, Date | null>>,
  FullNumericDate: FullNumericDateColumn as React.FunctionComponent<ExternalColumnProps<T, Date | null>>,
  ShortDate: ShortDateColumn as React.FunctionComponent<ExternalColumnProps<T, Date | null>>,
  ShortDateTime: ShortDateTimeColumn as React.FunctionComponent<ExternalColumnProps<T, Date | null>>,
  Email: EmailColumn as React.FunctionComponent<ExternalColumnProps<T, string>>,
  Link: LinkColumn as React.FunctionComponent<ExternalColumnProps<T, ILinkInfo> & { content: React.ReactNode }>,
});
