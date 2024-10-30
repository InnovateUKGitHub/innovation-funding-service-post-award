import { ImpactManagementParticipation, ImpactManagementPhase } from "@framework/constants/competitionTypes";

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

export const mapImpactManagementPhasedStageToEnum = (stage: string | null | undefined) => {
  switch (stage) {
    case "1st":
      return ImpactManagementPhase.First;
    case "2nd":
      return ImpactManagementPhase.Second;
    case "3rd":
      return ImpactManagementPhase.Third;
    case "4th":
      return ImpactManagementPhase.Fourth;
    case "5th":
      return ImpactManagementPhase.Fifth;
    case "6th":
      return ImpactManagementPhase.Sixth;
    case "Last":
      return ImpactManagementPhase.Last;
    case "Unknown":
    default:
      return ImpactManagementPhase.Unknown;
  }
};
