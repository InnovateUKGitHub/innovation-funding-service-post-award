import React from "react";
import * as ACC from "@ui/components";
import { EditorStatus } from "@ui/redux";
import { PCRItemForScopeChangeDto, ProjectDto } from "@framework/dtos";
import { PCRScopeChangeItemDtoValidator } from "@ui/validators";
import { ProjectChangeRequestItemStatus } from "@framework/entities";

interface Props {
  project: ProjectDto;
  projectChangeRequestItem: PCRItemForScopeChangeDto;
  validator: PCRScopeChangeItemDtoValidator;
  status: EditorStatus;
  onChange: (dto: PCRItemForScopeChangeDto) => void;
  onSave: () => void;
}

export const ScopeChangeEdit = (props: Props) => {
  const Form = ACC.TypedForm<PCRItemForScopeChangeDto>();

  const options: ACC.SelectOption[] = [
    { id: "true", value: "This is ready to submit." }
  ];

  return (
    <ACC.Section>
      <Form.Form
        data={props.projectChangeRequestItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave()}
        qa="scopeChange"
      >
        <Form.Fieldset heading="Published public description">
          <Form.Custom
            name="currentDescription"
            value={m => <ACC.Renderers.SimpleString>{props.project.description}</ACC.Renderers.SimpleString>}
            update={(m, v) => { return; }}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Proposed public description">
          <Form.MultilineString
            name="description"
            value={m => m.publicDescription}
            update={(m, v) => m.publicDescription = v}
            validation={props.validator.publicDescription}
            qa="newDescription"
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Published public summary">
          <Form.Custom
            name="currentSummary"
            value={m => <ACC.Renderers.SimpleString>{props.project.summary}</ACC.Renderers.SimpleString>}
            update={(m, v) => { return; }}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Proposed public summary">
          <Form.MultilineString
            name="summary"
            value={m => m.projectSummary}
            update={(m, v) => m.projectSummary = v}
            validation={props.validator.projectSummary}
            qa="newSummary"
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Mark as complete">
          <Form.Checkboxes
            name="itemStatus"
            options={options}
            value={m => m.status === ProjectChangeRequestItemStatus.Complete ? [options[0]] : []}
            update={(m, v) => m.status = (v && v.some(x => x.id === "true")) ? ProjectChangeRequestItemStatus.Complete : ProjectChangeRequestItemStatus.Incomplete}
            validation={props.validator.status}
          />
          <Form.Submit>Save and return to request</Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
