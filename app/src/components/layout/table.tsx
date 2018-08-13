import React from "react";

interface Props {
    tableHeadings: string[];
    tableBody: string[][];
}

export const Table: React.SFC<Props> = (props: Props) => {
    const renderRow = (entries: string[]) => {
        return (
            <tr className="govuk-table__row">
                {entries.map(entry => (
                    <td className="govuk-table__cell" scope="row">{entry}</td>
                ))}
            </tr>
        );
    };

    const renderTableHeadings = (heading: string) => (
            <th className="govuk-table__header" scope="col">{heading}</th>
    );

    return (
        <table className="govuk-table">
            <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                    {props.tableHeadings.map(renderTableHeadings)}
                </tr>
            </thead>
            <tbody className="govuk-table__body">
                {props.tableBody.map(renderRow)}
            </tbody>
        </table>
    );
};
