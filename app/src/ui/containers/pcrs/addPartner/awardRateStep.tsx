import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { Content } from "@ui/components";
import { EditorStatus } from "@ui/constants/enums";

const Form = ACC.createTypedForm<PCRItemForPartnerAdditionDto>();
export const AwardRateStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  return (
    <ACC.Section title={x => x.pages.pcrAddPartnerAwardRate.formSectionTitle}>
      <Content markdown value={x => x.pages.pcrAddPartnerAwardRate.guidance} />
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave(false)}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset>
          <Form.Numeric
            name="awardRate"
            value={dto => dto.awardRate}
            update={(x, val) => {
              x.awardRate = val;
            }}
            width={4}
            validation={props.validator.awardRate}
          />
        </Form.Fieldset>
        <Form.Fieldset qa="save-and-continue">
          <Form.Submit>
            <ACC.Content value={x => x.pcrItem.submitButton} />
          </Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            <Content value={x => x.pcrItem.returnToSummaryButton} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
