import { useContent } from "@ui/hooks/content.hook";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { DocumentDescription } from "@framework/constants/documentDescription";
import { UL } from "@ui/components/atomicDesign/atoms/List/list";
import { ExternalLink } from "@ui/components/atomicDesign/atoms/ExternalLink/externalLink";
import { H2 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { useMemo } from "react";
import { usePcrWorkflowContext } from "../../pcrItemWorkflowMigrated";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { useNextLink, useSummaryLink } from "../../utils/useNextLink";
import { PcrPage } from "../../pcrPage";
import { FilesStep } from "../../filesStep/filesStep";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";

import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";

const useJesContent = () => {
  const { getContent } = useContent();
  return useMemo(
    () => ({
      jesApplyingViaSystemLinkContent: getContent(x => x.pages.pcrAddPartnerJes.jesListItem1LinkContent),
      jesListProcessItem2: getContent(x => x.pages.pcrAddPartnerJes.jesListItem2BeforeLink),
      jesWebsiteLinkContent: getContent(x => x.pages.pcrAddPartnerJes.jesWebsiteLinkContent),
      jesIntroduction: getContent(x => x.pages.pcrAddPartnerJes.jesIntroduction),
      jesUploadSupport: getContent(x => x.pages.pcrAddPartnerJes.jesUploadSupport),
      submitButton: getContent(x => x.pcrItem.submitButton),
      returnToSummaryButton: getContent(x => x.pcrItem.saveAndReturnToSummaryButton),
      jesHeading: getContent(x => x.pcrAddPartnerLabels.jesHeading),
      uploadInputLabel: getContent(x => x.documentLabels.uploadInputLabel),
      uploadTitle: getContent(x => x.documentMessages.uploadTitle),
    }),
    [],
  );
};

const JesGuidance = () => {
  const content = useJesContent();

  return (
    <>
      <P>{content.jesIntroduction}</P>

      <UL>
        <li>
          <ExternalLink href="https://www.gov.uk/government/publications/innovate-uk-completing-your-application-project-costs-guidance/guidance-for-academics-applying-via-the-je-s-system">
            {content.jesApplyingViaSystemLinkContent}
          </ExternalLink>
        </li>
        <li>
          {content.jesListProcessItem2}{" "}
          {<ExternalLink href="https://je-s.rcuk.ac.uk">{content.jesWebsiteLinkContent}</ExternalLink>}
        </li>
      </UL>

      <P>{content.jesUploadSupport}</P>
    </>
  );
};

export const JeSStep = () => {
  const { projectId, itemId, fetchKey } = usePcrWorkflowContext();
  const content = useJesContent();
  const { project } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);
  const { isKTP } = checkProjectCompetition(project.competitionType);

  const nextLink = useNextLink();
  const summaryLink = useSummaryLink();

  if (isKTP) {
    return (
      <PcrPage>
        <H2>{content.jesHeading}</H2>
        <ValidationMessage
          messageType="info"
          message={x => x.pages.pcrAddPartnerJes.jesIntroduction}
          qa="jes-form-ktp-not-needed-info-message"
        />

        <Fieldset>
          <Link route={nextLink} styling="PrimaryButton">
            {content.submitButton}
          </Link>

          <Link route={summaryLink} styling="SecondaryButton">
            {content.returnToSummaryButton}
          </Link>
        </Fieldset>
      </PcrPage>
    );
  }

  return (
    <FilesStep
      heading={x => x.pcrAddPartnerLabels.jesHeading}
      documentDescription={DocumentDescription.JeSForm}
      guidanceComponent={<JesGuidance />}
      returnToSummaryButton
    />
  );
};
