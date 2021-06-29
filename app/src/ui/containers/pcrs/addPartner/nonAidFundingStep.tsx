import * as ACC from "@ui/components";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";

export const NonAidFundingStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  return (
    <>
      <ACC.Section qa="non-aid" title={x => x.pcrAddPartnerStateAidEligibilityContent.nonAidFundingTitle}>
        <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.nonAidFundingGuidance}/>
      </ACC.Section>
      <Form.Form qa="saveAndContinue" data={props.pcrItem} onSubmit={() => props.onSave()}>
        <Form.Fieldset>
          <Form.Submit>
            <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.pcrItem.submitButton}/>
          </Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.pcrItem.returnToSummaryButton}/>
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </>
  );
};
