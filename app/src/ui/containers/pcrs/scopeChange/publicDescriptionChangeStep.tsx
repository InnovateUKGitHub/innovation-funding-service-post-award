import { PcrStepProps } from "@ui/containers/pcrs/pcrWorkflow";
import { EditorStatus } from "@ui/constants/enums";
import { PCRItemForScopeChangeDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/content";
import { createTypedForm } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { PCRScopeChangeItemDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Info } from "@ui/components/layout/info";

const Form = createTypedForm<PCRItemForScopeChangeDto>();

export const PublicDescriptionChangeStep = (
  props: PcrStepProps<PCRItemForScopeChangeDto, PCRScopeChangeItemDtoValidator>,
) => {
  return (
    <Section qa="newDescriptionSection">
      <Form.Form
        data={props.pcrItem}
        isSaving={props.status === EditorStatus.Saving}
        onChange={dto => props.onChange(dto)}
        onSubmit={() => props.onSave(false)}
      >
        <Form.Fieldset heading={x => x.pages.pcrScopeChangePublicDescriptionChange.headingPublicDescription}>
          <Info summary={<Content value={x => x.pages.pcrScopeChangePublicDescriptionChange.publishedDescription} />}>
            <SimpleString multiline>
              {props.pcrItem.publicDescriptionSnapshot || (
                <Content value={x => x.pages.pcrScopeChangePublicDescriptionChange.noAvailableDescription} />
              )}
            </SimpleString>
          </Info>
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
          <Content value={x => x.pcrItem.submitButton} />
        </Form.Submit>
      </Form.Form>
    </Section>
  );
};
