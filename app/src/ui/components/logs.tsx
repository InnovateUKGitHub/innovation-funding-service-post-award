import React from "react";
import * as ACC from "@ui/components";

export interface LogItem {
  newStatus: string;
  createdDate: Date;
  createdBy: string;
  comments: string | null | undefined;
}

export interface Props {
  qa: string;
  data: LogItem[];
}

export class Logs extends React.Component<Props> {
  render() {
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
              <th className="govuk-table__header" scope="col" key="2">Name</th>
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
          <td className="govuk-table__cell" key="0"><ACC.Renderers.ShortDateTime value={item.createdDate} /></td>
          <td className="govuk-table__cell" key="1">{item.newStatus}</td>
          <td className="govuk-table__cell" key="2">{item.createdBy}</td>
        </tr>
        {this.renderComments(item, index)}
      </React.Fragment>
    );
  }

  private renderComments(item: LogItem, index: number) {
    if (!item.comments) {
      return null;
    }

    return (
      <tr className={"govuk-table__row"} key={`${index}_b`}>
        <td className="govuk-table__cell" key="0" colSpan={3}>
          <h5>Comment</h5>
          <span style={{ whiteSpace: "pre-wrap" }}>{item.comments}</span>
        </td>
      </tr>
    );
  }
}
