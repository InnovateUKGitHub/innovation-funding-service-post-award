import React from "react";
import { SimpleString } from "./renderers/simpleString";
import { ShortDateTime } from "./renderers/date";

export interface LogItem {
  newStatus: string;
  newStatusLabel?: string;
  createdDate: Date;
  comments?: string | null;
}

export interface Props {
  qa: string;
  data: LogItem[];
}

export class Logs extends React.Component<Props> {
  render() {
    if(!this.props.data || !this.props.data.length) {
      return <SimpleString>There are no changes.</SimpleString>;
    }

    return (
      <div data-qa={this.props.qa} style={{ overflowX: "auto" }}>
        <table className={"govuk-table"}>
          <colgroup>
            <col key="0" data-qa="col-created-date" />
            <col key="1" data-qa="col-status-update" />
            <col key="2" data-qa="col-created-by" />
          </colgroup>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th className="govuk-table__header" scope="col" key="0">Date and time</th>
              <th className="govuk-table__header" scope="col" key="1">Status update</th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {this.props.data.map((row, rowIndex) => this.renderLogRow(row, rowIndex))}
          </tbody>
        </table>
      </div>
    );
  }

  private renderLogRow(item: LogItem, index: number) {
    return (
      <React.Fragment key={index}>
        <tr className="govuk-table__row" key={`${index}_a`}>
          <td className="govuk-table__cell" key="0"><ShortDateTime value={item.createdDate} /></td>
          {/* TODO use label exclusively */}
          <td className="govuk-table__cell" key="1">{item.newStatusLabel || item.newStatus}</td>
        </tr>
        {this.renderCommentsRow(item, index)}
      </React.Fragment>
    );
  }

  private renderCommentsRow(item: LogItem, index: number) {
    if (!item.comments) {
      return null;
    }

    return (
      <tr className={"govuk-table__row"} key={`${index}_b`}>
        <td className="govuk-table__cell govuk-!-padding-top-1" key="0" colSpan={3}>
          <div className="govuk-inset-text govuk-!-margin-top-0" style={{ whiteSpace: "pre-wrap" }}>{item.comments}</div>
        </td>
      </tr>
    );
  }
}
