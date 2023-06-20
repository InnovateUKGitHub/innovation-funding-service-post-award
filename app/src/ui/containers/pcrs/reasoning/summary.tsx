import { Pending } from "@shared/pending";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { NavigationArrowsForPCRs } from "@ui/containers/pcrs/navigationArrows";
import { IReasoningWorkflowMetadata } from "@ui/containers/pcrs/reasoning/workflowMetadata";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { BaseProps, ContainerBase } from "../../containerBase";
import { PCRItemType, PCRStepId, PCRItemStatus } from "@framework/constants/pcrConstants";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Content } from "@ui/components/content";
import { DocumentList } from "@ui/components/documents/DocumentList";
import { createTypedForm, SelectOption } from "@ui/components/form";
import { Section } from "@ui/components/layout/section";
import { LineBreakList } from "@ui/components/renderers/lineBreakList";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Loader } from "@ui/components/loading";
import { Link } from "@ui/components/links";

export interface Props {
  projectId: ProjectId;
  pcrId: PcrId;
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

const PCRForm = createTypedForm<PCRDto>();

class PCRReasoningSummaryComponent extends ContainerBase<Props, Data> {
  render() {
    const combined = Pending.combine({
      files: this.props.files,
      editableItemTypes: this.props.editableItemTypes,
    });

    return <Loader pending={combined} render={x => this.renderContents(x.files, x.editableItemTypes)} />;
  }

  private renderContents(documents: DocumentSummaryDto[], editableItemTypes: PCRItemType[]) {
    const { editor, getStepLink, mode, pcr } = this.props;
    return (
      <Section qa="reasoning-save-and-return">
        <Section>
          <SummaryList qa="pcr_reasoning">
            <SummaryListItem label={x => x.pcrLabels.requestNumber} content={pcr.requestNumber} qa="numberRow" />
            <SummaryListItem
              label={x => x.pcrLabels.types}
              content={<LineBreakList items={pcr.items.map(x => x.shortName)} />}
              qa="typesRow"
            />
            <SummaryListItem
              label={x => x.pcrReasoningLabels.comments}
              content={<SimpleString multiline>{pcr.reasoningComments}</SimpleString>}
              qa="comments"
              validation={editor.validator.reasoningComments}
              action={
                mode === "prepare" && (
                  <Link id={editor.validator.reasoningComments.key} route={getStepLink(PCRStepId.reasoningStep)}>
                    <Content value={x => x.pages.pcrReasoningSummary.edit} />
                  </Link>
                )
              }
            />
            <SummaryListItem
              label={x => x.pcrReasoningLabels.files}
              content={
                documents.length ? (
                  <DocumentList documents={documents} qa="docs" />
                ) : (
                  <Content value={x => x.pages.pcrReasoningSummary.noDocuments} />
                )
              }
              qa="files"
              action={
                mode === "prepare" && (
                  <Link route={getStepLink(PCRStepId.filesStep)}>
                    <Content value={x => x.pages.pcrReasoningSummary.edit} />
                  </Link>
                )
              }
            />
          </SummaryList>
        </Section>
        {mode === "prepare" && this.renderCompleteForm(editor)}
        {(mode === "review" || mode === "view") && this.renderNavigationArrows(pcr, editableItemTypes)}
      </Section>
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
    const options: SelectOption[] = [{ id: "true", value: "I have finished making changes." }];
    return (
      <PCRForm.Form
        editor={editor}
        onChange={dto => this.props.onChange(dto)}
        onSubmit={() => this.props.onSave(editor.data)}
      >
        <PCRForm.Fieldset heading={x => x.pages.pcrReasoningSummary.headingMarkAsComplete}>
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
            <Content value={x => x.pcrItem.returnToRequestButton} />
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
