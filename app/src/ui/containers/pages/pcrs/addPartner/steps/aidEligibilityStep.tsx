import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { PcrPage } from "../../pcrPage";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { useContent } from "@ui/hooks/content.hook";
import { useNextLink, useSummaryLink } from "../../utils/useNextLink";

export const StateAidEligibilityStep = () => {
  const { getContent } = useContent();
  const nextLink = useNextLink();
  const summaryLink = useSummaryLink();
  return (
    <PcrPage>
      <Section qa="state-aid" title={x => x.pages.pcrAddPartnerStateAidEligibility.formSectionTitleStateAid}>
        <Content markdown value={x => x.pages.pcrAddPartnerStateAidEligibility.guidanceStateAid} />
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
