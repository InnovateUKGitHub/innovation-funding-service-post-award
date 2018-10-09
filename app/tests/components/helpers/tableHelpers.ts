import { ReactWrapper } from "enzyme";

export function getColumnValues(wrapper: ReactWrapper, tableQA: string, columnQA: string): ReactWrapper[] {
  const cols = wrapper.find(`[data-qa="project-details-table"] table colgroup col`);
  const rows = wrapper.find(`[data-qa="project-details-table"] table tbody tr`);

  const colIndex = cols.map(x => x.prop("data-qa")).indexOf(columnQA);

  return rows.map(x => x.find("td").at(colIndex));
}

export function getCellValues(wrapper: any, tableQA: string, columnQA: string, rowIndex: number): ReactWrapper {
  const cols = wrapper.find(`[data-qa="project-details-table"] table colgroup col`);
  const row = wrapper.find(`[data-qa="project-details-table"] table tbody tr`).at(rowIndex);

  const colIndex = cols.map((x: any) => x.prop("data-qa")).indexOf(columnQA);

  return row.find("td").get(colIndex);
}
