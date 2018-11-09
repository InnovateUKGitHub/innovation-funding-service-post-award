interface ClaimDto {
  id: string;
  partnerId: string;
  lastModifiedDate: Date;
  status: "New" | "Draft" | "Submitted" | "MO Queried" | "Awaiting IUK Approval" | "Innovate Queried" | "Approved" | "Paid";
  periodStartDate: Date;
  periodEndDate: Date;
  periodId: number;
  totalCost: number;
  forecastCost: number;
  forecastLastModified: Date|null;
  approvedDate: Date|null;
  paidDate: Date|null;
  // ToDo: confirm field
  comments: string|null;
}
