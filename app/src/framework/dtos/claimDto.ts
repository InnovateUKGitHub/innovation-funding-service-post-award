import { ClaimStatus } from "../constants";

export interface ClaimDto {
  id: string;
  partnerId: string;
  lastModifiedDate: Date;
  status: ClaimStatus;
  statusLabel: string;
  periodStartDate: Date;
  periodEndDate: Date;
  periodId: number;
  totalCost: number;
  forecastCost: number;
  approvedDate: Date|null;
  paidDate: Date|null;
  isIarRequired: boolean;
  isApproved: boolean;
  comments: string|null;
  overheadRate: number;
}

export interface ClaimStatusChangeDto {
  id: string;
  claimId: string;
  previousStatus: string;
  newStatus: string;
  createdDate: Date;
  comments: string | null;
}
