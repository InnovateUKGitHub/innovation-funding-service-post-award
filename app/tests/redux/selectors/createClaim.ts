import { ClaimDto } from "../../../src/types/dtos";
import { ClaimStatus } from "../../../src/types/constants";

export default (mod?: Partial<ClaimDto>): ClaimDto => {
  const template = {
    id: "",
    partnerId: "",
    allowIarEdit: false,
    approvedDate: null,
    comments: null,
    forecastCost: 0,
    forecastLastModified: null,
    isApproved: true,
    isIarRequired: true,
    lastModifiedDate: new Date(),
    paidDate: null,
    periodEndDate: new Date(),
    periodId: 1,
    periodStartDate: new Date(),
    status: ClaimStatus.DRAFT,
    totalCost: 0
  };
  return { ...template, ...mod };
};
