import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { EditorStatus } from "@ui/constants/enums";
import { PCRParticipantSize } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/content";
import { createTypedForm, SelectOption } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Option } from "@framework/dtos/option";
import { Loader } from "@ui/components/loading";

interface InnerProps {
  pcrParticipantSize: Option<PCRParticipantSize>[];
}

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();

const InnerContainer = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & InnerProps,
) => {
  const sizeOptions: SelectOption[] = props.pcrParticipantSize
    .filter(x => x.active && x.value !== PCRParticipantSize.Academic)
    .map(x => ({ id: x.value.toString(), value: x.label }));

  const selectedSizeOption =
    props.pcrItem.participantSize && sizeOptions.find(x => parseInt(x.id, 10) === props.pcrItem.participantSize);

  return (
    <Section title={x => x.pages.pcrAddPartnerOrganisationDetails.sectionTitle}>
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave(false)}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset heading={x => x.pcrAddPartnerLabels.organisationSizeHeading}>
          <Content markdown value={x => x.pages.pcrAddPartnerOrganisationDetails.guidance} />
          <Form.Radio
            name="participantSize"
            options={sizeOptions}
            inline={false}
            value={() => selectedSizeOption || undefined}
            update={(x, option) => {
              if (!option) return (x.participantSize = PCRParticipantSize.Unknown);
              x.participantSize = parseInt(option.id, 10);
            }}
            validation={props.validator.participantSize}
          />
        </Form.Fieldset>
        <Form.Fieldset heading={x => x.pcrAddPartnerLabels.employeeCountHeading}>
          <Form.Numeric
            name="numberOfEmployees"
            width={4}
            value={m => m.numberOfEmployees}
            update={(m, val) => (m.numberOfEmployees = val)}
            validation={props.validator.numberOfEmployees}
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

export const OrganisationDetailsStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const stores = useStores();

  return (
    <Loader
      pending={stores.projectChangeRequests.getPcrParticipantSizes()}
      render={x => <InnerContainer {...props} pcrParticipantSize={x} />}
    />
  );
};
