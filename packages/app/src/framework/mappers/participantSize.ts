import { PCRParticipantSize } from "@framework/constants/pcrConstants";

export class PcrParticipantSizeMapper {
  private readonly participantSizes = {
    academic: "Academic",
    small: "Small",
    medium: "Medium",
    large: "Large",
  };

  public mapFromSalesforcePCRParticipantSize = (participantSize: string | null): PCRParticipantSize => {
    switch (participantSize) {
      case this.participantSizes.academic:
        return PCRParticipantSize.Academic;
      case this.participantSizes.small:
        return PCRParticipantSize.Small;
      case this.participantSizes.medium:
        return PCRParticipantSize.Medium;
      case this.participantSizes.large:
        return PCRParticipantSize.Large;
      default:
        return PCRParticipantSize.Unknown;
    }
  };

  public mapToSalesforcePCRParticipantSize = (participantSize: PCRParticipantSize | undefined): string | null => {
    switch (participantSize) {
      case PCRParticipantSize.Academic:
        return this.participantSizes.academic;
      case PCRParticipantSize.Small:
        return this.participantSizes.small;
      case PCRParticipantSize.Medium:
        return this.participantSizes.medium;
      case PCRParticipantSize.Large:
        return this.participantSizes.large;
      default:
        return null;
    }
  };
}
