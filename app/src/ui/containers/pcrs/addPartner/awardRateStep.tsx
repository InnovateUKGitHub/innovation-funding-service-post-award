import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { EditorStatus } from "@ui/constants/enums";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/content";
import { createTypedForm } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators/pcrDtoValidator";

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();
export const AwardRateStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  return (
    <Section title={x => x.pages.pcrAddPartnerAwardRate.formSectionTitle}>
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
            <Content value={x => x.pcrItem.submitButton} />
          </Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            <Content value={x => x.pcrItem.returnToSummaryButton} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </Section>
  );
};
