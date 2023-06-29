import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm, SelectOption } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { EditorStatus } from "@ui/redux/constants/enums";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { PcrStepProps } from "../pcrWorkflow";

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();

export const OtherFundingStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const options: SelectOption[] = [
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
    <Section title={x => x.pages.pcrAddPartnerOtherFunding.formSectionTitle}>
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
