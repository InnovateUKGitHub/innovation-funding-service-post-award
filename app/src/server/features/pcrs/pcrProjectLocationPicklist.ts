import { PCRProjectLocation } from "@framework/constants/pcrConstants";
import { TsforceDescribeSobjectFieldPicklistEntry } from "@server/tsforce/requests/TsforceDescribeSubrequest";

export const pcrProjectLocationPicklist: Map<PCRProjectLocation, TsforceDescribeSobjectFieldPicklistEntry> = new Map();

pcrProjectLocationPicklist.set(PCRProjectLocation.Unknown, {
  value: "1",
  label: "Unknown",
  defaultValue: false,
  active: true,
});
pcrProjectLocationPicklist.set(PCRProjectLocation.InsideTheUnitedKingdom, {
  value: "2",
  label: "Inside the United Kingdom",
  defaultValue: false,
  active: true,
});
pcrProjectLocationPicklist.set(PCRProjectLocation.OutsideTheUnitedKingdom, {
  value: "3",
  label: "Outside the United Kingdom",
  defaultValue: false,
  active: true,
});
