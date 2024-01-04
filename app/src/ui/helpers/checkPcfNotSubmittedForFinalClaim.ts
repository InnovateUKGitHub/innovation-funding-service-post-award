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

const checkPcfNotSubmittedForFinalClaim = ({
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
    return { imDisabled: true, checkForFileOnSubmit: true };
  }
  if (isImpactManagement && !isReceived && isFinalClaim && isPhased && isFinalPhase) {
    return { imDisabled: true, checkForFileOnSubmit: true };
  }
  if (!isImpactManagement && !isReceived && isFinalClaim) {
    return { imDisabled: false, checkForFileOnSubmit: true };
  }

  return { imDisabled: false, checkForFileOnSubmit: false };
};

export { checkPcfNotSubmittedForFinalClaim };
