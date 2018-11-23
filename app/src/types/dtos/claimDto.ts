import { ClaimStatus } from "../constants";

export interface ClaimDto {
  id: string;
  partnerId: string;
  lastModifiedDate: Date;
  status: ClaimStatus;
  periodStartDate: Date;
  periodEndDate: Date;
  periodId: number;
  totalCost: number;
  forecastCost: number;
  forecastLastModified: Date|null;
  approvedDate: Date|null;
  paidDate: Date|null;
  isIarRequired: boolean;
  isApproved: boolean;
  // ToDo: confirm field
  comments: string|null;
  allowIarEdit: boolean;
}
