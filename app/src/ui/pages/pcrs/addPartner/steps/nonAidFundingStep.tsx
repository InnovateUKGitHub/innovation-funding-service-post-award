import { useContent } from "@ui/hooks/content.hook";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { Content } from "@ui/components/molecules/Content/content";
import { Section } from "@ui/components/molecules/Section/section";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useAddPartnerWorkflowQuery } from "../addPartner.logic";
import { PcrPage } from "../../pcrPage";
import { useNextLink, useSummaryLink } from "../../utils/useNextLink";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Link } from "@ui/components/atoms/Links/links";

export const NonAidFundingStep = () => {
  const { getContent } = useContent();
  const { projectId, itemId, fetchKey } = usePcrWorkflowContext();
  const { project } = useAddPartnerWorkflowQuery(projectId, itemId, fetchKey);
  const { isKTP } = checkProjectCompetition(project.competitionType);
  const nextLink = useNextLink();
  const summaryLink = useSummaryLink();
  return (
    <PcrPage>
      <Section qa="non-aid" title={x => x.pages.pcrAddPartnerStateAidEligibility.formSectionTitleNonAidFunding}>
        {isKTP ? (
          <ValidationMessage
            messageType="info"
            message={x => x.pages.pcrAddPartnerStateAidEligibility.guidanceNonAidFunding}
          />
        ) : (
          <Content markdown value={x => x.pages.pcrAddPartnerStateAidEligibility.guidanceNonAidFunding} />
        )}
      </Section>

      <Form>
        <Fieldset>
          <Link route={nextLink} styling="PrimaryButton">
            {getContent(x => x.pcrItem.submitButton)}
          </Link>

          <Link route={summaryLink} styling="SecondaryButton">
            {getContent(x => x.pcrItem.saveAndReturnToSummaryButton)}
          </Link>
        </Fieldset>
      </Form>
    </PcrPage>
  );
};
