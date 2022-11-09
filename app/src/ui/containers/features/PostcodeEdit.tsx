import type { ContentSelector } from "@copy/type";
import { PartnerDto } from "@framework/dtos";
import { useContent } from "@ui/hooks";
import { IEditorStore } from "@ui/redux";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import * as ACC from "../../components";

export interface PostcodeProps {
  partner: PartnerDto;
  editor: IEditorStore<PartnerDto, PartnerDtoValidator>;
  onUpdate: (saving: boolean, dto: PartnerDto) => void;
  saveButtonContent: string | ContentSelector;
  displayCurrentPostcode: boolean;
}

const PostcodeForm = ACC.createTypedForm<PartnerDto>();

export const PostcodeEdit = ({ editor, onUpdate, saveButtonContent, ...rest }: PostcodeProps) => {
  const { getContent } = useContent();

  return (
    <PostcodeForm.Form editor={editor} onSubmit={() => onUpdate(true, editor.data)} qa="partnerDetailsForm" {...rest}>
      <PostcodeForm.Fieldset>
        {rest.displayCurrentPostcode && (
          <PostcodeForm.Custom
            name="current-partner-postcode-value"
            label={x => x.pages.partnerDetailsEdit.labelCurrentPostcode}
            value={({ formData }) => <ACC.Renderers.SimpleString>{formData.postcode}</ACC.Renderers.SimpleString>}
          />
        )}
        <PostcodeForm.String
          name="new-partner-postcode-value"
          hint={x => x.pages.partnerDetailsEdit.hintNewPostcode}
          width="one-quarter"
          value={() => editor.data.postcode}
          label={x => x.pages.partnerDetailsEdit.labelNewPostcode}
          update={(m, val) => (editor.data.postcode = val)}
        />
      </PostcodeForm.Fieldset>

      <PostcodeForm.Fieldset>
        <PostcodeForm.Submit>
          {typeof saveButtonContent === "string" ? saveButtonContent : getContent(saveButtonContent)}
        </PostcodeForm.Submit>
      </PostcodeForm.Fieldset>
    </PostcodeForm.Form>
  );
};
