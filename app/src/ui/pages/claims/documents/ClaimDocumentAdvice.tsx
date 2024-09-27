// Note: Consider refactoring to an object loop based on competitionType if this grows in complexity

import { ImpactManagementParticipation } from "@framework/constants/competitionTypes";
import { ClaimDto } from "@framework/dtos/claimDto";
import { UL, OL } from "@ui/components/atoms/List/list";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { Section } from "@ui/components/molecules/Section/section";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { useContent } from "@ui/hooks/content.hook";

export interface ClaimDocumentAdviceProps
  extends Pick<ClaimDto, "isIarRequired" | "isFinalClaim" | "impactManagementParticipation"> {
  competitionType: string;
}

/**
 * Displays claim document advice
 */
export function ClaimDocumentAdvice({
  isFinalClaim,
  isIarRequired,
  impactManagementParticipation,
  competitionType,
}: ClaimDocumentAdviceProps) {
  const { getContent } = useContent();
  const { isKTP, isCombinationOfSBRI } = checkProjectCompetition(competitionType);

  const getAdvice = () => {
    if (isKTP) {
      return (
        <>
          {isIarRequired && <SimpleString>{getContent(x => x.claimsMessages.iarRequiredAdvice)}</SimpleString>}
          {isFinalClaim && <SimpleString>{getContent(x => x.claimsMessages.finalClaimIarAdvice)}</SimpleString>}

          <SimpleString>{getContent(x => x.claimsMessages.usefulTip)}</SimpleString>

          <SimpleString>{getContent(x => x.claimsMessages.requiredUploadAdvice)}</SimpleString>

          <UL>
            <li>{getContent(x => x.claimsMessages.requiredUploadStep1)}</li>
            <li>{getContent(x => x.claimsMessages.requiredUploadStep2)}</li>
          </UL>
        </>
      );
    }

    if (isCombinationOfSBRI) {
      const competition = competitionType.replace(" ", "-").toLowerCase();

      return (
        <>
          {impactManagementParticipation !== ImpactManagementParticipation.Yes && isFinalClaim && (
            <>
              <SimpleString>{getContent(x => x.claimsMessages.finalClaimGuidanceContent1)}</SimpleString>
              <OL>
                <li>{getContent(x => x.claimsMessages.finalClaimStep1)}</li>
                <li>{getContent(x => x.claimsMessages.finalClaimStep2)}</li>
              </OL>
            </>
          )}

          {isIarRequired && <SimpleString>{getContent(x => x.claimsMessages.iarRequired)}</SimpleString>}

          <SimpleString qa={`${competition}-document-advice`}>
            {getContent(x => x.claimsMessages.sbriDocumentAdvice)}
          </SimpleString>

          <UL>
            <li>{getContent(x => x.claimsMessages.sbriInvoiceBullet1)}</li>
            <li>{getContent(x => x.claimsMessages.sbriInvoiceBullet2)}</li>
            <li>{getContent(x => x.claimsMessages.sbriInvoiceBullet3)}</li>
          </UL>

          <SimpleString qa={`${competition}-mo-advice`}>{getContent(x => x.claimsMessages.sbriMoAdvice)}</SimpleString>
        </>
      );
    }

    // Note: Final claim message is irrelevant if no iar is required - bail out early
    if (!isIarRequired && !isFinalClaim) return null;

    return (
      <>
        {isFinalClaim ? (
          <>
            {impactManagementParticipation !== ImpactManagementParticipation.Yes && (
              <>
                <SimpleString>{getContent(x => x.claimsMessages.finalClaimGuidanceContent1)}</SimpleString>
                <OL>
                  <li>{getContent(x => x.claimsMessages.finalClaimStep1)}</li>
                  <li>{getContent(x => x.claimsMessages.finalClaimStep2)}</li>
                </OL>
              </>
            )}

            {isIarRequired && (
              <>
                <SimpleString>{getContent(x => x.claimsMessages.iarRequired)}</SimpleString>
                <SimpleString>{getContent(x => x.claimsMessages.iarRequiredPara2)}</SimpleString>
              </>
            )}
          </>
        ) : (
          <>
            <SimpleString qa="iarText">{getContent(x => x.claimsMessages.iarRequired)}</SimpleString>
            <SimpleString>{getContent(x => x.claimsMessages.iarRequiredPara2)}</SimpleString>
          </>
        )}
      </>
    );
  };

  const adviceContent = getAdvice();

  return adviceContent ? (
    <Section>
      <div data-qa="iarText">{adviceContent}</div>
    </Section>
  ) : null;
}
