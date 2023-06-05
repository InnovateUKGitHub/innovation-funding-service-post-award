import { ClaimStatus } from "@framework/constants";
import { ClaimDto } from "@framework/dtos";

export default (mod?: Partial<ClaimDto>): ClaimDto => {
  const template: ClaimDto = {
    id: "",
    partnerId: "" as PartnerId,
    allowIarEdit: false,
    approvedDate: null,
    comments: null,
    forecastCost: 0,
    isApproved: true,
    isIarRequired: true,
    lastModifiedDate: new Date(),
    paidDate: null,
    periodEndDate: new Date(),
    periodId: 1 as PeriodId,
    periodStartDate: new Date(),
    pcfStatus: "Not Received",
    iarStatus: "Not Received",
    status: ClaimStatus.DRAFT,
    statusLabel: ClaimStatus.DRAFT,
    totalCost: 0,
    overheadRate: 0,
    isFinalClaim: false,
    totalCostsSubmitted: 100,
    totalCostsApproved: 100,
    totalDeferredAmount: 100,
    periodCostsToBePaid: 100,
  };

  return { ...template, ...mod };
};
