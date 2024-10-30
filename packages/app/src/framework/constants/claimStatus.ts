export type ClaimStatusKey =
  | "UNKNOWN"
  | "NEW"
  | "DRAFT"
  | "SUBMITTED"
  | "MO_QUERIED"
  | "AWAITING_IUK_APPROVAL"
  | "INNOVATE_QUERIED"
  | "APPROVED"
  | "PAID"
  | "AWAITING_IAR"
  | "PAYMENT_REQUESTED"
  | "NOT_USED";

export enum ClaimStatus {
  UNKNOWN = "",
  NEW = "New",
  DRAFT = "Draft",
  SUBMITTED = "Submitted",
  MO_QUERIED = "MO Queried",
  AWAITING_IUK_APPROVAL = "Awaiting IUK Approval",
  INNOVATE_QUERIED = "Innovate Queried",
  APPROVED = "Approved",
  PAID = "Paid",
  AWAITING_IAR = "Awaiting IAR",
  PAYMENT_REQUESTED = "Payment Requested",
  NOT_USED = "Not used",
}
