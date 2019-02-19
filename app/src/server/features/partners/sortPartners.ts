import { PartnerDto } from "../../../types";

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
  if (x.name && y.name) {
      return x.name.localeCompare(y.name);
  }
  else if (x.name) {
      return -1;
  }
  else if (y.name) {
      return 1;
  }
  return 0;
};
