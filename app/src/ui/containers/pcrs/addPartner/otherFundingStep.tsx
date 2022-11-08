import * as ACC from "@ui/components";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { Content } from "@ui/components";
import { EditorStatus } from "@ui/constants/enums";

const Form = ACC.createTypedForm<PCRItemForPartnerAdditionDto>();

export const OtherFundingStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const options: ACC.SelectOption[] = [
    {
      id: "true",
      value: <Content value={x => x.pcrAddPartnerLabels.otherFundsYes} />,
    },
    {
      id: "false",
      value: <Content value={x => x.pcrAddPartnerLabels.otherFundsNo} />,
    },
  ];

  return (
    <ACC.Section title={x => x.pages.pcrAddPartnerOtherFunding.formSectionTitle}>
      <Content markdown value={x => x.pages.pcrAddPartnerOtherFunding.guidance} />
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave(false)}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset>
          <Form.Radio
            name="hasOtherFunding"
            label={x => x.pages.pcrAddPartnerOtherFunding.labelOtherSourcesQuestion}
            labelHidden
            options={options}
            inline={false}
            value={dto => {
              if (dto.hasOtherFunding === null || dto.hasOtherFunding === undefined) return null;
              return options.find(x => x.id === dto?.hasOtherFunding?.toString());
            }}
            update={(dto, option) => {
              if (!option) return (dto.hasOtherFunding = null);
              dto.hasOtherFunding = option.id === "true";
            }}
            validation={props.validator.hasOtherFunding}
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
