import { ClaimStatus } from "@framework/constants/claimStatus";
import { IContext } from "@framework/types/IContext";
import { OptionsQueryBase } from "../common/optionsQueryBase";
import { mapToClaimStatus } from "./mapClaim";

export class GetClaimStatusesQuery extends OptionsQueryBase<ClaimStatus> {
  constructor() {
    super("ClaimStatus");
  }

  protected getPickListValues(context: IContext) {
    return context.repositories.claims.getClaimStatuses();
  }

  protected mapToEnumValue(value: string) {
    return mapToClaimStatus(value);
  }
}
