import * as ACC from "@ui/components";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { EditorStatus } from "@ui/constants/enums";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { useContent } from "@ui/hooks";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";

export const NonAidFundingStep = ({
  project,
  pcrItem,
  onSave,
  status,
}: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
  const { getContent } = useContent();

  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();

  const { isKTP } = checkProjectCompetition(project.competitionType);

  return (
    <>
      <ACC.Section qa="non-aid" title={x => x.pages.pcrAddPartnerStateAidEligibility.formSectionTitleNonAidFunding}>
        {isKTP ? (
          <ACC.ValidationMessage
            messageType="info"
            message={x => x.pages.pcrAddPartnerStateAidEligibility.guidanceNonAidFunding}
          />
        ) : (
          <ACC.Content markdown value={x => x.pages.pcrAddPartnerStateAidEligibility.guidanceNonAidFunding} />
        )}
      </ACC.Section>

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
