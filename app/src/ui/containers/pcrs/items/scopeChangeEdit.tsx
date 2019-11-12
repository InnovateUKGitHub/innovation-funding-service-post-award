import React from "react";
import * as ACC from "@ui/components";
import { EditorStatus } from "@ui/redux";
import { PCRItemForScopeChangeDto, ProjectDto } from "@framework/dtos";
import { PCRScopeChangeItemDtoValidator } from "@ui/validators";
import { PCRItemStatus } from "@framework/constants";

interface Props {
  projectChangeRequestItem: PCRItemForScopeChangeDto;
  validator: PCRScopeChangeItemDtoValidator;
  status: EditorStatus;
  onChange: (dto: PCRItemForScopeChangeDto) => void;
  onSave: () => void;
}

export const ScopeChangeEdit = (props: Props) => {
  const Form = ACC.TypedForm<PCRItemForScopeChangeDto>();

  const options: ACC.SelectOption[] = [
    { id: "true", value: "I have finished making changes." }
  ];

  const renderGuidanceText = () => (
    <ACC.Renderers.SimpleString>
      Your public description is published in line with government practice on openness and transparency of public-funded activities. It should describe your project in a way that will be easy for a non-specialist to understand. Do not include any information that is confidential, for example, intellectual property or patent details.
      <br/>
      <br/>
      Your project summary should provide a clear overview of the whole project, including:
        <ul className="govuk-list govuk-list--bullet">
          <li>your vision for the project</li>
          <li>key objectives</li>
          <li>main areas of focus</li>
          <li>details of how it is innovative</li>
        </ul>
    </ACC.Renderers.SimpleString>
  );

  return (
    <ACC.Section>
      <Form.Form
        data={props.projectChangeRequestItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave()}
        qa="scopeChange"
      >
        {renderGuidanceText()}
        <Form.Fieldset heading="Proposed public description">
          <ACC.Info summary="Published public description"><ACC.Renderers.SimpleString multiline={true}>{props.projectChangeRequestItem.publicDescriptionSnapshot || "No public description available."}</ACC.Renderers.SimpleString></ACC.Info>
          <Form.MultilineString
            name="description"
            value={m => m.publicDescription}
            update={(m, v) => m.publicDescription = v}
            validation={props.validator.publicDescription}
            qa="newDescription"
            rows={15}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Proposed project summary">
          <ACC.Info summary="Published project summary"><ACC.Renderers.SimpleString multiline={true}>{props.projectChangeRequestItem.projectSummarySnapshot || "No project summary available."}</ACC.Renderers.SimpleString></ACC.Info>
          <Form.MultilineString
            name="summary"
            value={m => m.projectSummary}
            update={(m, v) => m.projectSummary = v}
            validation={props.validator.projectSummary}
            qa="newSummary"
            rows={15}
          />
        </Form.Fieldset>
        <Form.Fieldset heading="Mark as complete">
          <Form.Checkboxes
            name="itemStatus"
            options={options}
            value={m => m.status === PCRItemStatus.Complete ? [options[0]] : []}
            update={(m, v) => m.status = (v && v.some(x => x.id === "true")) ? PCRItemStatus.Complete : PCRItemStatus.Incomplete}
            validation={props.validator.status}
          />
          <Form.Submit>Save and return to request</Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    </ACC.Section>
  );
};
