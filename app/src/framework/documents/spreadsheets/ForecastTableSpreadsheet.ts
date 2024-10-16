import { ForecastTableDto } from "@ui/components/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import { CellFormulaValue } from "exceljs";
import { Spreadsheet, WorkbookOptions } from "./Spreadsheet";
import { Copy } from "@copy/Copy";
import { getForecastHeaderContent } from "@ui/components/organisms/forecasts/ForecastTable/getForecastHeaderContent";

const SCALE_FACTOR = 1 / 7;

class ForecastTableSpreadsheet extends Spreadsheet {
  private readonly tableData: ForecastTableDto;
  private readonly copy: Copy;

  constructor({
    tableData,
    copy,
    workbookOptions,
  }: {
    tableData: ForecastTableDto;
    copy: Copy;
    workbookOptions?: WorkbookOptions;
  }) {
    super({ workbookOptions });
    this.tableData = tableData;
    this.copy = copy;
  }

  createWorksheets(): Promise<ForecastTableSpreadsheet> {
    const ws = this.workbook.addWorksheet("Period X", {
      pageSetup: {
        paperSize: 9, // PaperSize.A4 (doesn't seem to be exported by ExcelJS for some reason)
        orientation: "landscape",
        showGridLines: false,
      },
    });

    const numberOfPeriods = this.tableData.totalRow.profiles.length;
    const numberOfCostCategories = this.tableData.costCategories.length;
    const forecastTableFirstColumn = 2;
    const forecastTableLastColumn = forecastTableFirstColumn + numberOfPeriods - 1;
    const forecastTableTotalColumn = forecastTableLastColumn + 1;
    const forecastTableGolCostColumn = forecastTableTotalColumn + 1;
    const forecastTableDifferenceColumn = forecastTableGolCostColumn + 1;
    const forecastTableStartLetter = Spreadsheet.colToLet(forecastTableFirstColumn);
    const forecastTableEndLetter = Spreadsheet.colToLet(forecastTableLastColumn);
    const forecastTableTotalLetter = Spreadsheet.colToLet(forecastTableTotalColumn);
    const forecastTableGolCostLetter = Spreadsheet.colToLet(forecastTableGolCostColumn);
    const totalCostCatStartRow = 5;
    const totalCostCatEndRow = totalCostCatStartRow + numberOfCostCategories - 1;
    const getRange = (rowNumber: number) => {
      const rowRange = `${forecastTableStartLetter}${rowNumber}:${forecastTableEndLetter}${rowNumber}`;
      const totalCell = `${forecastTableTotalLetter}${rowNumber}`;
      const golCostCell = `${forecastTableGolCostLetter}${rowNumber}`;

      return {
        rowRange,
        totalCell,
        golCostCell,
      };
    };
    const { rowRange, totalCell, golCostCell } = getRange(5 + numberOfCostCategories);

    /**
     * A typical forecast table looks like the following...
     *
     *    | A                               | B      | C      | D      | E      | ...    | T      | U      | V      | X          | Y                  | Z          |
     * ID | costCategories                  | period${x} where X is the period number, 1 indexed                    | total      | totalEligibleCosts | difference |
     *    ==========================================================================================================================================================
     * 1  |                                 | Status Label 1                    | Status Label 2                    |            |                    |            |
     * 2  | Period                          |      1 |      2 |      3 |      4 |      5 |      6 |      7 |      8 |            | Total              |            |
     * 3  | Schedule 3 Due / IAR Due        |  TRUE  |  FALSE |  TRUE  |  FALSE |  TRUE  |  FALSE |  TRUE  |  FALSE |            | Eligible           |            |
     * 4  | Month                           | AUG 24 | SEP 24 | OCT 24 | NOV 24 | DEC 24 | JAN 25 | FEB 25 | MAR 25 | Total      | Costs              | Difference |
     *    | ------------------------------- | --------------------------------- | --------------------------------- | -------------------------------------------- | <-- Use Excel borders :)
     * 5  | Associate Employment            |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |      £0.00 |              £0.00 |     £0.00  |
     * 6  | Travel and Subsistence          |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |      £0.00 |              £0.00 |     £0.00  |
     * 7  |   (et cetera, yardee-daa)       |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |      £0.00 |              £0.00 |     £0.00  |
     *    | ------------------------------- | --------------------------------- | --------------------------------- | -----------|------------------- | ---------- |
     * 8  | Total                           |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |  £0.00 |      £0.00 |              £0.00 |     £0.00  | <-- Use formulae fields :)
     */

    ws.columns = [
      { key: "costCategories", width: 140 * SCALE_FACTOR },
      ...this.tableData.totalRow.profiles.map(x => ({ key: `period${x.periodId}`, width: 80 * SCALE_FACTOR })),
      { key: "total", width: 90 * SCALE_FACTOR },
      { key: "totalEligibleCosts", width: 90 * SCALE_FACTOR },
      { key: "difference", width: 90 * SCALE_FACTOR },
    ];

    ws.views = [{ state: "frozen", xSplit: 1, ySplit: 4 }];

    /**
     * Rows 1, 2, 3 and 4
     */
    ws.addRows([
      Object.fromEntries([
        ["costCategories", this.copy.getCopyString(x => x.components.forecastTable.costCategoriesHeader)],
        ...this.tableData.statusRow.map(x => [
          `period${x.periodId}`,
          this.copy.getCopyString(getForecastHeaderContent(x.group)),
        ]),
        ["total", this.copy.getCopyString(x => x.components.forecastTable.totalHeader)],
        ["totalEligibleCosts", this.copy.getCopyString(x => x.components.forecastTable.totalEligibleCostsHeader)],
        ["difference", this.copy.getCopyString(x => x.components.forecastTable.differenceHeader)],
      ]),
      Object.fromEntries([
        ["costCategories", this.copy.getCopyString(x => x.components.forecastTable.periodHeader)],
        ...this.tableData.totalRow.profiles.map(x => [`period${x.periodId}`, x.periodId]),
      ]),
      Object.fromEntries([
        ["costCategories", this.copy.getCopyString(x => x.components.forecastTable.iarDueHeader)],
        ...this.tableData.totalRow.profiles.map(x => [`period${x.periodId}`, x.iarDue]),
      ]),
      Object.fromEntries([
        ["costCategories", this.copy.getCopyString(x => x.components.forecastTable.month)],
        ...this.tableData.totalRow.profiles.map(x => [`period${x.periodId}`, x.periodStart]),
      ]),
      ...this.tableData.costCategories.map((costCategory, i) => {
        const { rowRange, totalCell, golCostCell } = getRange(5 + i);

        return Object.fromEntries([
          ["costCategories", costCategory.costCategoryName],
          ...costCategory.profiles.map(x => [`period${x.periodId}`, x.value]),
          ["total", { formula: `SUM(${rowRange})`, result: costCategory.total } as CellFormulaValue],
          ["totalEligibleCosts", costCategory.golCost],
          [
            "difference",
            {
              formula: `IFERROR((${totalCell}-${golCostCell})/${golCostCell},0)`,
              result: costCategory.difference,
            } as CellFormulaValue,
          ],
        ]);
      }),
      Object.fromEntries([
        ["costCategories", this.copy.getCopyString(x => x.components.forecastTable.totalHeader)],
        ...this.tableData.totalRow.profiles.map(x => {
          const colLetter = Spreadsheet.colToLet(x.periodId + 1);
          const range = `${colLetter}${totalCostCatStartRow}:${colLetter}${totalCostCatEndRow}`;
          return [`period${x.periodId}`, { formula: `SUM(${range})`, result: x.value } as CellFormulaValue];
        }),
        ["total", { formula: `SUM(${rowRange})`, result: this.tableData.totalRow.total } as CellFormulaValue],
        ["totalEligibleCosts", this.tableData.totalRow.golCost],
        [
          "difference",
          {
            formula: `IFERROR((${totalCell}-${golCostCell})/${golCostCell},0)`,
            result: this.tableData.totalRow.difference,
          } as CellFormulaValue,
        ],
      ]),
    ]);

    // Merge the "Total", "Total Eligible Costs" and "Difference" cells
    for (let i = 0; i < 3; i++) {
      // Add 2 to the col number to...
      // 1. Skip the first column
      // 2. 1 index our numbers
      const colNum = numberOfPeriods + i + 2;
      ws.mergeCells(1, colNum, 4, colNum);
      // Enable word wrapping
      ws.getCell(1, colNum).alignment = { wrapText: true };
    }

    // Merge the statuses
    for (const statusGrouping of this.tableData.statusRow) {
      const colStart = statusGrouping.periodId + 1;
      const colEnd = colStart + statusGrouping.colSpan - 1;
      ws.mergeCells(1, colStart, 1, colEnd);
      ws.getCell(1, colStart).alignment = { wrapText: true };
    }

    for (let j = 5; j <= totalCostCatEndRow + 1; j++) {
      for (let i = 2; i <= forecastTableGolCostColumn; i++) {
        ws.getCell(j, i).numFmt = "£0.00";
      }
      ws.getCell(j, forecastTableDifferenceColumn).numFmt = "0.00%";
    }

    return Promise.resolve(this);
  }
}

export { ForecastTableSpreadsheet };
