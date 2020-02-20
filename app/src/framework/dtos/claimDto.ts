import { ClaimStatus } from "../constants";
import { Option } from "@framework/dtos/option";

export interface ClaimDto {
  allowIarEdit: boolean;
  approvedDate: Date|null;
  comments: string|null;
  id: string;
  isApproved: boolean;
  isFinalClaim: boolean;
  isIarRequired: boolean;
  forecastCost: number;
  lastModifiedDate: Date;
  overheadRate: number;
  paidDate: Date|null;
  partnerId: string;
  periodEndDate: Date;
  periodId: number;
  periodStartDate: Date;
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
