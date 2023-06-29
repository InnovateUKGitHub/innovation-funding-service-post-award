import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();
export const StateAidEligibilityStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  return (
    <>
      <Section qa="state-aid" title={x => x.pages.pcrAddPartnerStateAidEligibility.formSectionTitleStateAid}>
        <Content markdown value={x => x.pages.pcrAddPartnerStateAidEligibility.guidanceStateAid} />
      </Section>
      <Form.Form qa="saveAndContinue" data={props.pcrItem} onSubmit={() => props.onSave(false)}>
        <Form.Fieldset>
          <Form.Submit>
            <Content value={x => x.pcrItem.submitButton} />
          </Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            <Content value={x => x.pcrItem.returnToSummaryButton} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </>
  );
};
