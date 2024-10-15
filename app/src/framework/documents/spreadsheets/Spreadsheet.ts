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

  async exportOOXML() {
    await this.createWorksheets();
    return this.workbook.xlsx.writeBuffer();
  }

  async exportCSV() {
    await this.createWorksheets();
    return this.workbook.csv.writeBuffer();
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

export { Spreadsheet };
