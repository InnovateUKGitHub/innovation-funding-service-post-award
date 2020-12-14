// tslint:disable-next-line: import-blacklist
import { ReactWrapper } from "enzyme";

export function getColumnValues(wrapper: ReactWrapper, tableQA: string, columnQA: string): ReactWrapper[] {
  const cols = wrapper.find(`[data-qa="${tableQA}"] table colgroup col`);
  const rows = wrapper.find(`[data-qa="${tableQA}"] table tbody tr`);

  const colIndex = cols.map(x => x.prop("data-qa")).indexOf(columnQA);

  return rows.map(x => x.find("td").at(colIndex));
}

export function getCellValue(wrapper: ReactWrapper, tableQA: string, columnQA: string, rowIndex: number): ReactWrapper {
  const cols = wrapper.find(`[data-qa="${tableQA}"] table colgroup col`);
  const row = wrapper.find(`[data-qa="${tableQA}"] table tbody tr`).at(rowIndex);

  const colIndex = cols.map((x: any) => x.prop("data-qa")).indexOf(columnQA);

  return row.find("td").at(colIndex);
}

export function getFooterValue(
  wrapper: ReactWrapper,
  tableQA: string,
  rowIndex: number,
  colIndex: number,
): ReactWrapper {
  const row = wrapper.find(`[data-qa="${tableQA}"] table tfoot tr`).at(rowIndex);
  return row.find("td").at(colIndex);
}

export function getRowElements(containerEl: HTMLElement, dataQa: string, index: number): ChildNode[] {
  const getUid = containerEl.querySelector(`[data-qa="${dataQa}"]`);

  if (!getUid) {
    throw new Error(`No UID found using ${dataQa}`);
  }

  const getRows = getUid.querySelectorAll("table tbody tr");

  if (!getRows.length) {
    throw new Error(`No items were found on this dataQa - ${dataQa}`);
  }

  const getRowByIndex = getRows[index];
  const getChildNodes = getRowByIndex.childNodes;

  return Array.from(getChildNodes);
}

export function getColumnTextValues(container: HTMLElement, dataQa: string, index: number): string[] {
  const columnValue = getRowElements(container, dataQa, index);

  // Note: Check textContent is defined
  return columnValue.reduce<string[]>((acc, txt) => (!!txt.textContent ? [...acc, txt.textContent] : acc), []);
}
