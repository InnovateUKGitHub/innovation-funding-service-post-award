import { PCRProjectRole } from "@framework/constants/pcrConstants";
import { TsforceDescribeSobjectFieldPicklistEntry } from "@innovateuk/tsforce/requests/TsforceDescribeSubrequest";

export const pcrProjectRolesPicklist: Map<PCRProjectRole, TsforceDescribeSobjectFieldPicklistEntry> = new Map();

// TODO populate this
pcrProjectRolesPicklist.set(PCRProjectRole.Unknown, {
  value: "1",
  label: "Unknown",
  defaultValue: false,
  active: true,
});
