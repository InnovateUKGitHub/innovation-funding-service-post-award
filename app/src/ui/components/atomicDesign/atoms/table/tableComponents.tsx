import classNames, { Argument } from "classnames";
import { HTMLProps } from "react";

interface CommonTableProps {
  className?: Argument;
  "data-qa"?: string;
}

interface TableRowProps extends CommonTableProps {
  hasError?: boolean;
  hasWarning?: boolean;
}

const TD = ({ className, ...props }: HTMLProps<HTMLTableCellElement> & CommonTableProps) => (
  <td {...props} className={classNames("govuk-table__cell", className)} />
);
const TH = ({ className, ...props }: HTMLProps<HTMLTableCellElement> & CommonTableProps) => (
  <th {...props} className={classNames("govuk-table__header", className)} />
);
const TR = ({ className, hasError, hasWarning, ...props }: HTMLProps<HTMLTableRowElement> & TableRowProps) => (
  <tr
    {...props}
    className={classNames(
      "govuk-table__row",
      { "table__row--error": hasError, "table__row--warning": hasWarning },
      className,
    )}
  />
);
const THead = ({ className, ...props }: HTMLProps<HTMLTableSectionElement> & CommonTableProps) => (
  <thead {...props} className={classNames("govuk-table__head", className)} />
);
const TBody = ({ className, ...props }: HTMLProps<HTMLTableSectionElement> & CommonTableProps) => (
  <tbody {...props} className={classNames("govuk-table__body", className)} />
);
const TFoot = ({ className, ...props }: HTMLProps<HTMLTableSectionElement> & CommonTableProps) => (
  <tfoot {...props} className={classNames("govuk-table__foot", className)} />
);
const TCaption = ({ className, ...props }: HTMLProps<HTMLTableCaptionElement> & CommonTableProps) => (
  <caption {...props} className={classNames("govuk-caption govuk-table__caption--m", className)} />
);
const Table = ({ className, ...props }: HTMLProps<HTMLTableElement> & CommonTableProps) => (
  <table {...props} className={classNames("govuk-table", className)} />
);

export { Table, TBody, TCaption, TFoot, THead, TH, TD, TR };
