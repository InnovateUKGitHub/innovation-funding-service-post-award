import _isEqual from "lodash.isequal";
import { renderHook, act } from "@testing-library/react";

import { hookTestBed } from "@shared/TestBed";
import { SortOptions, useTableSorter } from "@ui/components/atomicDesign/organisms/documents/utils/table-sorter";

type TableDataItem = {
  link: string;
  fileName: string;
  id: string;
  description: number | null;
  fileSize: number;
  dateCreated: Date;
  uploadedBy: string | (() => string);
};

describe("useTableSorter()", () => {
  const stubTableData: TableDataItem[] = [
    {
      link: "#",
      fileName: "document-4.docx",
      id: "stub-id-1",
      description: 140,
      fileSize: 20635049,
      dateCreated: new Date(Date.UTC(2020, 3, 22)),
      uploadedBy: "Donald Duck",
    },
    {
      link: "#",
      fileName: "document-3.docx",
      id: "stub-id-2",
      description: 140,
      fileSize: 10635049,
      dateCreated: new Date(Date.UTC(2021, 8, 26)),
      uploadedBy: "John Lemon",
    },
    {
      link: "#",
      fileName: "document-2.docx",
      id: "stub-id-3",
      description: 130,
      fileSize: 18635049,
      dateCreated: new Date(Date.UTC(2021, 9, 3)),
      uploadedBy: "Fred Mango",
    },
    {
      link: "#",
      fileName: "document-1.docx",
      id: "stub-id-4",
      description: null,
      fileSize: 12635049,
      dateCreated: new Date(Date.UTC(2021, 10, 8)),
      uploadedBy: "Bonny Banana",
    },
  ];

  const stubNoColumnsSorted: (keyof typeof stubTableData[0] | null)[] = [null, null, null, null, null, null, null];

  const setup = (sortKeys: (keyof TableDataItem | null)[], tableRows: TableDataItem[], isServer?: boolean) =>
    renderHook(() => useTableSorter({ sortKeys, tableRows }), hookTestBed({ isServer }));

  describe("@returns", () => {
    // Note: the easiest way of checking the change has occurred is to check the unique id against values that change
    const getUpdatedSortOrder = <T extends { fileName: string }>(payload: T[], keyToCheck?: keyof T) => {
      return payload.map(x => {
        if (!keyToCheck) return x.fileName;

        return [x.fileName, x[keyToCheck]];
      });
    };

    const totalNumberOfColumns = Object.keys(stubTableData[0]).length;

    describe("with correct column state", () => {
      describe("with 'none' state", () => {
        test("when no columns are chosen for sorting", () => {
          const { result } = setup(stubNoColumnsSorted, stubTableData);

          // Note: we know how many columns there are using Object.keys so use this as the index
          for (let columnIndex = 0; columnIndex < totalNumberOfColumns; columnIndex++) {
            expect(result.current.getColumnOption(columnIndex)).toBeUndefined();
          }
        });

        test("when only fileName is selected", () => {
          const stubFileNameOnlySort: (keyof typeof stubTableData[0] | null)[] = [
            "fileName",
            null,
            null,
            null,
            null,
            null,
            null,
          ];
          const { result } = setup(stubFileNameOnlySort, stubTableData);

          expect(result.current.getColumnOption(0)).toBe<SortOptions>("none");

          expect(result.current.getColumnOption(1)).toBeUndefined();
          expect(result.current.getColumnOption(2)).toBeUndefined();
          expect(result.current.getColumnOption(3)).toBeUndefined();
          expect(result.current.getColumnOption(4)).toBeUndefined();
          expect(result.current.getColumnOption(5)).toBeUndefined();
          expect(result.current.getColumnOption(6)).toBeUndefined();
        });

        test("when fileName + uploadedBy are selected", () => {
          const stubFileNameOnlySort: (keyof typeof stubTableData[0] | null)[] = [
            "fileName",
            null,
            null,
            null,
            null,
            null,
            "uploadedBy",
          ];
          const { result } = setup(stubFileNameOnlySort, stubTableData);

          expect(result.current.getColumnOption(0)).toBe<SortOptions>("none");
          expect(result.current.getColumnOption(1)).toBeUndefined();
          expect(result.current.getColumnOption(2)).toBeUndefined();
          expect(result.current.getColumnOption(3)).toBeUndefined();
          expect(result.current.getColumnOption(4)).toBeUndefined();
          expect(result.current.getColumnOption(5)).toBeUndefined();
          expect(result.current.getColumnOption(6)).toBe<SortOptions>("none");
        });
      });

      describe("with column sort state updating", () => {
        const stubFileNameOnlySort: (keyof typeof stubTableData[0] | null)[] = [
          "fileName",
          null,
          null,
          null,
          null,
          null,
          null,
        ];

        test("when column state resets after another column is changed", () => {
          const stubTwoSortColumns: (keyof typeof stubTableData[0] | null)[] = [
            "fileName",
            null,
            null,
            null,
            null,
            null,
            "uploadedBy",
          ];

          const { result } = setup(stubTwoSortColumns, stubTableData);

          expect(result.current.getColumnOption(0)).toBe<SortOptions>("none");
          expect(result.current.getColumnOption(6)).toBe<SortOptions>("none");

          act(() => result.current.handleSort(0));
          expect(result.current.getColumnOption(0)).toBe<SortOptions>("ascending");

          // Other column is clicked
          act(() => result.current.handleSort(6));

          expect(result.current.getColumnOption(0)).toBe<SortOptions>("none");
          expect(result.current.getColumnOption(1)).toBeUndefined();
          expect(result.current.getColumnOption(2)).toBeUndefined();
          expect(result.current.getColumnOption(3)).toBeUndefined();
          expect(result.current.getColumnOption(4)).toBeUndefined();
          expect(result.current.getColumnOption(5)).toBeUndefined();
          expect(result.current.getColumnOption(6)).toBe<SortOptions>("ascending");
        });

        test("when column state cannot return back to none after leaving 'none' => 'ascending'", () => {
          const { result } = setup(stubFileNameOnlySort, stubTableData);

          expect(result.current.getColumnOption(0)).toBe<SortOptions>("none");

          act(() => result.current.handleSort(0));
          act(() => result.current.handleSort(0));
          act(() => result.current.handleSort(0));
          act(() => result.current.handleSort(0));

          expect(result.current.getColumnOption(0)).not.toBe<SortOptions>("none");
        });

        test("when column is clicked 'none' => 'ascending'", () => {
          const { result } = setup(stubFileNameOnlySort, stubTableData);

          expect(result.current.getColumnOption(0)).toBe<SortOptions>("none");
          expect(result.current.getColumnOption(1)).toBeUndefined();
          expect(result.current.getColumnOption(2)).toBeUndefined();
          expect(result.current.getColumnOption(3)).toBeUndefined();
          expect(result.current.getColumnOption(4)).toBeUndefined();
          expect(result.current.getColumnOption(5)).toBeUndefined();
          expect(result.current.getColumnOption(6)).toBeUndefined();

          act(() => result.current.handleSort(0));

          expect(result.current.getColumnOption(0)).toBe<SortOptions>("ascending");
          expect(result.current.getColumnOption(1)).toBeUndefined();
          expect(result.current.getColumnOption(2)).toBeUndefined();
          expect(result.current.getColumnOption(3)).toBeUndefined();
          expect(result.current.getColumnOption(4)).toBeUndefined();
          expect(result.current.getColumnOption(5)).toBeUndefined();
          expect(result.current.getColumnOption(6)).toBeUndefined();
        });

        test("when column is clicked 'ascending' => 'descending'", () => {
          const { result } = setup(stubFileNameOnlySort, stubTableData);

          act(() => result.current.handleSort(0));
          act(() => result.current.handleSort(0));

          expect(result.current.getColumnOption(0)).toBe<SortOptions>("descending");
          expect(result.current.getColumnOption(1)).toBeUndefined();
          expect(result.current.getColumnOption(2)).toBeUndefined();
          expect(result.current.getColumnOption(3)).toBeUndefined();
          expect(result.current.getColumnOption(4)).toBeUndefined();
          expect(result.current.getColumnOption(5)).toBeUndefined();
          expect(result.current.getColumnOption(6)).toBeUndefined();
        });

        test("when column is clicked 'descending' => 'ascending'", () => {
          const { result } = setup(stubFileNameOnlySort, stubTableData);

          act(() => result.current.handleSort(0));
          act(() => result.current.handleSort(0));
          act(() => result.current.handleSort(0));

          expect(result.current.getColumnOption(0)).toBe<SortOptions>("ascending");

          expect(result.current.getColumnOption(1)).toBeUndefined();
          expect(result.current.getColumnOption(2)).toBeUndefined();
          expect(result.current.getColumnOption(3)).toBeUndefined();
          expect(result.current.getColumnOption(4)).toBeUndefined();
          expect(result.current.getColumnOption(5)).toBeUndefined();
          expect(result.current.getColumnOption(6)).toBeUndefined();
        });
      });
    });

    describe("with sortedRows", () => {
      test("when not sorted", () => {
        const { result } = setup(stubNoColumnsSorted, stubTableData);

        expect(_isEqual(result.current.sortedRows, stubTableData)).toBeTruthy();
      });

      test("when event handle passes an invalid column value", () => {
        const { result } = setup(stubNoColumnsSorted, stubTableData);

        const columnIndexWhichIsInvalid = 0;

        act(() => result.current.handleSort(columnIndexWhichIsInvalid));

        expect(result.current.getColumnOption(columnIndexWhichIsInvalid)).toBeUndefined();
        expect(_isEqual(result.current.sortedRows, stubTableData)).toBeTruthy();
      });

      test("when server rendered (non-js)", () => {
        const { result } = setup(stubNoColumnsSorted, stubTableData, true);

        expect(_isEqual(result.current.sortedRows, stubTableData)).toBeTruthy();
      });

      test("when one column is sorted", () => {
        const stubDateCreateTableData = [
          {
            link: "#",
            fileName: "document-3.docx",
            id: "stub-id-3",
            description: 140,
            fileSize: 10635049,
            dateCreated: new Date(Date.UTC(2019, 3, 12)),
            uploadedBy: "John Lemon",
          },
          {
            link: "#",
            fileName: "document-2.docx",
            id: "stub-id-2",
            description: 140,
            fileSize: 20635049,
            dateCreated: new Date(Date.UTC(2014, 10, 2)),
            uploadedBy: "Donald Duck",
          },
          {
            link: "#",
            fileName: "document-1.docx",
            id: "stub-id-1",
            description: null,
            fileSize: 12635049,
            dateCreated: new Date(Date.UTC(2000, 0, 1)),
            uploadedBy: "Bonny Banana",
          },
        ];

        const stubOneSortedColumns: (keyof typeof stubTableData[0] | null)[] = [
          null,
          null,
          null,
          null,
          null,
          "dateCreated",
          null,
        ];

        const { result } = setup(stubOneSortedColumns, stubDateCreateTableData);

        // Note: the easiest way of checking the change has occurred is to check the unique id changes order
        expect(getUpdatedSortOrder(result.current.sortedRows, "dateCreated")).toMatchInlineSnapshot(`
          [
            [
              "document-3.docx",
              2019-04-12T00:00:00.000Z,
            ],
            [
              "document-2.docx",
              2014-11-02T00:00:00.000Z,
            ],
            [
              "document-1.docx",
              2000-01-01T00:00:00.000Z,
            ],
          ]
        `);

        act(() => result.current.handleSort(5));

        expect(getUpdatedSortOrder(result.current.sortedRows, "dateCreated")).toMatchInlineSnapshot(`
          [
            [
              "document-1.docx",
              2000-01-01T00:00:00.000Z,
            ],
            [
              "document-2.docx",
              2014-11-02T00:00:00.000Z,
            ],
            [
              "document-3.docx",
              2019-04-12T00:00:00.000Z,
            ],
          ]
        `);
      });

      test("when multiple columns is sorted after each other", () => {
        const stubMultipleSortTableData = [
          {
            link: "#",
            fileName: "document-3.docx",
            id: "stub-id-3",
            description: 140,
            fileSize: 10635049,
            dateCreated: new Date(Date.UTC(2019, 3, 12)),
            uploadedBy: "John Lemon",
          },
          {
            link: "#",
            fileName: "document-2.docx",
            id: "stub-id-2",
            description: 140,
            fileSize: 20635049,
            dateCreated: new Date(Date.UTC(2014, 10, 2)),
            uploadedBy: "Donald Duck",
          },
          {
            link: "#",
            fileName: "document-1.docx",
            id: "stub-id-1",
            description: null,
            fileSize: 12635049,
            dateCreated: new Date(Date.UTC(2000, 0, 1)),
            uploadedBy: "Bonny Banana",
          },
          {
            link: "#",
            fileName: "document-4.docx",
            id: "stub-id-4",
            description: null,
            fileSize: 12635049,
            dateCreated: new Date(Date.UTC(1999, 0, 1)),
            uploadedBy: "Elon tusk",
          },
        ];

        const stubTwoSortedColumns: (keyof typeof stubTableData[0] | null)[] = [
          "fileName",
          null,
          null,
          null,
          null,
          "dateCreated",
          null,
        ];

        const { result } = setup(stubTwoSortedColumns, stubMultipleSortTableData);

        expect(getUpdatedSortOrder(result.current.sortedRows, "dateCreated")).toMatchInlineSnapshot(`
          [
            [
              "document-3.docx",
              2019-04-12T00:00:00.000Z,
            ],
            [
              "document-2.docx",
              2014-11-02T00:00:00.000Z,
            ],
            [
              "document-1.docx",
              2000-01-01T00:00:00.000Z,
            ],
            [
              "document-4.docx",
              1999-01-01T00:00:00.000Z,
            ],
          ]
        `);

        act(() => result.current.handleSort(5));

        expect(getUpdatedSortOrder(result.current.sortedRows, "dateCreated")).toMatchInlineSnapshot(`
          [
            [
              "document-4.docx",
              1999-01-01T00:00:00.000Z,
            ],
            [
              "document-1.docx",
              2000-01-01T00:00:00.000Z,
            ],
            [
              "document-2.docx",
              2014-11-02T00:00:00.000Z,
            ],
            [
              "document-3.docx",
              2019-04-12T00:00:00.000Z,
            ],
          ]
        `);

        act(() => result.current.handleSort(0));

        expect(getUpdatedSortOrder(result.current.sortedRows, "dateCreated")).toMatchInlineSnapshot(`
          [
            [
              "document-1.docx",
              2000-01-01T00:00:00.000Z,
            ],
            [
              "document-2.docx",
              2014-11-02T00:00:00.000Z,
            ],
            [
              "document-3.docx",
              2019-04-12T00:00:00.000Z,
            ],
            [
              "document-4.docx",
              1999-01-01T00:00:00.000Z,
            ],
          ]
        `);
      });
    });

    describe("with sorting data types", () => {
      test("with string", () => {
        const stubStringTableData = [
          {
            link: "#",
            fileName: "document-1.docx",
            id: "stub-id-1",
            description: 140,
            fileSize: 20635049,
            dateCreated: new Date(Date.UTC(2020, 3, 22)),
            uploadedBy: "Donald Duck",
          },
          {
            link: "#",
            fileName: "document-3.docx",
            id: "stub-id-3",
            description: 140,
            fileSize: 10635049,
            dateCreated: new Date(Date.UTC(2021, 8, 26)),
            uploadedBy: "John Lemon",
          },
          {
            link: "#",
            fileName: "document-2.docx",
            id: "stub-id-2",
            description: 130,
            fileSize: 18635049,
            dateCreated: new Date(Date.UTC(2021, 9, 3)),
            uploadedBy: "Fred Mango",
          },
        ];

        const stubFileNameOnlySort: (keyof typeof stubTableData[0] | null)[] = [
          "fileName",
          null,
          null,
          null,
          null,
          null,
          null,
        ];

        const { result } = setup(stubFileNameOnlySort, stubStringTableData);

        expect(getUpdatedSortOrder(result.current.sortedRows)).toMatchInlineSnapshot(`
          [
            "document-1.docx",
            "document-3.docx",
            "document-2.docx",
          ]
        `);

        act(() => result.current.handleSort(0));

        expect(getUpdatedSortOrder(result.current.sortedRows)).toMatchInlineSnapshot(`
          [
            "document-1.docx",
            "document-2.docx",
            "document-3.docx",
          ]
        `);

        act(() => result.current.handleSort(0));

        expect(getUpdatedSortOrder(result.current.sortedRows)).toMatchInlineSnapshot(`
          [
            "document-3.docx",
            "document-2.docx",
            "document-1.docx",
          ]
        `);
      });

      test("with date", () => {
        const stubDateTableData = [
          {
            link: "#",
            fileName: "document-1.docx",
            id: "stub-id-1",
            description: 140,
            fileSize: 20635049,
            dateCreated: new Date(Date.UTC(2020, 3, 22)),
            uploadedBy: "Donald Duck",
          },
          {
            link: "#",
            fileName: "document-3.docx",
            id: "stub-id-3",
            description: 140,
            fileSize: 10635049,
            dateCreated: new Date(Date.UTC(2021, 8, 26)),
            uploadedBy: "John Lemon",
          },
          {
            link: "#",
            fileName: "document-2.docx",
            id: "stub-id-2",
            description: 130,
            fileSize: 18635049,
            dateCreated: new Date(Date.UTC(2021, 9, 3)),
            uploadedBy: "Fred Mango",
          },
        ];

        const stubFileNameOnlySort: (keyof typeof stubTableData[0] | null)[] = [
          null,
          null,
          null,
          "dateCreated",
          null,
          null,
          null,
        ];

        const { result } = setup(stubFileNameOnlySort, stubDateTableData);

        expect(getUpdatedSortOrder(result.current.sortedRows, "dateCreated")).toMatchInlineSnapshot(`
          [
            [
              "document-1.docx",
              2020-04-22T00:00:00.000Z,
            ],
            [
              "document-3.docx",
              2021-09-26T00:00:00.000Z,
            ],
            [
              "document-2.docx",
              2021-10-03T00:00:00.000Z,
            ],
          ]
        `);

        act(() => result.current.handleSort(3));

        expect(getUpdatedSortOrder(result.current.sortedRows, "dateCreated")).toMatchInlineSnapshot(`
          [
            [
              "document-1.docx",
              2020-04-22T00:00:00.000Z,
            ],
            [
              "document-3.docx",
              2021-09-26T00:00:00.000Z,
            ],
            [
              "document-2.docx",
              2021-10-03T00:00:00.000Z,
            ],
          ]
        `);

        act(() => result.current.handleSort(3));

        expect(getUpdatedSortOrder(result.current.sortedRows, "dateCreated")).toMatchInlineSnapshot(`
          [
            [
              "document-2.docx",
              2021-10-03T00:00:00.000Z,
            ],
            [
              "document-3.docx",
              2021-09-26T00:00:00.000Z,
            ],
            [
              "document-1.docx",
              2020-04-22T00:00:00.000Z,
            ],
          ]
        `);
      });

      test("with number", () => {
        const stubNumberTableData = [
          {
            link: "#",
            fileName: "document-1.docx",
            id: "stub-id-1",
            description: 140,
            fileSize: 20635049,
            dateCreated: new Date(Date.UTC(2020, 3, 22)),
            uploadedBy: "Donald Duck",
          },
          {
            link: "#",
            fileName: "document-3.docx",
            id: "stub-id-3",
            description: 140,
            fileSize: 10635049,
            dateCreated: new Date(Date.UTC(2021, 8, 26)),
            uploadedBy: "John Lemon",
          },
          {
            link: "#",
            fileName: "document-2.docx",
            id: "stub-id-2",
            description: 130,
            fileSize: 18635049,
            dateCreated: new Date(Date.UTC(2021, 9, 3)),
            uploadedBy: "Fred Mango",
          },
        ];

        const stubFileNameOnlySort: (keyof typeof stubTableData[0] | null)[] = [
          null,
          null,
          "fileSize",
          null,
          null,
          null,
          null,
        ];

        const { result } = setup(stubFileNameOnlySort, stubNumberTableData);

        expect(getUpdatedSortOrder(result.current.sortedRows, "fileSize")).toMatchInlineSnapshot(`
          [
            [
              "document-1.docx",
              20635049,
            ],
            [
              "document-3.docx",
              10635049,
            ],
            [
              "document-2.docx",
              18635049,
            ],
          ]
        `);

        act(() => result.current.handleSort(2));

        expect(getUpdatedSortOrder(result.current.sortedRows, "fileSize")).toMatchInlineSnapshot(`
          [
            [
              "document-3.docx",
              10635049,
            ],
            [
              "document-2.docx",
              18635049,
            ],
            [
              "document-1.docx",
              20635049,
            ],
          ]
        `);

        act(() => result.current.handleSort(2));

        expect(getUpdatedSortOrder(result.current.sortedRows, "fileSize")).toMatchInlineSnapshot(`
          [
            [
              "document-1.docx",
              20635049,
            ],
            [
              "document-2.docx",
              18635049,
            ],
            [
              "document-3.docx",
              10635049,
            ],
          ]
        `);
      });

      test("with fallback value (return original order both 'ascending' | 'descending')", () => {
        const stubNumberTableData = [
          {
            link: "#",
            fileName: "document-1.docx",
            id: "stub-id-1",
            description: 140,
            fileSize: 20635049,
            dateCreated: new Date(Date.UTC(2020, 3, 22)),
            uploadedBy: () => "Donald Duck",
          },
          {
            link: "#",
            fileName: "document-3.docx",
            id: "stub-id-3",
            description: 140,
            fileSize: 10635049,
            dateCreated: new Date(Date.UTC(2021, 8, 26)),
            uploadedBy: () => "John Lemon",
          },
          {
            link: "#",
            fileName: "document-2.docx",
            id: "stub-id-2",
            description: 130,
            fileSize: 18635049,
            dateCreated: new Date(Date.UTC(2021, 9, 3)),
            uploadedBy: () => "Fred Mango",
          },
        ];

        const stubFileNameOnlySort: (keyof typeof stubTableData[0] | null)[] = [
          null,
          null,
          null,
          null,
          null,
          null,
          "uploadedBy",
        ];

        const { result } = setup(stubFileNameOnlySort, stubNumberTableData);

        act(() => result.current.handleSort(6));

        expect(getUpdatedSortOrder(result.current.sortedRows)).toMatchInlineSnapshot(`
          [
            "document-1.docx",
            "document-3.docx",
            "document-2.docx",
          ]
        `);

        act(() => result.current.handleSort(6));

        expect(getUpdatedSortOrder(result.current.sortedRows)).toMatchInlineSnapshot(`
          [
            "document-1.docx",
            "document-3.docx",
            "document-2.docx",
          ]
        `);
      });
    });
  });
});
