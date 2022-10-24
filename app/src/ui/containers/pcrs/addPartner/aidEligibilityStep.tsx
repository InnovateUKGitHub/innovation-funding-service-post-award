import * as ACC from "@ui/components";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";

export const StateAidEligibilityStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  return (
    <>
      <ACC.Section qa="state-aid" title={x => x.pages.pcrAddPartnerStateAidEligibility.formSectionTitleStateAid}>
        <ACC.Content markdown value={x => x.pages.pcrAddPartnerStateAidEligibility.guidanceStateAid} />
      </ACC.Section>
      <Form.Form qa="saveAndContinue" data={props.pcrItem} onSubmit={() => props.onSave(false)}>
        <Form.Fieldset>
          <Form.Submit>
            <ACC.Content value={x => x.pcrItem.submitButton} />
          </Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            <ACC.Content value={x => x.pcrItem.returnToSummaryButton} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </>
  );
};
