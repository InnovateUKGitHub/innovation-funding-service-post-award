import { PCRStatus } from "@framework/constants";
import { PCRDto } from "@framework/dtos";
import { createTypedForm } from "@ui/components";
import { SimpleString } from "@ui/components/renderers";
import { useProjectParticipants } from "@ui/features/project-participants";
import { useContent } from "@ui/hooks";
import { IEditorStore } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";

const Form = createTypedForm<PCRDto>();

const ProjectChangeRequestPrepareForm = ({
  pcr,
  editor,
  onChange,
}: {
  pcr: PCRDto;
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  onChange: (save: boolean, dto: PCRDto) => void;
}) => {
  const state = useProjectParticipants();
  const { getContent } = useContent();

  const onSave = (submit: boolean) => {
    const dto = editor.data;
    if (submit && pcr.status === PCRStatus.QueriedByInnovateUK) {
      dto.status = PCRStatus.SubmittedToInnovateUK;
    } else if (submit) {
      dto.status = PCRStatus.SubmittedToMonitoringOfficer;
    } else {
      // not submitting so set status to the original status
      dto.status = pcr.status;
    }
    onChange(true, dto);
  };

  return (
    <Form.Form editor={editor} onChange={dto => onChange(false, dto)} onSubmit={() => onSave(true)} qa="prepare-form">
      <Form.Fieldset heading={getContent(x => x.pages.pcrOverview.addComments)}>
        <Form.MultilineString
          name="comments"
          hint={getContent(x => x.pcrMessages.additionalCommentsGuidance)}
          value={x => x.comments}
          update={(m, v) => (m.comments = v || "")}
          validation={editor.validator.comments}
          characterCountOptions={{ type: "descending", maxValue: PCRDtoValidator.maxCommentsLength }}
          qa="info-text-area"
        />
      </Form.Fieldset>
      <Form.Fieldset qa="save-buttons">
        {state.isMultipleParticipants && (
          <SimpleString>{getContent(x => x.pcrMessages.submittingGuidance)}</SimpleString>
        )}

        <Form.Submit>{getContent(x => x.pages.pcrOverview.submitRequest)}</Form.Submit>
        <Form.Button name="return" onClick={() => onSave(false)}>
          {getContent(x => x.pages.pcrOverview.saveAndReturn)}
        </Form.Button>
      </Form.Fieldset>
    </Form.Form>
  );
};

export { ProjectChangeRequestPrepareForm };
