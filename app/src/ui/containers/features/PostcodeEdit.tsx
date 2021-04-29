import { ContentSelector } from "@content/content";
import { PartnerDto } from "@framework/dtos";
import { useContent } from "@ui/hooks";
import { IEditorStore } from "@ui/redux";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import * as ACC from "../../components";

interface PostcodeProps {
  partner: PartnerDto;
  editor: IEditorStore<PartnerDto, PartnerDtoValidator>;
  onUpdate: (saving: boolean, dto: PartnerDto) => void;
  saveButtonContent: string | ContentSelector;
  displayCurrentPostcode: boolean;
}

export function PostcodeEdit({ editor, onUpdate, saveButtonContent, ...rest }: PostcodeProps) {
  const PostcodeForm = ACC.TypedForm<PartnerDto>();
  const { getContent } = useContent();

  return (
    <PostcodeForm.Form editor={editor} onSubmit={() => onUpdate(true, editor.data)} qa="partnerDetailsForm" {...rest}>
      <PostcodeForm.Fieldset>
        {rest.displayCurrentPostcode && (
          <PostcodeForm.Custom
            name="current-partner-postcode-value"
            labelContent={x => x.features.postcode.currentPostcodeLabel}
            value={x => <ACC.Renderers.SimpleString>{x.postcode}</ACC.Renderers.SimpleString>}
            update={() => null}
          />
        )}
        <PostcodeForm.String
          name="new-partner-postcode-value"
          hintContent={x => x.features.postcode.newPostcodeHint}
          width="one-quarter"
          value={() => editor.data.postcode}
          labelContent={x => x.features.postcode.newPostcodeLabel}
          update={(m, val) => (editor.data.postcode = val!)}
        />
      </PostcodeForm.Fieldset>

      <PostcodeForm.Fieldset>
        <PostcodeForm.Submit>{getContent(saveButtonContent)}</PostcodeForm.Submit>
      </PostcodeForm.Fieldset>
    </PostcodeForm.Form>
  );
}
