import { EditorStatus } from "@ui/redux/constants/enums";
import { PcrStepProps } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { useContent } from "@ui/hooks/content.hook";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

const Form = createTypedForm<PCRItemForPartnerAdditionDto>();

export const NonAidFundingStep = ({
  project,
  pcrItem,
  onSave,
  status,
}: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
  const { getContent } = useContent();

  const { isKTP } = checkProjectCompetition(project.competitionType);

  return (
    <>
      <Section qa="non-aid" title={x => x.pages.pcrAddPartnerStateAidEligibility.formSectionTitleNonAidFunding}>
        {isKTP ? (
          <ValidationMessage
            messageType="info"
            message={x => x.pages.pcrAddPartnerStateAidEligibility.guidanceNonAidFunding}
          />
        ) : (
          <Content markdown value={x => x.pages.pcrAddPartnerStateAidEligibility.guidanceNonAidFunding} />
        )}
      </Section>

      <Form.Form
        qa="saveAndContinue"
        data={pcrItem}
        onSubmit={() => onSave(false)}
        isSaving={status === EditorStatus.Saving}
      >
        <Form.Fieldset>
          <Form.Submit>{getContent(x => x.pcrItem.submitButton)}</Form.Submit>

          <Form.Button name="saveAndReturnToSummary" onClick={() => onSave(true)}>
            {getContent(x => x.pcrItem.returnToSummaryButton)}
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </>
  );
};
