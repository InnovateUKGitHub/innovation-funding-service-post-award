import { ClaimStatus } from "../constants";

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
}

export interface ClaimStatusChangeDto {
  id: string;
  claimId: string;
  previousStatus: string;
  newStatus: string;
  createdDate: Date;
  comments: string | null;
}
