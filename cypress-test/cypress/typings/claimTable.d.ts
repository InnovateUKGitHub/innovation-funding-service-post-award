import { CostCategory } from "./costCategory";

export type ClaimTableRows = CostCategory | "Total";
export type ClaimTableColumns =
  | "Category"
  | "Forecast for period"
  | "Costs claimed this period"
  | "Difference (£)"
  | "Difference (%)";
