import classNames, { Argument } from "classnames";
import { HTMLProps } from "react";

interface CommonTableProps {
  className?: Argument;
  qa?: string;
}

interface TableRowProps extends CommonTableProps {
  hasError?: boolean;
  hasWarning?: boolean;
}

const TableData = ({ qa, className, ...props }: HTMLProps<HTMLTableCellElement> & CommonTableProps) => (
  <td {...props} data-qa={qa} className={classNames("govuk-table__cell", className)} />
);
const TableHeader = ({ qa, className, ...props }: HTMLProps<HTMLTableCellElement> & CommonTableProps) => (
  <th {...props} data-qa={qa} className={classNames("govuk-table__header", className)} />
);
const TableRow = ({
  qa,
  className,
  hasError,
  hasWarning,
  ...props
}: HTMLProps<HTMLTableRowElement> & TableRowProps) => (
  <tr
    {...props}
    data-qa={qa}
    className={classNames(
      "govuk-table__row",
      { "table__row--error": hasError, "table__row--warning": hasWarning },
      className,
    )}
  />
);
const TableHead = ({ qa, className, ...props }: HTMLProps<HTMLTableSectionElement> & CommonTableProps) => (
  <thead {...props} data-qa={qa} className={classNames("govuk-table__head", className)} />
);
const TableBody = ({ qa, className, ...props }: HTMLProps<HTMLTableSectionElement> & CommonTableProps) => (
  <tbody {...props} data-qa={qa} className={classNames("govuk-table__body", className)} />
);
const TableFoot = ({ qa, className, ...props }: HTMLProps<HTMLTableSectionElement> & CommonTableProps) => (
  <tfoot {...props} data-qa={qa} className={classNames("govuk-table__foot", className)} />
);
const TableCaption = ({ qa, className, ...props }: HTMLProps<HTMLTableCaptionElement> & CommonTableProps) => (
  <caption {...props} data-qa={qa} className={classNames("govuk-caption govuk-table__caption--m", className)} />
);
const Table = ({ qa, className, ...props }: HTMLProps<HTMLTableElement> & CommonTableProps) => (
  <table {...props} data-qa={qa} className={classNames("govuk-table", className)} />
);

export { Table, TableBody, TableCaption, TableFoot, TableHead, TableHeader, TableData, TableRow };
