/**
 * Gets the the values for the table columns
 */
export function getColumnValues(container: Element, tableQA: string, targetColumnQa: string): Element[] {
  const cols = container.querySelectorAll(`[data-qa="${tableQA}"] table colgroup col`);
  const rows = container.querySelectorAll(`[data-qa="${tableQA}"] table tbody tr`);

  if (!cols.length || !rows.length) return [];

  // Note: Since we're querying a NodeList we need to filter for valid elements prior getting data-qa
  const tableColumnQaValues: string[] = [];

  for (const columnNode of Array.from(cols)) {
    if (columnNode instanceof HTMLElement && columnNode.dataset.qa) {
      tableColumnQaValues.push(columnNode.dataset.qa);
    }
  }

  const qaTargetIndex = tableColumnQaValues.indexOf(targetColumnQa);

  return Array.from<Element>(rows).map(x => x.querySelectorAll("td")[qaTargetIndex]);
}

/**
 * gets values for table cells
 */
export function getCellValue(container: Element, tableQA: string, columnQA: string, rowIndex: number): Element {
  const cols = container.querySelectorAll(`[data-qa="${tableQA}"] table colgroup col`);
  const row = container.querySelectorAll(`[data-qa="${tableQA}"] table tbody tr`)[rowIndex];

  // Note: Since we're querying a NodeList we need to filter for valid elements prior getting data-qa
  const tableColumnQaValues: string[] = [];

  for (const columnNode of Array.from(cols)) {
    if (columnNode instanceof HTMLElement && columnNode.dataset.qa) {
      tableColumnQaValues.push(columnNode.dataset.qa);
    }
  }

  const colIndex = tableColumnQaValues.indexOf(columnQA);

  return row.querySelectorAll("td")[colIndex];
}

/**
 * gets values for the footer
 */
export function getFooterValue(container: Element, tableQA: string, rowIndex: number, colIndex: number): Element {
  const targetRow = container.querySelectorAll(`[data-qa="${tableQA}"] table tfoot tr`)[rowIndex];
  const rowCells = targetRow.querySelectorAll("td");

  return rowCells[colIndex];
}

/**
 * gets the row elements
 */
export function getRowElements(containerEl: Element, dataQa: string, index: number): ChildNode[] {
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

/**
 * gets the column text values
 */
export function getColumnTextValues(container: Element, dataQa: string, index: number): string[] {
  const columnValue = getRowElements(container, dataQa, index);

  // Note: Check textContent is defined
  return columnValue.reduce<string[]>((acc, txt) => (txt.textContent ? [...acc, txt.textContent] : acc), []);
}
