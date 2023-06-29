import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { EditorStatus } from "@ui/redux/constants/enums";
import { PCRProjectLocation } from "@framework/constants/pcrConstants";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm, SelectOption } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { useStores } from "@ui/redux/storesProvider";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { Option } from "@framework/dtos/option";
import { Loader } from "@ui/components/bjss/loading";

interface InnerProps {
  pcrProjectLocation: Option<PCRProjectLocation>[];
}

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();

const InnerContainer = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator> & InnerProps,
) => {
  const projectLocationOptions: SelectOption[] = props.pcrProjectLocation
    .filter(x => x.active)
    .map(x => ({ id: x.value.toString(), value: x.label }));

  const selectedProjectLocationOption =
    props.pcrItem.projectLocation &&
    projectLocationOptions.find(x => parseInt(x.id, 10) === props.pcrItem.projectLocation);

  return (
    <Section title={x => x.pcrAddPartnerLabels.projectLocationHeading}>
      <Form.Form
        qa="addPartnerForm"
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onSubmit={() => props.onSave(false)}
        onChange={dto => props.onChange(dto)}
      >
        <Form.Fieldset>
          <Form.Radio
            name="projectLocation"
            hint={x => x.pages.pcrAddPartnerProjectLocation.projectLocationGuidance}
            options={projectLocationOptions}
            inline={false}
            value={() => selectedProjectLocationOption || undefined}
            update={(x, option) => {
              if (!option) return (x.projectLocation = PCRProjectLocation.Unknown);
              x.projectLocation = parseInt(option.id, 10);
            }}
            validation={props.validator.projectLocation}
          />
        </Form.Fieldset>
        <Form.Fieldset heading={x => x.pcrAddPartnerLabels.townOrCityHeading}>
          <Form.String
            name="projectCity"
            value={dto => dto.projectCity}
            update={(x, val) => {
              x.projectCity = val;
            }}
            validation={props.validator.projectCity}
          />
        </Form.Fieldset>
        <Form.Fieldset heading={x => x.pcrAddPartnerLabels.postcodeHeading}>
          <Form.String
            name="projectPostcode"
            hint={x => x.pages.pcrAddPartnerProjectLocation.postcodeGuidance}
            value={dto => dto.projectPostcode}
            update={(x, val) => {
              x.projectPostcode = val;
            }}
            validation={props.validator.projectPostcode}
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

export const ProjectLocationStep = (
  props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>,
) => {
  const stores = useStores();

  return (
    <Loader
      pending={stores.projectChangeRequests.getPcrProjectLocations()}
      render={x => <InnerContainer pcrProjectLocation={x} {...props} />}
    />
  );
};
