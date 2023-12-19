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

const checkImpactManagementPcfNotSubmittedForFinalClaim = ({
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

  if (isFinalClaim && !isReceived && isImpactManagement) {
    // If we are in an unphased IM and the PCF is not received on the final claim, disallow
    if (!isPhased) return true;

    // If we are in an phased IM and the PCF is not received on the final claim and the final phase, disallow
    if (isPhased && isFinalPhase) return true;
  }

  return false;
};

export { checkImpactManagementPcfNotSubmittedForFinalClaim };
