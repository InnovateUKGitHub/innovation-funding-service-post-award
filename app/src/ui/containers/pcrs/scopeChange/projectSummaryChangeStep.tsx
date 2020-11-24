import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForScopeChangeDto } from "@framework/dtos";
import { EditorStatus } from "@ui/redux";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRScopeChangeItemDtoValidator } from "@ui/validators";

export const ProjectSummaryChangeStep = (props: PcrStepProps<PCRItemForScopeChangeDto, PCRScopeChangeItemDtoValidator>) => {
  const Form = ACC.TypedForm<PCRItemForScopeChangeDto>();

  return (
    <ACC.Section qa="newSummarySection">
      <Form.Form
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave()}
      >
        <Form.Fieldset headingContent={x => x.pcrScopeChangeProjectSummaryChange.projectSummaryHeading}>
          <ACC.Info summary={<ACC.Content value={x => x.pcrScopeChangeProjectSummaryChange.publishedSummary}/>}><ACC.Renderers.SimpleString multiline={true}>{props.pcrItem.projectSummarySnapshot || <ACC.Content value={x => x.pcrScopeChangeProjectSummaryChange.noAvailableSummary}/>}</ACC.Renderers.SimpleString></ACC.Info>
          <Form.MultilineString
            name="summary"
            hint={props.getRequiredToCompleteMessage()}
            value={m => m.projectSummary}
            update={(m, v) => m.projectSummary = v}
            validation={props.validator.projectSummary}
            qa="newSummary"
            rows={15}
          />
        </Form.Fieldset>
        <Form.Submit><ACC.Content value={x => x.pcrScopeChangeProjectSummaryChange.pcrItem.submitButton}/></Form.Submit>
      </Form.Form>
    </ACC.Section>
  );
};
