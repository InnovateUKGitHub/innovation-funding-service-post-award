import { PartnerStatus } from "@framework/constants";
import { getPartnerStatus, options } from "./partnerStatus";

describe("getPartnerStatus", () => {
  test.each`
    partnerStatus                    | enumValue
    ${options.active}                | ${PartnerStatus.Active}
    ${options.onHold}                | ${PartnerStatus.OnHold}
    ${options.involuntaryWithdrawal} | ${PartnerStatus.InvoluntaryWithdrawal}
    ${options.voluntaryWithdrawal}   | ${PartnerStatus.VoluntaryWithdrawal}
    ${options.pending}               | ${PartnerStatus.Pending}
    ${options.migratedWithdrawn}     | ${PartnerStatus.MigratedWithdrawn}
    ${"Other"}                       | ${PartnerStatus.Unknown}
  `(
    "should convert $partnerStatus to $enumValue",
    ({ partnerStatus, enumValue }: { partnerStatus: string; enumValue: PartnerStatus }) => {
      expect(getPartnerStatus(partnerStatus)).toEqual(enumValue);
    },
  );
});
