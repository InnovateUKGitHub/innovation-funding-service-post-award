import { ClaimStatus } from "@framework/constants";
import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { ClaimDto } from "@framework/dtos";
import { ReceivedStatus } from "@framework/entities";

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
    pcfStatus: ReceivedStatus.NotReceived,
    iarStatus: ReceivedStatus.NotReceived,
    status: ClaimStatus.DRAFT,
    statusLabel: ClaimStatus.DRAFT,
    totalCost: 0,
    overheadRate: 0,
    isFinalClaim: false,
    totalCostsSubmitted: 100,
    totalCostsApproved: 100,
    totalDeferredAmount: 100,
    periodCostsToBePaid: 100,
    impactManagementParticipation: ImpactManagementParticipation.No,
  };

  return { ...template, ...mod };
};
