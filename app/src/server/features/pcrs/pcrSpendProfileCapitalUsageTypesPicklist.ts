import { PCRSpendProfileCapitalUsageType } from "@framework/constants/pcrConstants";
import { TsforceDescribeSobjectFieldPicklistEntry } from "@server/tsforce/requests/TsforceDescribeSubrequest";

export const pcrSpendProfileCapitalUsageTypePicklist: Map<
  PCRSpendProfileCapitalUsageType,
  TsforceDescribeSobjectFieldPicklistEntry
> = new Map();

pcrSpendProfileCapitalUsageTypePicklist.set(PCRSpendProfileCapitalUsageType.Unknown, {
  value: "1",
  label: "Unknown",
  defaultValue: false,
  active: true,
});
pcrSpendProfileCapitalUsageTypePicklist.set(PCRSpendProfileCapitalUsageType.New, {
  value: "2",
  label: "New",
  defaultValue: false,
  active: true,
});
pcrSpendProfileCapitalUsageTypePicklist.set(PCRSpendProfileCapitalUsageType.Existing, {
  value: "3",
  label: "Existing",
  defaultValue: false,
  active: true,
});
