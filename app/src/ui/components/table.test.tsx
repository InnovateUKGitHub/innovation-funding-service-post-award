import _isEqual from "lodash.isequal";
import { render } from "@testing-library/react";
import fireEvent from "@testing-library/user-event";

import { TestBed } from "@shared/TestBed";
import { TypedTable } from "@ui/components/table";
import { SortOptions } from "@ui/components/documents/table-sorter";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";
import React from "react";

const headerButtonValues = (cells: Element[]): string[] => Array.from(cells).map(x => x.innerHTML);

const getSortableButtons = (node: Element): Element[] => [...node.querySelectorAll("thead .table-sort-button")];
const getSortableButtonAriaState = (node: Element): SortOptions | undefined => {
  const targetButtonParentNode = node.parentNode as Element | null;

  return (targetButtonParentNode?.getAttribute("aria-sort") as SortOptions) || undefined;
};
const getRows = <T extends Element>(node: T): NodeListOf<T> => node.querySelectorAll("tbody .govuk-table__row");
const getCells = <T extends Element>(node: T): NodeListOf<T> => node.querySelectorAll("tbody .govuk-table__cell");

const getCellsByRowIndex = (node: Element, rowIndex: number): Element[] => {
  const queriedRows = getRows(node);

  const queriedCells: Element[] = [];

  queriedRows.forEach(row => {
    const targetCell = getCells(row)[rowIndex];

    queriedCells.push(targetCell);
  });

  return queriedCells;
};

describe("Table", () => {
  const stubContent = {
    components: {
      loading: {
        message: "stub-loading-message",
      },
    },
  };

  const setup = (tableChildren: React.ReactElement) => {
    return render(<TestBed>{tableChildren}</TestBed>);
  };

  beforeAll(async () => {
    testInitialiseInternationalisation(stubContent);
  });

  describe("@renders", () => {
    describe("with column header", () => {
      it("as string", () => {
        const stubHeader = "stub-header";

        const NumericTable = TypedTable<number>();

        const { queryByText } = setup(
          <NumericTable.Table data={[1234]} qa="">
            <NumericTable.Number header={stubHeader} value={x => x} qa="val" />
          </NumericTable.Table>,
        );

        expect(queryByText(stubHeader)).toBeInTheDocument();
      });

      it("as content solution", () => {
        const stubHeader = stubContent.components.loading.message;

        const NumericTable = TypedTable<number>();

        const { queryByText } = setup(
          <NumericTable.Table data={[1234]} qa="">
            <NumericTable.Number header={x => x.components.loading.message} value={x => x} qa="val" />
          </NumericTable.Table>,
        );

        expect(queryByText(stubHeader)).toBeInTheDocument();
      });

      it("as React Element", () => {
        const stubHeader = "react-header";
        const StubHeaderElement = () => <>{stubHeader}</>;

        const NumericTable = TypedTable<number>();

        const { queryByText } = setup(
          <NumericTable.Table data={[1234]} qa="">
            <NumericTable.Number header={<StubHeaderElement />} value={x => x} qa="val" />
          </NumericTable.Table>,
        );

        expect(queryByText(stubHeader)).toBeInTheDocument();
      });
    });

    it("with <td> with given number", () => {
      const stubNumber = 12345;

      const NumericTable = TypedTable<number>();
      const { queryByText } = setup(
        <NumericTable.Table data={[stubNumber]} qa="">
          <NumericTable.Number header="" value={x => x} qa="val" />
        </NumericTable.Table>,
      );
      expect(queryByText(stubNumber)).toBeInTheDocument();
    });

    it("with <td> with given string", () => {
      const stubData = "stub-data";
      const StringTable = TypedTable<string>();
      const { queryByText } = setup(
        <StringTable.Table data={[stubData]} qa="">
          <StringTable.String header="" value={x => x} qa="val" />
        </StringTable.Table>,
      );
      expect(queryByText(stubData)).toBeInTheDocument();
    });

    it("with <tr> with number nodes", () => {
      const rows = [1, 2, 3];
      const NumberTable = TypedTable<number>();
      const { queryByText } = setup(
        <NumberTable.Table data={rows} qa="">
          <NumberTable.Number header="" value={x => x} qa="val" />
        </NumberTable.Table>,
      );

      rows.forEach(x => {
        expect(queryByText(x)).toBeInTheDocument();
      });
    });

    it("with th with given content", () => {
      const stubHeader = "stub-header";
      const data = ["Item"];
      const TableComponent = TypedTable<string>();

      const { queryByText } = setup(
        <TableComponent.Table data={data} qa="">
          <TableComponent.String header={stubHeader} value={() => "Content"} qa="val" />
        </TableComponent.Table>,
      );
      expect(queryByText(stubHeader)).toBeInTheDocument();
    });

    it("with hidden header with given content", () => {
      const stubHiddenHeader = "stub-hidden-header";
      const data = ["Item"];
      const TableComponent = TypedTable<string>();

      const { queryByText } = setup(
        <TableComponent.Table data={data} qa="">
          <TableComponent.String header={stubHiddenHeader} hideHeader value={() => "Content"} qa="val" />
        </TableComponent.Table>,
      );
      expect(queryByText(stubHiddenHeader)).toBeInTheDocument();
    });

    it("with tr as expected", () => {
      const stubTrItem = "stub-tr-item";
      const data = [stubTrItem];
      const TableComponent = TypedTable<string>();

      const { queryByText } = setup(
        <TableComponent.Table data={data} qa="">
          <TableComponent.String header="The header" value={x => x} qa="val" />
        </TableComponent.Table>,
      );
      expect(queryByText(stubTrItem)).toBeInTheDocument();
    });

    describe("with sort button toggle", () => {
      it("with no sortable columns", () => {
        const testData = [{ name: "Superman", age: 34 }];

        const NumericTable = TypedTable<typeof testData[0]>();

        const { container } = setup(
          <NumericTable.Table data={testData} qa="stub-table-qa">
            <NumericTable.String header="stub-header-name" value={x => x.name} qa="stub-qa-name" />
            <NumericTable.Number header="stub-header-age" value={x => x.age} qa="stub-qa-age" />
          </NumericTable.Table>,
        );

        const headerButtonList = getSortableButtons(container);

        expect(headerButtonList).toHaveLength(0);
      });

      it("with one column", async () => {
        const targetColumIndex = 0;

        const testData = [
          { name: "Superman", age: 34 },
          { name: "Batman", age: 38 },
          { name: "Flash", age: 28 },
        ];

        const NumericTable = TypedTable<typeof testData[0]>();

        const { container } = setup(
          <NumericTable.Table data={testData} qa="stub-table-qa">
            <NumericTable.String sortByKey="name" header="stub-header-name" value={x => x.name} qa="stub-qa-name" />
            <NumericTable.Number sortByKey="age" header="stub-header-age" value={x => x.age} qa="stub-qa-age" />
          </NumericTable.Table>,
        );

        const headerButtonList = getSortableButtons(container);

        // Note: this is function so the results are re-queried not cached (otherwise it returns pre-clicked values)
        const getCellData = (index: number) => headerButtonValues(getCellsByRowIndex(container, index));

        const initialTargetColumData = getCellData(targetColumIndex);
        const initialButtonAriaSort = getSortableButtonAriaState(headerButtonList[targetColumIndex]);

        expect(initialButtonAriaSort).toBe<SortOptions>("none");

        // Note: Trigger column sort
        await fireEvent.click(headerButtonList[targetColumIndex]);

        const reQueriedTargetColumData = getCellData(targetColumIndex);
        const postButtonAriaSort = getSortableButtonAriaState(headerButtonList[targetColumIndex]);

        expect(postButtonAriaSort).toBe<SortOptions>("ascending");
        expect(_isEqual(reQueriedTargetColumData, initialTargetColumData)).toBeFalsy();
      });

      it("with second column invalidating first column sort", async () => {
        const firstColumnIndex = 0;
        const newColumnIndex = 1;

        const testData = [
          { name: "Batman", age: 37 },
          { name: "Flash", age: 28 },
          { name: "Superman", age: 99 },
        ];

        const NumericTable = TypedTable<typeof testData[0]>();

        const { container } = setup(
          <NumericTable.Table data={testData} qa="stub-table-qa">
            <NumericTable.String sortByKey="name" header="stub-header-name" value={x => x.name} qa="stub-qa-name" />
            <NumericTable.Number sortByKey="age" header="stub-header-age" value={x => x.age} qa="stub-qa-age" />
          </NumericTable.Table>,
        );

        const headerButtonList = getSortableButtons(container);

        // Note: this is function so the results are requeried not cached (otherwise it returns pre-clicked values)
        const getCellData = (index: number) => headerButtonValues(getCellsByRowIndex(container, index));

        await fireEvent.click(headerButtonList[firstColumnIndex]);

        const initialFirstColumData = getCellData(firstColumnIndex);

        expect(initialFirstColumData).toMatchInlineSnapshot(`
          Array [
            "Batman",
            "Flash",
            "Superman",
          ]
        `);

        // Note: Click next column (different node from first click)
        await fireEvent.click(headerButtonList[newColumnIndex]);

        expect(getCellData(firstColumnIndex)).toMatchInlineSnapshot(`
          Array [
            "Flash",
            "Batman",
            "Superman",
          ]
        `);

        // Note: We're are expected to get false as the as order should be reset
        expect(_isEqual(initialFirstColumData, getCellData(firstColumnIndex))).toBeFalsy();

        // Note: Click next column (different node from first click)
        await fireEvent.click(headerButtonList[newColumnIndex]);

        expect(getCellData(firstColumnIndex)).toMatchInlineSnapshot(`
          Array [
            "Superman",
            "Batman",
            "Flash",
          ]
        `);

        // Note: We're are expected to get false as the as order should be reset
        expect(_isEqual(initialFirstColumData, getCellData(firstColumnIndex))).toBeFalsy();
      });

      it("with second column invalidating first aria-sort", async () => {
        const firstColumnIndex = 0;
        const newColumnIndex = 1;

        const testData = [
          { name: "Batman", age: 37 },
          { name: "Flash", age: 28 },
          { name: "Superman", age: 99 },
        ];

        const NumericTable = TypedTable<typeof testData[0]>();

        const { container } = setup(
          <NumericTable.Table data={testData} qa="stub-table-qa">
            <NumericTable.String sortByKey="name" header="stub-header-name" value={x => x.name} qa="stub-qa-name" />
            <NumericTable.Number sortByKey="age" header="stub-header-age" value={x => x.age} qa="stub-qa-age" />
          </NumericTable.Table>,
        );

        const headerButtonList = getSortableButtons(container);

        expect(getSortableButtonAriaState(headerButtonList[firstColumnIndex])).toBe<SortOptions>("none");
        expect(getSortableButtonAriaState(headerButtonList[newColumnIndex])).toBe<SortOptions>("none");

        await fireEvent.click(headerButtonList[firstColumnIndex]);

        expect(getSortableButtonAriaState(headerButtonList[firstColumnIndex])).toBe<SortOptions>("ascending");
        expect(getSortableButtonAriaState(headerButtonList[newColumnIndex])).toBe<SortOptions>("none");

        // Note: Click next column (different node from first click)
        await fireEvent.click(headerButtonList[newColumnIndex]);

        expect(getSortableButtonAriaState(headerButtonList[firstColumnIndex])).toBe<SortOptions>("none");
        expect(getSortableButtonAriaState(headerButtonList[newColumnIndex])).toBe<SortOptions>("ascending");

        // Note: This event should trigger the next state on the button sort
        await fireEvent.click(headerButtonList[newColumnIndex]);

        expect(getSortableButtonAriaState(headerButtonList[firstColumnIndex])).toBe<SortOptions>("none");
        expect(getSortableButtonAriaState(headerButtonList[newColumnIndex])).toBe<SortOptions>("descending");
      });
    });
  });
});
