import { PCRPartnerType } from "@framework/constants/pcrConstants";
import { TsforceDescribeSobjectFieldPicklistEntry } from "@server/tsforce/requests/TsforceDescribeSubrequest";

export const pcrPartnerTypesPicklist: Map<PCRPartnerType, TsforceDescribeSobjectFieldPicklistEntry> = new Map();

// TODO populate this
pcrPartnerTypesPicklist.set(PCRPartnerType.Unknown, {
  value: "1",
  label: "Unknown",
  defaultValue: false,
  active: true,
});
