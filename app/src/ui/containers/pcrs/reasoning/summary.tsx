import { ILinkInfo, PCRItemStatus, PCRItemType } from "@framework/types";
import { Pending } from "@shared/pending";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IEditorStore, useStores } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import { NavigationArrowsForPCRs } from "@ui/containers/pcrs/navigationArrows";
import { IReasoningWorkflowMetadata } from "@ui/containers/pcrs/reasoning/workflowMetadata";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import * as ACC from "../../../components";
import { BaseProps, ContainerBase } from "../../containerBase";

export interface Props {
  projectId: string;
  pcrId: string;
  pcr: PCRDto;
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  mode: "review" | "view" | "prepare";
  onChange: (dto: PCRDto) => void;
  onSave: (dto: PCRDto) => void;
  getStepLink: (stepName: IReasoningWorkflowMetadata["stepName"]) => ILinkInfo;
}

interface Data {
  files: Pending<DocumentSummaryDto[]>;
  editableItemTypes: Pending<PCRItemType[]>;
}

class PCRReasoningSummaryComponent extends ContainerBase<Props, Data> {
  render() {
    const combined = Pending.combine({
      files: this.props.files,
      editableItemTypes: this.props.editableItemTypes,
    });

    return <ACC.Loader pending={combined} render={x => this.renderContents(x.files, x.editableItemTypes)} />;
  }

  private renderContents(documents: DocumentSummaryDto[], editableItemTypes: PCRItemType[]) {
    const { editor, getStepLink, mode, pcr } = this.props;
    return (
      <ACC.Section qa="reasoning-save-and-return">
        <ACC.Section>
          <ACC.SummaryList qa="pcr_reasoning">
            <ACC.SummaryListItem
              label={x => x.pcrReasoningSummary.labels.requestNumber}
              content={pcr.requestNumber}
              qa="numberRow"
            />
            <ACC.SummaryListItem
              label={x => x.pcrReasoningSummary.labels.types}
              content={<ACC.Renderers.LineBreakList items={pcr.items.map(x => x.shortName)} />}
              qa="typesRow"
            />
            <ACC.SummaryListItem
              label={x => x.pcrReasoningSummary.labels.comments}
              content={
                <ACC.Renderers.SimpleString multiline>{pcr.reasoningComments}</ACC.Renderers.SimpleString>
              }
              qa="comments"
              validation={editor.validator.reasoningComments}
              action={
                mode === "prepare" && (
                  <ACC.Link id={editor.validator.reasoningComments.key} route={getStepLink("reasoningStep")}>
                    <ACC.Content value={x => x.pcrReasoningSummary.edit} />
                  </ACC.Link>
                )
              }
            />
            <ACC.SummaryListItem
              label={x => x.pcrReasoningSummary.labels.files}
              content={
                documents.length ? (
                  <ACC.DocumentList documents={documents} qa="docs" />
                ) : (
                  <ACC.Content value={x => x.pcrReasoningSummary.noDocuments} />
                )
              }
              qa="files"
              action={
                mode === "prepare" && (
                  <ACC.Link route={getStepLink("filesStep")}>
                    <ACC.Content value={x => x.pcrReasoningSummary.edit} />
                  </ACC.Link>
                )
              }
            />
          </ACC.SummaryList>
        </ACC.Section>
        {mode === "prepare" && this.renderCompleteForm(editor)}
        {(mode === "review" || mode === "view") && this.renderNavigationArrows(pcr, editableItemTypes)}
      </ACC.Section>
    );
  }

  private renderNavigationArrows(pcr: PCRDto, editableItemTypes: PCRItemType[]) {
    return (
      <NavigationArrowsForPCRs
        pcr={pcr}
        currentItem={null}
        isReviewing={this.props.mode === "review"}
        editableItemTypes={editableItemTypes}
        routes={this.props.routes}
      />
    );
  }

  private renderCompleteForm(editor: IEditorStore<PCRDto, PCRDtoValidator>) {
    const PCRForm = ACC.TypedForm<PCRDto>();

    const options: ACC.SelectOption[] = [{ id: "true", value: "I have finished making changes." }];
    return (
      <PCRForm.Form
        editor={editor}
        onChange={dto => this.props.onChange(dto)}
        onSubmit={() => this.props.onSave(editor.data)}
      >
        <PCRForm.Fieldset heading={x => x.pcrReasoningSummary.markAsCompleteHeading}>
          <PCRForm.Checkboxes
            name="reasoningStatus"
            options={options}
            value={m => (m.reasoningStatus === PCRItemStatus.Complete ? [options[0]] : [])}
            update={(m, v) =>
              (m.reasoningStatus =
                v && v.some(x => x.id === "true") ? PCRItemStatus.Complete : PCRItemStatus.Incomplete)
            }
            validation={editor.validator.reasoningStatus}
          />
        </PCRForm.Fieldset>
        <PCRForm.Fieldset qa="submit-button">
          <PCRForm.Submit>
            <ACC.Content value={x => x.pcrReasoningSummary.pcrItem.returnToRequestButton} />
          </PCRForm.Submit>
        </PCRForm.Fieldset>
      </PCRForm.Form>
    );
  }
}

export const PCRReasoningSummary = (props: Props & BaseProps) => {
  const stores = useStores();

  return (
    <PCRReasoningSummaryComponent
      {...props}
      files={stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrId)}
      editableItemTypes={stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId)}
    />
  );
};
