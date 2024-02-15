import { ImpactManagementParticipation, ImpactManagementPhase } from "@framework/constants/competitionTypes";
import { ClaimDto } from "@framework/dtos/claimDto";
import { ReceivedStatus } from "@framework/entities/received-status";

type CheckImpactManagementPcfNotSubmittedForFinalClaimProps = Pick<
  ClaimDto,
  | "impactManagementParticipation"
  | "isFinalClaim"
  | "pcfStatus"
  | "impactManagementPhasedCompetition"
  | "impactManagementPhasedCompetitionStage"
>;

const getClaimDisableButtonStatus = ({
  impactManagementParticipation,
  isFinalClaim,
  pcfStatus,
  impactManagementPhasedCompetition,
  impactManagementPhasedCompetitionStage,
}: CheckImpactManagementPcfNotSubmittedForFinalClaimProps) => {
  const isImpactManagement = impactManagementParticipation === ImpactManagementParticipation.Yes;
  const isReceived = pcfStatus === ReceivedStatus.Received;
  const isPhased = impactManagementPhasedCompetition;
  const isFinalPhase = impactManagementPhasedCompetitionStage === ImpactManagementPhase.Last;

  if (isImpactManagement && !isReceived && isFinalClaim && !isPhased) {
    return { imDisabled: true };
  }
  if (isImpactManagement && !isReceived && isFinalClaim && isPhased && isFinalPhase) {
    return { imDisabled: true };
  }

  return { imDisabled: false };
};

export { getClaimDisableButtonStatus };
