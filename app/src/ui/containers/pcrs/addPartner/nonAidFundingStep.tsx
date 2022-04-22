import * as ACC from "@ui/components";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";
import { useContent } from "@ui/hooks";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";

export const NonAidFundingStep = ({
  project,
  pcrItem,
  onSave,
}: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
  const { getContent } = useContent();

  const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();

  const { isKTP } = checkProjectCompetition(project.competitionType);

  return (
    <>
      <ACC.Section qa="non-aid" title={x => x.pcrAddPartnerStateAidEligibilityContent.nonAidFundingTitle}>
        {isKTP ? (
          <ACC.ValidationMessage
            messageType="info"
            message={x => x.pcrAddPartnerStateAidEligibilityContent.nonAidFundingGuidance}
          />
        ) : (
          <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.nonAidFundingGuidance} />
        )}
      </ACC.Section>

      <Form.Form qa="saveAndContinue" data={pcrItem} onSubmit={() => onSave(false)}>
        <Form.Fieldset>
          <Form.Submit>{getContent(x => x.pcrAddPartnerStateAidEligibilityContent.pcrItem.submitButton)}</Form.Submit>

          <Form.Button name="saveAndReturnToSummary" onClick={() => onSave(true)}>
            {getContent(x => x.pcrAddPartnerStateAidEligibilityContent.pcrItem.returnToSummaryButton)}
          </Form.Button>
        </Form.Fieldset>
      </Form.Form>
    </>
  );
};
