import { render } from "@testing-library/react";

import { TypedTable } from "@ui/components/table";

describe("Table", () => {
  it("should render <td> with given number", () => {
    const stubNumber = 12345;

    const NumericTable = TypedTable<number>();
    const { queryByText } = render(
      <NumericTable.Table data={[stubNumber]} qa="">
        <NumericTable.Number header="" value={x => x} qa="val" />
      </NumericTable.Table>,
    );
    expect(queryByText(stubNumber)).toBeInTheDocument();
  });

  it("should render <td> with given string", () => {
    const stubData = "stub-data";
    const StringTable = TypedTable<string>();
    const { queryByText } = render(
      <StringTable.Table data={[stubData]} qa="">
        <StringTable.String header="" value={x => x} qa="val" />
      </StringTable.Table>,
    );
    expect(queryByText(stubData)).toBeInTheDocument();
  });

  it("should render <tr> with number nodes", () => {
    const rows = [1, 2, 3];
    const NumberTable = TypedTable<number>();
    const { queryByText } = render(
      <NumberTable.Table data={rows} qa="">
        <NumberTable.Number header="" value={x => x} qa="val" />
      </NumberTable.Table>,
    );

    rows.forEach(x => {
      expect(queryByText(x)).toBeInTheDocument();
    });
  });

  it("should render th with given content", () => {
    const stubHeader = "stub-header";
    const data = ["Item"];
    const TableComponent = TypedTable<string>();

    const { queryByText } = render(
      <TableComponent.Table data={data} qa="">
        <TableComponent.String header={stubHeader} value={() => "Content"} qa="val" />
      </TableComponent.Table>,
    );
    expect(queryByText(stubHeader)).toBeInTheDocument();
  });

  it("should render hidden header with given content", () => {
    const stubHiddenHeader = "stub-hidden-header";
    const data = ["Item"];
    const TableComponent = TypedTable<string>();

    const { queryByText } = render(
      <TableComponent.Table data={data} qa="">
        <TableComponent.String header={stubHiddenHeader} hideHeader value={() => "Content"} qa="val" />
      </TableComponent.Table>,
    );
    expect(queryByText(stubHiddenHeader)).toBeInTheDocument();
  });

  it("should render tr as expected", () => {
    const stubTrItem = "stub-tr-item";
    const data = [stubTrItem];
    const TableComponent = TypedTable<string>();

    const { queryByText } = render(
      <TableComponent.Table data={data} qa="">
        <TableComponent.String header="The header" value={x => x} qa="val" />
      </TableComponent.Table>,
    );
    expect(queryByText(stubTrItem)).toBeInTheDocument();
  });
});
