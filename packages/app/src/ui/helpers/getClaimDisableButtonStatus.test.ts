import { ImpactManagementParticipation, ImpactManagementPhase } from "@framework/constants/competitionTypes";
import { ReceivedStatus } from "@framework/entities/received-status";
import { getClaimDisableButtonStatus } from "./getClaimDisableButtonStatus";

describe("getClaimDisableButtonStatus", () => {
  test.each`
    impactManagementParticipation        | isFinalClaim | pcfStatus                     | impactManagementPhasedCompetition | impactManagementPhasedCompetitionStage | imDisabled
    ${ImpactManagementParticipation.No}  | ${true}      | ${ReceivedStatus.NotReceived} | ${undefined}                      | ${ImpactManagementPhase.Unknown}       | ${false}
    ${ImpactManagementParticipation.No}  | ${false}     | ${ReceivedStatus.NotReceived} | ${undefined}                      | ${ImpactManagementPhase.Unknown}       | ${false}
    ${ImpactManagementParticipation.No}  | ${false}     | ${ReceivedStatus.Received}    | ${undefined}                      | ${ImpactManagementPhase.Unknown}       | ${false}
    ${ImpactManagementParticipation.No}  | ${true}      | ${ReceivedStatus.Received}    | ${undefined}                      | ${ImpactManagementPhase.Unknown}       | ${false}
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
      imDisabled,
    }) => {
      expect(
        getClaimDisableButtonStatus({
          impactManagementParticipation,
          isFinalClaim,
          impactManagementPhasedCompetition,
          impactManagementPhasedCompetitionStage,
          pcfStatus,
        }),
      ).toStrictEqual({ imDisabled });
    },
  );
});
