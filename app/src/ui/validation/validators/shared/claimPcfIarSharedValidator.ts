import { ClaimStatus } from "@framework/constants/claimStatus";
import { ImpactManagementParticipation, ImpactManagementPhase } from "@framework/constants/competitionTypes";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { ClaimDto } from "@framework/dtos/claimDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { ReceivedStatus } from "@framework/entities/received-status";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";

interface ClaimPcfIarValidatorProps {
  claim: Pick<
    ClaimDto,
    | "status"
    | "isFinalClaim"
    | "impactManagementParticipation"
    | "impactManagementPhasedCompetition"
    | "impactManagementPhasedCompetitionStage"
    | "pcfStatus"
    | "iarStatus"
    | "isIarRequired"
  >;
  project: Pick<ProjectDto, "competitionType">;
  documents: Pick<DocumentSummaryDto, "description">[];
  submit?: boolean;
}

enum ClaimPcfIarSharedValidatorResult {
  IM_QUESTIONS_MISSING,
  PCF_MISSING,
  IAR_MISSING,
  SCHEDULE_THREE_MISSING,
}

const map = ({ claim, project, documents, submit }: ClaimPcfIarValidatorProps) => {
  return {
    isDraftOrQueried:
      !submit &&
      (claim.status === ClaimStatus.DRAFT ||
        claim.status === ClaimStatus.MO_QUERIED ||
        claim.status === ClaimStatus.INNOVATE_QUERIED),
    isKtp: checkProjectCompetition(project.competitionType).isKTP,
    isFinalClaim: claim.isFinalClaim,
    isIm: claim.impactManagementParticipation === ImpactManagementParticipation.Yes,
    isImPhased: claim.impactManagementPhasedCompetition,
    isImFinalPhase: claim.impactManagementPhasedCompetitionStage === ImpactManagementPhase.Last,
    isPcfReceived: claim.pcfStatus === ReceivedStatus.Received,
    isIarReceived: claim.iarStatus === ReceivedStatus.Received,
    isIarRequired: claim.isIarRequired,
    isPcfDocumentAttached: documents.some(x => x.description === DocumentDescription.ProjectCompletionForm),
    isIarDocumentAttached: documents.some(x => x.description === DocumentDescription.IAR),
    isScheduleThreeDocumentAttached: documents.some(x => x.description === DocumentDescription.ScheduleThree),
  };
};

/**
 * Run PCF validation
 *
 * YOU MUST update the Confluence document before editing the code.
 * https://ukri.atlassian.net/wiki/spaces/ACC/pages/467107882/PCF+IAR+Validation
 */
const pcfValidation = (props: ClaimPcfIarValidatorProps) => {
  const {
    isDraftOrQueried,
    isKtp,
    isFinalClaim,
    isPcfReceived,
    isIm,
    isImPhased,
    isImFinalPhase,
    isPcfDocumentAttached,
  } = map(props);

  if (isDraftOrQueried) return;
  if (isKtp) return;
  if (!isFinalClaim) return;
  if (isPcfReceived) return;

  if (isIm) {
    if (isImPhased && !isImFinalPhase) return;
    return ClaimPcfIarSharedValidatorResult.IM_QUESTIONS_MISSING;
  } else {
    if (isPcfDocumentAttached) return;
    return ClaimPcfIarSharedValidatorResult.PCF_MISSING;
  }
};

/**
 * Run IAR (KTP: Schedule 3) validation
 *
 * YOU MUST update the Confluence document before editing the code.
 * https://ukri.atlassian.net/wiki/spaces/ACC/pages/467107882/PCF+IAR+Validation
 */
const iarValidation = (props: ClaimPcfIarValidatorProps) => {
  const {
    isDraftOrQueried,
    isIarRequired,
    isIarReceived,
    isKtp,
    isScheduleThreeDocumentAttached,
    isIarDocumentAttached,
  } = map(props);

  if (isDraftOrQueried) return;
  if (!isIarRequired) return;
  if (isIarReceived) return;

  if (isKtp) {
    if (isScheduleThreeDocumentAttached) return;
    return ClaimPcfIarSharedValidatorResult.SCHEDULE_THREE_MISSING;
  } else {
    if (isIarDocumentAttached) return;
    return ClaimPcfIarSharedValidatorResult.IAR_MISSING;
  }
};

export { pcfValidation, iarValidation, ClaimPcfIarSharedValidatorResult };
