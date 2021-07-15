import { ReceivedStatus } from "@framework/entities";
import { ClaimStatus } from "@framework/constants";

export interface ClaimDto {
  allowIarEdit: boolean;
  approvedDate: Date | null;
  comments: string | null;
  id: string;
  isApproved: boolean;
  isFinalClaim: boolean;
  isIarRequired: boolean;
  forecastCost: number;
  lastModifiedDate: Date;
  overheadRate: number;
  paidDate: Date | null;
  partnerId: string;
  periodEndDate: Date;
  periodId: number;
  periodStartDate: Date;
  pcfStatus: ReceivedStatus;
  iarStatus: ReceivedStatus;
  status: ClaimStatus;
  statusLabel: string;
  totalCost: number;
  totalCostsSubmitted: number;
  totalCostsApproved: number;
  totalDeferredAmount: number;
  periodCostsToBePaid: number;
}

export interface ClaimStatusChangeDto {
  id: string;
  claimId: string;
  previousStatus: ClaimStatus;
  previousStatusLabel: string;
  newStatus: ClaimStatus;
  newStatusLabel: string;
  createdDate: Date;
  comments: string | null;
  createdBy: string;
}
