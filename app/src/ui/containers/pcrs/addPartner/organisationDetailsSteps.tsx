import * as ACC from "@ui/components";
import { Option, PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { useStores } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PCRParticipantSize } from "@framework/constants";
import { EditorStatus } from "@ui/constants/enums";
import { SimpleString } from "@ui/components/renderers";

interface InnerProps {
  pcrParticipantSize: Option<PCRParticipantSize>[];
}

const Form = ACC.createTypedForm<PCRItemForPartnerAdditionDto>();

const InnerContainer = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & InnerProps,
) => {
  const sizeOptions: ACC.SelectOption[] = props.pcrParticipantSize
    .filter(x => x.active && x.value !== PCRParticipantSize.Academic)
    .map(x => ({ id: x.value.toString(), value: x.label }));

  const selectedSizeOption =
    props.pcrItem.participantSize && sizeOptions.find(x => parseInt(x.id, 10) === props.pcrItem.participantSize);

  return (
    <ACC.Section title={x => x.pages.pcrAddPartnerOrganisationDetails.sectionTitle}>
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave(false)}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset heading={x => x.pcrAddPartnerLabels.organisationSizeHeading}>
          <ACC.Content markdown value={x => x.pages.pcrAddPartnerOrganisationDetails.guidance} />
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
            <ACC.Content value={x => x.pcrItem.submitButton} />
          </Form.Submit>
          <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
            <ACC.Content value={x => x.pcrItem.returnToSummaryButton} />
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};

export const OrganisationDetailsStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const stores = useStores();

  return (
    <ACC.Loader
      pending={stores.projectChangeRequests.getPcrParticipantSizes()}
      render={x => <InnerContainer {...props} pcrParticipantSize={x} />}
    />
  );
};
