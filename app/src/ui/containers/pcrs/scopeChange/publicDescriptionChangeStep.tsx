import React from "react";
import * as ACC from "@ui/components";
import { PCRItemForScopeChangeDto } from "@framework/dtos";
import { EditorStatus } from "@ui/redux";
import { StepProps } from "../workflow";
import { scopeChangeWorkflow } from "./scopeChangeWorkflow";

export const PublicDescriptionChangeStep = (props: StepProps<typeof scopeChangeWorkflow>) => {
    const Form = ACC.TypedForm<PCRItemForScopeChangeDto>();

    return (
      <ACC.Section qa="newDescriptionSection">
        <Form.Form
          data={props.pcrItem}
          isSaving={props.status === EditorStatus.Saving}
          onChange={dto => props.onChange(dto)}
          onSubmit={() => props.onSave()}
        >
          <Form.Fieldset heading="Proposed public description">
            <ACC.Info summary="Published public description"><ACC.Renderers.SimpleString multiline={true}>{props.pcrItem.publicDescriptionSnapshot || "No public description available."}</ACC.Renderers.SimpleString></ACC.Info>
            <Form.MultilineString
              name="description"
              value={m => m.publicDescription}
              update={(m, v) => m.publicDescription = v}
              validation={props.validator.publicDescription}
              qa="newDescription"
              rows={15}
            />
          </Form.Fieldset>
          <Form.Submit>Save and continue</Form.Submit>
        </Form.Form>
      </ACC.Section>
    );
};
