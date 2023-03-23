import React, { createContext, isValidElement, useContext, useMemo, ReactElement, Fragment } from "react";
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
  BaseDateProps,
} from "@ui/components/renderers";
import * as colour from "@ui/styles/colours";
import type { ContentSelector } from "@copy/type";
import { useContent } from "@ui/hooks";

import { useTableSorter } from "./documents/table-sorter";
import { DateConvertible } from "@framework/util";

const rowClassesStates: Record<"warning" | "error" | "info" | "edit", string> = {
  warning: "table__row--warning",
  error: "table__row--error",
  info: "table__row--info",
  edit: "table__row--info",
};

const standardRowCssClass = "govuk-table__row";

interface SortButtonProps {
  children: React.ReactNode;
  isSortable: boolean;
}

const SortButton = ({ isSortable, ...props }: SortButtonProps) => {
  if (!isSortable) return <>{props.children}</>;
  return <button {...props} type="button" className="table-sort-button" />;
};

/**
 * Create a collection of typed table child elements, and it's corresponding parent table.
 * All returned input elements, such as <Table.String />, <Table.FullNumericDate />, <Table.Percentage /> etc., **must**
 * be surrounded by the returned <Table.Table /> element.
 *
 * @example
 * interface TestData {
 *   foo: string;
 *   bar: string;
 * }
 *
 * const TestTable = createTypedTable<TestData>();
 *
 * // Display information about Nicole Hedge's favourite food.
 * const NicoleHedgesTableDeluxe = () => {
 *   return (
 *     <TestTable.Table data={[
 *       { foo: "hello", bar: "world!" },
 *     ]}>
 *       <TestTable.String
 *          header="Foo"
 *          value={x => x.foo}
 *       />
 *       <TestTable.String
 *          header="Bar"
 *          value={x => x.bar}
 *       />
 *     </TestTable.Table>
 *   );
 * };
 */
export const createTypedTable = <T,>() => {
  type DividerTypes = "normal" | "bold";
  type ColumnMode = "cell" | "header" | "footer" | "col";

  interface ITableDataContext {
    mode?: ColumnMode;
    columnIndex?: number;
    rowIndex?: number;
    dataItem?: T;
    header?: string | number | ContentSelector | ReactElement;
    "aria-sort"?: "none" | "ascending" | "descending";
    onSortClick?: () => void;
  }

  interface InternalColumnProps {
    footer?: React.ReactNode;
    classSuffix?: "numeric";
    cellClassName?: (data: T, index: { column: number; row: number }) => string | null | undefined;
    colClassName?: (col: number) => string;
    renderCell: (data: T, index: { column: number; row: number }) => React.ReactNode;
    qa: string;
    width?: number;
    isDivider?: DividerTypes;
    paddingRight?: string;
    hideHeader?: boolean;
  }

  interface ExternalColumnProps<TResult> {
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

  type TableChild = React.ReactElement<ExternalColumnProps<ResultBase>> | null;

  interface TableProps {
    children: TableChild | (TableChild | TableChild[])[];
    className?: string;
    qa: string;
    footers?: React.ReactElement[];
    headers?: React.ReactElement[];
    data: T[];
    validationResult?: (Results<ResultBase> | null | undefined)[] | Results<ResultBase> | Result | null | undefined;
    caption?: React.ReactNode;
    bodyRowClass?: (row: T, index: number) => string;
    bodyRowFlag?: (row: T, index: number) => "warning" | "info" | "error" | "edit" | null;
    headerRowClass?: string;
    footerRowClass?: string;
  }

  // Create a context for all child components to consume table data
  const TableDataContext = createContext<ITableDataContext | undefined>(undefined);
  const TableDataContextProvider = TableDataContext.Provider;

  /**
   * A hook to obtain information from the parent <Table />, such as...
   */
  const useTableDataContext = () => {
    const context = useContext(TableDataContext);
    if (context === undefined) {
      throw new Error("Table components must be used within the table returned by useTypedTable!");
    }
    return context;
  };

  /**
   * Creates a table column
   */
  function TableColumn({ paddingRight, classSuffix, ...props }: InternalColumnProps) {
    const { getContent } = useContent();
    const {
      header,
      columnIndex,
      ["aria-sort"]: ariaSort,
      mode,
      onSortClick,
      dataItem,
      rowIndex,
    } = useTableDataContext();
    if (!mode) return null;

    const renderHeader = (column: number): JSX.Element => {
      let headerValue: string | React.ReactElement<unknown>;

      if (typeof header === "string" || isValidElement(header)) {
        headerValue = header;
      } else if (typeof header === "number" || typeof header === "boolean") {
        headerValue = `${header}`;
      } else if (header) {
        headerValue = getContent(header);
      } else {
        headerValue = "";
      }

      const noHeaderValue: boolean = typeof headerValue === "string" ? !headerValue.length : false;

      const displayForScreenReaders = props.hideHeader || noHeaderValue;

      return (
        <th
          key={column}
          onClick={onSortClick}
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
          "acc-table__cell-right-border": props.isDivider,
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
          className={cx(
            "govuk-table__cell",
            props.cellClassName?.(data, { column, row }),
            props.colClassName?.(column),
            {
              ["govuk-table__cell--" + classSuffix]: !!classSuffix,
              "acc-table__cell-right-border": props.isDivider,
            },
          )}
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
      cell: () => renderCell(dataItem as T, columnIndex ?? 0, rowIndex ?? 0),
    };

    return tableColumnOptions[mode]();
  }

  /**
   * Gets the keys for sorting the data items.
   */
  function getSortKeys(items: TableChild[]): (keyof T | null)[] {
    // Note: We check all data items are an object as we need keys to sort from
    const isSortableHeader: boolean = items.every(_isPlainObject);

    if (!isSortableHeader) {
      return Array(items.length).fill(null);
    }

    return items.map(x => (x?.props.sortByKey ? String(x.props.sortByKey) : null)) as (keyof T | null)[];
  }

  const TableComponent = ({
    children: unflattenedChildren,
    validationResult,
    data,
    footers,
    qa,
    className,
    caption,
    ...props
  }: TableProps) => {
    const { getContent } = useContent();

    const validationResults = Array.isArray(validationResult) ? validationResult : [validationResult];

    const children = useMemo(
      () => React.Children.toArray(unflattenedChildren).filter(Boolean) as TableChild[],
      [unflattenedChildren],
    );

    const { handleSort, getColumnOption, sortedRows } = useTableSorter(getSortKeys(children), data);

    const headers = children.map((column, columnIndex) => (
      <Fragment key={columnIndex}>
        {isValidElement<InternalColumnProps>(column) && (
          <TableDataContextProvider
            value={{
              mode: "header",
              columnIndex,
              header:
                typeof column?.props.header === "undefined" ||
                typeof column?.props.header === "string" ||
                isValidElement(column?.props.header)
                  ? column?.props.header
                  : getContent(column?.props.header || ""),
              "aria-sort": getColumnOption?.(columnIndex),
              onSortClick: () => handleSort(columnIndex),
            }}
          >
            {column}
          </TableDataContextProvider>
        )}
      </Fragment>
    ));

    const cols = children.map((column, columnIndex) => (
      <TableDataContextProvider key={columnIndex} value={{ mode: "col", columnIndex }}>
        {column}
      </TableDataContextProvider>
    ));

    const contents = sortedRows.map((dataItem, rowIndex) => (
      <Fragment key={rowIndex}>
        {children.map((column, columnIndex) => (
          <TableDataContextProvider
            key={columnIndex}
            value={{
              mode: "cell",
              rowIndex,
              columnIndex,
              dataItem,
            }}
          >
            {column}
          </TableDataContextProvider>
        ))}
      </Fragment>
    ));

    const rowClass = data.map((dataItem, rowIndex) => props.bodyRowClass?.(dataItem, rowIndex) || "");

    const rowFlags = data.map((dataItem, rowIndex) => {
      const validation = validationResults?.[rowIndex];
      const hasError = validation?.showValidationErrors && !validation.isValid;

      if (hasError) return "error";

      return props.bodyRowFlag?.(dataItem, rowIndex) || null;
    });

    const rowIds = data.map((_, rowIndex) => {
      const validation = validationResults?.[rowIndex];

      if (validation?.showValidationErrors) {
        if ("errors" in validation) {
          return validation?.errors?.[0]?.key;
        } else {
          return validation?.key;
        }
      }

      return undefined;
    });

    const rowClasses = rowFlags.map(x => (x ? rowClassesStates[x] : ""));

    const childColumnsHasFooters = children.some(x => x?.props?.footer);

    const footerColumns = childColumnsHasFooters
      ? children.map((column, columnIndex) => (
          <TableDataContextProvider
            key={columnIndex}
            value={{
              mode: "footer",
              columnIndex,
            }}
          >
            {column}
          </TableDataContextProvider>
        ))
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

  const CustomColumn = (props: ExternalColumnProps<React.ReactNode> & { classSuffix?: "numeric" }) => (
    <TableColumn {...props} renderCell={(data, index) => props.value(data, index)} />
  );

  const StringColumn = (props: ExternalColumnProps<string | null>) => (
    <TableColumn {...props} renderCell={(data, index) => props.value(data, index)} />
  );

  const NumberColumn = (props: ExternalColumnProps<number | null>) => (
    <TableColumn {...props} classSuffix="numeric" renderCell={(data, index) => props.value(data, index)} />
  );

  const FullDateColumn = (props: ExternalColumnProps<DateConvertible> & BaseDateProps) => (
    <TableColumn
      {...props}
      renderCell={(data, index) => (
        <FullDate
          value={props.value(data, index)}
          invalidDisplay={props.invalidDisplay}
          nullDisplay={props.nullDisplay}
        />
      )}
    />
  );

  const FullNumericDateColumn = (props: ExternalColumnProps<DateConvertible> & BaseDateProps) => (
    <TableColumn
      {...props}
      renderCell={(data, index) => (
        <FullNumericDate
          value={props.value(data, index)}
          invalidDisplay={props.invalidDisplay}
          nullDisplay={props.nullDisplay}
        />
      )}
    />
  );

  const ShortDateColumn = (props: ExternalColumnProps<DateConvertible> & BaseDateProps) => (
    <TableColumn
      {...props}
      renderCell={(data, index) => (
        <ShortDate
          value={props.value(data, index)}
          invalidDisplay={props.invalidDisplay}
          nullDisplay={props.nullDisplay}
        />
      )}
    />
  );

  const ShortDateTimeColumn = (props: ExternalColumnProps<DateConvertible> & BaseDateProps) => (
    <TableColumn
      {...props}
      renderCell={(data, index) => (
        <ShortDateTime
          value={props.value(data, index)}
          invalidDisplay={props.invalidDisplay}
          nullDisplay={props.nullDisplay}
        />
      )}
    />
  );

  const EmailColumn = (props: ExternalColumnProps<string | null>) => (
    <TableColumn {...props} renderCell={(data, index) => <Email>{props.value(data, index) ?? ""}</Email>} />
  );

  const CurrencyColumn = (props: ExternalColumnProps<number | null> & { fractionDigits?: number }) => (
    <TableColumn
      {...props}
      classSuffix="numeric"
      renderCell={(data, index) => <Currency value={props.value(data, index)} fractionDigits={props.fractionDigits} />}
    />
  );

  const PercentageColumn = (props: ExternalColumnProps<number | null> & { fractionDigits?: number }) => (
    <TableColumn
      {...props}
      classSuffix="numeric"
      renderCell={(data, index) => (
        <Percentage value={props.value(data, index)} fractionDigits={props.fractionDigits} />
      )}
    />
  );

  const LinkColumn = (props: ExternalColumnProps<ILinkInfo> & { content: React.ReactNode }) => (
    <TableColumn
      {...props}
      renderCell={(data, index) => <Link route={props.value(data, index)}>{props.content}</Link>}
    />
  );

  return {
    Table: TableComponent,
    Currency: CurrencyColumn,
    Custom: CustomColumn,
    Email: EmailColumn,
    FullDate: FullDateColumn,
    FullNumericDate: FullNumericDateColumn,
    Link: LinkColumn,
    Number: NumberColumn,
    Percentage: PercentageColumn,
    ShortDate: ShortDateColumn,
    ShortDateTime: ShortDateTimeColumn,
    String: StringColumn,
  };
};
