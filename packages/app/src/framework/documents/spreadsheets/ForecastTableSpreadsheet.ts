import { ForecastTableDto } from "@ui/components/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import { Cell, CellFormulaValue } from "exceljs";
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

  getFilename(): string {
    const date = new Date();
    return this.copy.getCopyString(x =>
      x.components.forecastTableDownloadButton.filename({
        projectNumber: this.tableData.metadata.project.projectNumber,
        projectTitle: this.tableData.metadata.project.title,
        partnerName: this.tableData.metadata.partner.name,
        date,
      }),
    );
  }

  createWorksheets(): Promise<ForecastTableSpreadsheet> {
    const ws = this.workbook.addWorksheet(this.tableData.metadata.partner.name, {
      pageSetup: {
        paperSize: 9, // PaperSize.A4 (doesn't seem to be exported by ExcelJS for some reason)
        orientation: "landscape",
        showGridLines: false,
      },
      views: [{ showGridLines: false, state: "frozen", xSplit: 1, ySplit: 4 }],
    });

    const numberOfPeriods = this.tableData.totalRow.profiles.length;
    const numberOfCostCategories = this.tableData.costCategories.length;
    const forecastTableFirstColumn = 1;
    const forecastTableFirstRow = 1;
    const forecastTableFirstPeriodColumn = 2;
    const forecastTableLastPeriodColumn = forecastTableFirstPeriodColumn + numberOfPeriods - 1;
    const forecastTableTotalColumn = forecastTableLastPeriodColumn + 1;
    const forecastTableGolCostColumn = forecastTableTotalColumn + 1;
    const forecastTableDifferenceColumn = forecastTableGolCostColumn + 1;
    const forecastTableFirstLetter = Spreadsheet.colToLet(forecastTableFirstColumn);
    const forecastTableFirstPeriodLetter = Spreadsheet.colToLet(forecastTableFirstPeriodColumn);
    const forecastTableLastPeriodLetter = Spreadsheet.colToLet(forecastTableLastPeriodColumn);
    const forecastTableTotalLetter = Spreadsheet.colToLet(forecastTableTotalColumn);
    const forecastTableGolCostLetter = Spreadsheet.colToLet(forecastTableGolCostColumn);
    const forecastTableDifferenceLetter = Spreadsheet.colToLet(forecastTableDifferenceColumn);
    const totalCostCatStartRow = forecastTableFirstRow + 4;
    const totalCostCatEndRow = totalCostCatStartRow + numberOfCostCategories - 1;
    const forecastTableLastRow = totalCostCatEndRow + 1;
    const getRange = (rowNumber: number) => {
      const totalCell = `$${forecastTableTotalLetter}$${rowNumber}`;
      const golCostCell = `$${forecastTableGolCostLetter}$${rowNumber}`;
      const differenceCell = `$${forecastTableDifferenceLetter}$${rowNumber}`;
      const allPeriodRows = `$${forecastTableFirstPeriodLetter}$${rowNumber}:$${forecastTableLastPeriodLetter}$${rowNumber}`;
      const rowRange = `$${forecastTableFirstLetter}$${rowNumber}:${differenceCell}`;

      return {
        rowRange,
        allPeriodRows,
        totalCell,
        golCostCell,
        differenceCell,
      };
    };
    const { allPeriodRows, totalCell, golCostCell } = getRange(5 + numberOfCostCategories);

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
      { key: "total", width: 100 * SCALE_FACTOR },
      { key: "totalEligibleCosts", width: 100 * SCALE_FACTOR },
      { key: "difference", width: 100 * SCALE_FACTOR },
    ];

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
        ...this.tableData.totalRow.profiles.map(x => [`period${x.periodId}`, x.iarDue ? 1 : 0]),
      ]),
      Object.fromEntries([
        ["costCategories", this.copy.getCopyString(x => x.components.forecastTable.month)],
        ...this.tableData.totalRow.profiles.map(x => [`period${x.periodId}`, x.periodStart]),
      ]),
      ...this.tableData.costCategories.map((costCategory, i) => {
        const { allPeriodRows, totalCell, golCostCell } = getRange(totalCostCatStartRow + i);

        return Object.fromEntries([
          ["costCategories", costCategory.costCategoryName],
          ...costCategory.profiles.map(x => [`period${x.periodId}`, x.value]),
          ["total", { formula: `SUM(${allPeriodRows})`, result: costCategory.total } as CellFormulaValue],
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
          const range = `$${colLetter}$${totalCostCatStartRow}:$${colLetter}$${totalCostCatEndRow}`;
          return [`period${x.periodId}`, { formula: `SUM(${range})`, result: x.value } as CellFormulaValue];
        }),
        ["total", { formula: `SUM(${allPeriodRows})`, result: this.tableData.totalRow.total } as CellFormulaValue],
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

      for (let j = forecastTableFirstRow; j <= forecastTableLastRow; j++) {
        ws.getCell(j, colEnd).border = {
          right: { style: "thin" },
        };
      }
    }

    // Set the format of all cells in the table
    for (let j = forecastTableFirstRow; j <= forecastTableLastRow; j++) {
      const cell: Partial<Cell> = {};

      // Apply the formatting in the following switch statement
      // to the cells between firstColumn and lastColumn.
      const firstColumn = forecastTableFirstPeriodColumn;
      let lastColumn = forecastTableLastPeriodColumn;

      // Determine the correct formatting for this row.
      switch (j) {
        case 1:
          cell.font = { bold: true };
          lastColumn = forecastTableDifferenceColumn;
        case 2:
          ws.getCell(j, forecastTableFirstColumn).font = { bold: true };
          break;
        case 3:
          ws.getCell(j, forecastTableFirstColumn).font = { bold: true };
          cell.numFmt = '"Yes";;"No";';
          lastColumn = forecastTableLastPeriodColumn;
          break;
        case 4:
          cell.numFmt = "[$-en-GB]mmm yyyy;@";
          lastColumn = forecastTableLastPeriodColumn;
          ws.getCell(j, forecastTableFirstColumn).font = { bold: true };
          break;
        case forecastTableLastRow:
          ws.getCell(j, forecastTableFirstColumn).font = { bold: true };
        default:
          cell.numFmt = "£#,##0.00";
          lastColumn = forecastTableGolCostColumn;
          ws.getCell(j, forecastTableDifferenceColumn).numFmt = "0.00%";
          break;
      }

      if (cell) {
        for (let i = firstColumn; i <= lastColumn; i++) {
          Object.assign(ws.getCell(j, i), cell);
        }
      }
    }

    for (let i = forecastTableFirstColumn; i <= forecastTableDifferenceColumn; i++) {
      const firstRowCell = ws.getCell(totalCostCatStartRow, i);
      firstRowCell.border ??= {};
      firstRowCell.border.top = { style: "thin" };

      const lastRowCell = ws.getCell(forecastTableLastRow, i);
      lastRowCell.border ??= {};
      lastRowCell.border.top = { style: "thick" };
    }

    // Add "The amount you are requesting is more than the agreed costs" conditional formatting
    for (let j = totalCostCatStartRow; j <= totalCostCatEndRow; j++) {
      const { rowRange, golCostCell, totalCell } = getRange(j);
      ws.addConditionalFormatting({
        ref: rowRange,
        rules: [
          {
            priority: 1, // Not required, but TypeScript complains.
            type: "expression",
            formulae: [`${totalCell}>${golCostCell}`],
            style: { fill: { type: "pattern", pattern: "solid", bgColor: { argb: "00f8f8f8" } } },
          },
        ],
      });
    }

    return Promise.resolve(this);
  }
}

export { ForecastTableSpreadsheet };
