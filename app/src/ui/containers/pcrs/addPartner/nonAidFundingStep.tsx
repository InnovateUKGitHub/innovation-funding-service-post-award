import * as ACC from "@ui/components";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { useContent } from "@ui/hooks";

export const NonAidFundingStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const { getContent } = useContent();

  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
  return (
    <>
      <ACC.Section qa="non-aid" title={x => x.pcrAddPartnerStateAidEligibilityContent.nonAidFundingTitle}>
        <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.nonAidFundingGuidance} />
      </ACC.Section>

      <Form.Form qa="saveAndContinue" data={props.pcrItem} onSubmit={() => props.onSave(false)}>
        <Form.Fieldset>
          <Form.Submit>{getContent(x => x.pcrAddPartnerStateAidEligibilityContent.pcrItem.submitButton)}</Form.Submit>

          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            {getContent(x => x.pcrAddPartnerStateAidEligibilityContent.pcrItem.returnToSummaryButton)}
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </>
  );
};
