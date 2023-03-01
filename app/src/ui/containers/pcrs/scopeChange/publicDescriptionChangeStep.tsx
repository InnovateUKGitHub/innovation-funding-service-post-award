import * as ACC from "@ui/components";
import { PCRItemForScopeChangeDto } from "@framework/dtos";
import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRScopeChangeItemDtoValidator } from "@ui/validators";
import { EditorStatus } from "@ui/constants/enums";

const Form = ACC.createTypedForm<PCRItemForScopeChangeDto>();

export const PublicDescriptionChangeStep = (
  props: PcrStepProps<PCRItemForScopeChangeDto, PCRScopeChangeItemDtoValidator>,
) => {
  return (
    <ACC.Section qa="newDescriptionSection">
      <Form.Form
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave(false)}
      >
        <Form.Fieldset heading={x => x.pages.pcrScopeChangePublicDescriptionChange.headingPublicDescription}>
          <ACC.Info
            summary={<ACC.Content value={x => x.pages.pcrScopeChangePublicDescriptionChange.publishedDescription} />}
          >
            <ACC.Renderers.SimpleString multiline>
              {props.pcrItem.publicDescriptionSnapshot || (
                <ACC.Content value={x => x.pages.pcrScopeChangePublicDescriptionChange.noAvailableDescription} />
              )}
            </ACC.Renderers.SimpleString>
          </ACC.Info>
          <Form.MultilineString
            name="description"
            hint={props.getRequiredToCompleteMessage()}
            value={m => m.publicDescription}
            update={(m, v) => (m.publicDescription = v)}
            validation={props.validator.publicDescription}
            qa="newDescription"
            rows={15}
            maxLength={32_000}
            characterCountOptions={{
              type: "descending",
              maxValue: 32_000,
            }}
          />
        </Form.Fieldset>
        <Form.Submit>
          <ACC.Content value={x => x.pcrItem.submitButton} />
        </Form.Submit>
      </Form.Form>
    </ACC.Section>
  );
};
