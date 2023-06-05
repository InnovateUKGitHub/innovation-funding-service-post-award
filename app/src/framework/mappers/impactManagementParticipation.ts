import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";

export const mapImpactManagementParticipationToEnum = (
  participation: string | null | undefined,
): ImpactManagementParticipation => {
  switch (participation) {
    case "Yes":
    case "yes":
      return ImpactManagementParticipation.Yes;
    case "No":
    case "no":
      return ImpactManagementParticipation.No;
    default:
      return ImpactManagementParticipation.Unknown;
  }
};
