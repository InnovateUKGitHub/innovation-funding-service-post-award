import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForScopeChangeDto } from "@framework/dtos";
import { EditorStatus } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRScopeChangeItemDtoValidator } from "@ui/validators";

export const PublicDescriptionChangeStep = (props: PcrStepProps<PCRItemForScopeChangeDto, PCRScopeChangeItemDtoValidator>) => {
    const Form = ACC.TypedForm<PCRItemForScopeChangeDto>();

    return (
      <ACC.Section qa="newDescriptionSection">
        <Form.Form
          data={props.pcrItem}
          isSaving={props.status === EditorStatus.Saving}
          onChange={dto => props.onChange(dto)}
          onSubmit={() => props.onSave()}
        >
          <Form.Fieldset headingContent={x => x.pcrScopeChangePublicDescriptionChange.publicDescriptionHeading}>
            <ACC.Info summary={<ACC.Content value={x => x.pcrScopeChangePublicDescriptionChange.publishedDescription}/>}><ACC.Renderers.SimpleString multiline={true}>{props.pcrItem.publicDescriptionSnapshot || <ACC.Content value={x => x.pcrScopeChangePublicDescriptionChange.noAvailableDescription}/>}</ACC.Renderers.SimpleString></ACC.Info>
            <Form.MultilineString
              name="description"
              hint={props.getRequiredToCompleteMessage()}
              value={m => m.publicDescription}
              update={(m, v) => m.publicDescription = v}
              validation={props.validator.publicDescription}
              qa="newDescription"
              rows={15}
            />
          </Form.Fieldset>
          <Form.Submit><ACC.Content value={x => x.pcrScopeChangeProjectSummaryChange.pcrItem.submitButton()}/></Form.Submit>
        </Form.Form>
      </ACC.Section>
    );
};
