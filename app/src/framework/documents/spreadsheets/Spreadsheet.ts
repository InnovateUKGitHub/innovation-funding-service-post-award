import { Workbook, WorkbookProperties } from "exceljs";

interface WorkbookOptions {
  category?: string;
  company?: string;
  creator?: string;
  description?: string;
  keywords?: string;
  lastModifiedBy?: string;
  created?: Date;
  manager?: string;
  modified?: Date;
  lastPrinted?: Date;
  properties?: WorkbookProperties;
  subject?: string;
  title?: string;
}

enum SpreadsheetFormat {
  OOXML = "ooxml", // ECMA-376 ISO/IEC 29500 Office Open XML
  CSV = "csv", // Comma Separated Values
}

abstract class Spreadsheet {
  workbook: Workbook;

  constructor({ workbookOptions }: { workbookOptions?: WorkbookOptions } = {}) {
    const opts = {
      creator: "Innovation Funding Service",
      company: "Innovate UK",
      created: new Date(),
      ...workbookOptions,
    };
    this.workbook = new Workbook();
    Object.assign(this.workbook, opts);
  }

  abstract createWorksheets(): Promise<Spreadsheet>;

  async export(format: SpreadsheetFormat): Promise<{ buffer: ArrayBuffer; extension: string; mimeType: string }> {
    await this.createWorksheets();

    switch (format) {
      case SpreadsheetFormat.OOXML: {
        const buffer = await this.workbook.xlsx.writeBuffer();
        return {
          buffer,
          extension: "xlsx",
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        };
      }
      case SpreadsheetFormat.CSV: {
        const buffer = await this.workbook.csv.writeBuffer();
        return { buffer, extension: "csv", mimeType: "text/csv" };
      }
    }
  }

  static colToLet(col: number): string {
    let letter = "";
    while (col > 0) {
      const temp = (col - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      col = (col - temp - 1) / 26;
    }
    return letter;
  }

  static letToCol(letter: string): number {
    const length = letter.length;
    let column = 0;
    for (let i = 0; i < length; i++) {
      column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
  }
}

export { Spreadsheet, SpreadsheetFormat, WorkbookOptions };
