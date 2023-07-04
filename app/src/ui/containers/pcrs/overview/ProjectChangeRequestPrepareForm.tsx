import { PCRStatus } from "@framework/constants/pcrConstants";
import { ProjectMonitoringLevel } from "@framework/constants/project";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { ProjectDto } from "@framework/dtos/projectDto";
import { createTypedForm } from "@ui/components/form";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { useProjectParticipants } from "@ui/features/project-participants";
import { useContent } from "@ui/hooks/content.hook";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";

const Form = createTypedForm<PCRDto>();

const ProjectChangeRequestPrepareForm = ({
  pcr,
  project,
  editor,
  onChange,
}: {
  pcr: Pick<PCRDto, "status">;
  project: Pick<ProjectDto, "monitoringLevel">;
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  onChange: (save: boolean, dto: PCRDto) => void;
}) => {
  const state = useProjectParticipants();
  const { getContent } = useContent();

  const onSave = (submit: boolean) => {
    const dto = editor.data;
    if (submit) {
      switch (pcr.status) {
        case PCRStatus.Draft:
        case PCRStatus.QueriedByMonitoringOfficer:
          if (project.monitoringLevel === ProjectMonitoringLevel.InternalAssurance) {
            dto.status = PCRStatus.SubmittedToInnovateUK;
          } else {
            dto.status = PCRStatus.SubmittedToMonitoringOfficer;
          }
          break;
        case PCRStatus.QueriedByInnovateUK:
          dto.status = PCRStatus.SubmittedToInnovateUK;
          break;
        default:
          dto.status = pcr.status;
          break;
      }
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
