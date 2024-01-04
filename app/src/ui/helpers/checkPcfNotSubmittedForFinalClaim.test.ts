import { ImpactManagementParticipation, ImpactManagementPhase } from "@framework/constants/competitionTypes";
import { ReceivedStatus } from "@framework/entities/received-status";
import { checkPcfNotSubmittedForFinalClaim } from "./checkPcfNotSubmittedForFinalClaim";

describe("checkPcfNotSubmittedForFinalClaim", () => {
  test.each`
    impactManagementParticipation        | isFinalClaim | pcfStatus                     | impactManagementPhasedCompetition | impactManagementPhasedCompetitionStage | imDisabled | checkForFileOnSubmit
    ${ImpactManagementParticipation.No}  | ${true}      | ${ReceivedStatus.NotReceived} | ${undefined}                      | ${ImpactManagementPhase.Unknown}       | ${false}   | ${true}
    ${ImpactManagementParticipation.No}  | ${false}     | ${ReceivedStatus.NotReceived} | ${undefined}                      | ${ImpactManagementPhase.Unknown}       | ${false}   | ${false}
    ${ImpactManagementParticipation.No}  | ${false}     | ${ReceivedStatus.Received}    | ${undefined}                      | ${ImpactManagementPhase.Unknown}       | ${false}   | ${false}
    ${ImpactManagementParticipation.No}  | ${true}      | ${ReceivedStatus.Received}    | ${undefined}                      | ${ImpactManagementPhase.Unknown}       | ${false}   | ${false}
    ${ImpactManagementParticipation.Yes} | ${true}      | ${ReceivedStatus.NotReceived} | ${true}                           | ${ImpactManagementPhase.Last}          | ${true}    | ${true}
    ${ImpactManagementParticipation.Yes} | ${true}      | ${ReceivedStatus.NotReceived} | ${false}                          | ${ImpactManagementPhase.Unknown}       | ${true}    | ${true}
    ${ImpactManagementParticipation.Yes} | ${true}      | ${ReceivedStatus.NotReceived} | ${false}                          | ${undefined}                           | ${true}    | ${true}
    ${ImpactManagementParticipation.Yes} | ${false}     | ${ReceivedStatus.NotReceived} | ${false}                          | ${undefined}                           | ${false}   | ${false}
    ${ImpactManagementParticipation.Yes} | ${true}      | ${ReceivedStatus.Received}    | ${false}                          | ${undefined}                           | ${false}   | ${false}
  `(
    "When impact management participation is $impactManagementParticipation, isFinalClaim is $isFinalClaim",
    ({
      impactManagementParticipation,
      isFinalClaim,
      pcfStatus,
      impactManagementPhasedCompetition,
      impactManagementPhasedCompetitionStage,
      imDisabled,
      checkForFileOnSubmit,
    }) => {
      expect(
        checkPcfNotSubmittedForFinalClaim({
          impactManagementParticipation,
          isFinalClaim,
          impactManagementPhasedCompetition,
          impactManagementPhasedCompetitionStage,
          pcfStatus,
        }),
      ).toStrictEqual({ imDisabled, checkForFileOnSubmit });
    },
  );
});
