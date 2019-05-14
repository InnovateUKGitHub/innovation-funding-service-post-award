import { PartnerDto } from "@framework/types";
import { stringComparator } from "@framework/util/comparator";

export const sortPartners = (x: PartnerDto, y: PartnerDto) => {
  if(x.projectId > y.projectId) {
    return 1;
  }

  if(x.projectId < y.projectId) {
    return -1;
  }

  // if x is not lead but y is lead then y is bigger
  if (!x.isLead && !!y.isLead) {
      return 1;
  }
  // if x is lead but y is not lead then x is bigger
  if (!!x.isLead && !y.isLead) {
      return -1;
  }

  // both same so sort by name
  return stringComparator(x.name, y.name);
};
