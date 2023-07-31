import { ImpactManagementParticipation, ImpactManagementPhase } from "@framework/constants/competitionTypes";
import { ReceivedStatus } from "@framework/entities/received-status";
import { checkImpactManagementPcfNotSubmittedForFinalClaim } from "./checkImpPcfNotSubmittedForFinalClaim";

describe("checkImpactManagementPcfNotSubmittedForFinalClaim", () => {
  test.each`
    impactManagementParticipation        | isFinalClaim | pcfStatus                     | impactManagementPhasedCompetition | impactManagementPhasedCompetitionStage | shouldBeBlocked
    ${ImpactManagementParticipation.No}  | ${true}      | ${ReceivedStatus.NotReceived} | ${undefined}                      | ${ImpactManagementPhase.Unknown}       | ${true}
    ${ImpactManagementParticipation.Yes} | ${true}      | ${ReceivedStatus.NotReceived} | ${true}                           | ${ImpactManagementPhase.Last}          | ${true}
    ${ImpactManagementParticipation.Yes} | ${true}      | ${ReceivedStatus.NotReceived} | ${false}                          | ${ImpactManagementPhase.Unknown}       | ${true}
    ${ImpactManagementParticipation.Yes} | ${true}      | ${ReceivedStatus.NotReceived} | ${false}                          | ${undefined}                           | ${true}
    ${ImpactManagementParticipation.Yes} | ${false}     | ${ReceivedStatus.NotReceived} | ${false}                          | ${undefined}                           | ${false}
    ${ImpactManagementParticipation.Yes} | ${true}      | ${ReceivedStatus.Received}    | ${false}                          | ${undefined}                           | ${false}
  `(
    "When impact management participation is $impactManagementParticipation, isFinalClaim is $isFinalClaim",
    ({
      impactManagementParticipation,
      isFinalClaim,
      pcfStatus,
      impactManagementPhasedCompetition,
      impactManagementPhasedCompetitionStage,
      shouldBeBlocked,
    }) => {
      expect(
        checkImpactManagementPcfNotSubmittedForFinalClaim({
          impactManagementParticipation,
          isFinalClaim,
          impactManagementPhasedCompetition,
          impactManagementPhasedCompetitionStage,
          pcfStatus,
        }),
      ).toBe(shouldBeBlocked);
    },
  );
});
