import { PartnerStatus } from "@framework/constants/partner";

export const options = {
  active: "Active",
  onHold: "On Hold",
  involuntaryWithdrawal: "Involuntary Withdrawal",
  voluntaryWithdrawal: "Voluntary Withdrawal",
  migratedWithdrawn: "Migrated - Withdrawn",
  pending: "Pending",
};

export const getPartnerStatus = (status: string | undefined): PartnerStatus => {
  switch (status) {
    case options.active:
      return PartnerStatus.Active;
    case options.involuntaryWithdrawal:
      return PartnerStatus.InvoluntaryWithdrawal;
    case options.onHold:
      return PartnerStatus.OnHold;
    case options.pending:
      return PartnerStatus.Pending;
    case options.voluntaryWithdrawal:
      return PartnerStatus.VoluntaryWithdrawal;
    case options.migratedWithdrawn:
      return PartnerStatus.MigratedWithdrawn;
    default:
      return PartnerStatus.Unknown;
  }
};
