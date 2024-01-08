import classNames, { Argument } from "classnames";
import { HTMLProps } from "react";

interface CommonTableProps {
  className?: Argument;
  "data-qa"?: string;
}

interface TableRowProps extends CommonTableProps {
  hasError?: boolean;
  hasWarning?: boolean;
  editableRow?: boolean;
}

interface TableCellProps extends CommonTableProps {
  numeric?: boolean;
  bold?: boolean;
  small?: boolean;
  centered?: boolean;
}

const TD = ({
  className,
  numeric,
  bold,
  small,
  centered,
  ...props
}: HTMLProps<HTMLTableCellElement> & TableCellProps) => (
  <td
    {...props}
    className={classNames(
      "govuk-table__cell",
      {
        "govuk-table__cell--numeric": numeric,
        "govuk-!-font-weight-bold": bold,
        "govuk-body-s": small,
        "govuk-!-text-align-centre": centered,
      },
      className,
    )}
  />
);
const TH = ({ className, numeric, bold, small, ...props }: HTMLProps<HTMLTableCellElement> & TableCellProps) => (
  <th
    {...props}
    className={classNames(
      "govuk-table__header",
      { "govuk-table__header--numeric": numeric, "govuk-!-font-weight-bold": bold, "govuk-body-s": small },
      className,
    )}
  />
);
const TR = ({
  className,
  hasError,
  hasWarning,
  editableRow,
  ...props
}: HTMLProps<HTMLTableRowElement> & TableRowProps) => (
  <tr
    {...props}
    className={classNames(
      "govuk-table__row",
      { "table__row--error": hasError, "table__row--warning": hasWarning, "govuk-table__row--editable": editableRow },
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
  <div className="govuk-table-wrapper">
    <table {...props} className={classNames("govuk-table", className)} />
  </div>
);

export { Table, TBody, TCaption, TFoot, THead, TH, TD, TR };
