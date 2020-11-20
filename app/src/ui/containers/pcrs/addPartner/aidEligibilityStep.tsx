import React from "react";
import * as ACC from "@ui/components";
import { PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPartnerAdditionDto } from "@framework/dtos";

export const StateAidEligibilityStep = (props: PcrStepProps<PCRItemForPartnerAdditionDto, PCRPartnerAdditionItemDtoValidator>) => {
    const Form = ACC.TypedForm<PCRItemForPartnerAdditionDto>();
    return (
      <React.Fragment>
        <ACC.Section qa="state-aid" titleContent={x => x.pcrAddPartnerStateAidEligibilityContent.stateAidTitle}>
          <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.stateAidGuidance}/>
        </ACC.Section>
        <Form.Form qa="saveAndContinue" data={props.pcrItem} onSubmit={() => props.onSave()}>
          <Form.Fieldset>
            <Form.Submit>
              <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.pcrItem.submitButton()}/>
            </Form.Submit>
            <Form.Button name="saveAndReturnToSummary" onClick={() => props.onSave(true)}>
              <ACC.Content value={x => x.pcrAddPartnerStateAidEligibilityContent.pcrItem.returnToSummaryButton()}/>
            </Form.Button>
          </Form.Fieldset>
        </Form.Form>
      </React.Fragment>
    );
};
