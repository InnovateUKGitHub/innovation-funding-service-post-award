import { PCRProjectLocation } from "@framework/constants/pcrConstants";

export class PCRProjectLocationMapper {
  private readonly projectLocations = {
    insideTheUnitedKingdom: "Inside the United Kingdom",
    outsideTheUnitedKingdom: "Outside the United Kingdom",
  };

  public mapFromSalesforcePCRProjectLocation = (projectLocation: string | null | undefined): PCRProjectLocation => {
    switch (projectLocation) {
      case this.projectLocations.insideTheUnitedKingdom:
        return PCRProjectLocation.InsideTheUnitedKingdom;
      case this.projectLocations.outsideTheUnitedKingdom:
        return PCRProjectLocation.OutsideTheUnitedKingdom;
      default:
        return PCRProjectLocation.Unknown;
    }
  };

  public mapToSalesforcePCRProjectLocation = (projectLocation: PCRProjectLocation | undefined): string | null => {
    switch (projectLocation) {
      case PCRProjectLocation.InsideTheUnitedKingdom:
        return this.projectLocations.insideTheUnitedKingdom;
      case PCRProjectLocation.OutsideTheUnitedKingdom:
        return this.projectLocations.outsideTheUnitedKingdom;
      default:
        return null;
    }
  };
}
