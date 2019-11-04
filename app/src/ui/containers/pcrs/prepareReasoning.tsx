import React from "react";

import { BaseProps, ContainerBase, defineRoute } from "../containerBase";
import { ProjectDto, ProjectRole } from "@framework/types";

import * as ACC from "../../components";
import { Pending } from "@shared/pending";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { IEditorStore, StoresConsumer } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators";
import { PCRItemStatus } from "@framework/constants";

export interface ProjectChangeRequestPrepareReasoningParams {
  projectId: string;
  pcrId: string;
}

interface Data {
  project: Pending<ProjectDto>;
  pcr: Pending<PCRDto>;
  editor: Pending<IEditorStore<PCRDto, PCRDtoValidator>>;
  files: Pending<DocumentSummaryDto[]>;
}

interface Callbacks {
  onChange: (save: boolean, dto: PCRDto) => void;
}

class PCRPrepareReasoningComponent extends ContainerBase<ProjectChangeRequestPrepareReasoningParams, Data, Callbacks> {
  render() {
    const combined = Pending.combine({
      project: this.props.project,
      pcr: this.props.pcr,
      editor: this.props.editor,
      files: this.props.files,
    });

    return <ACC.PageLoader pending={combined} render={x => this.renderContents(x.project, x.pcr, x.editor, x.files)} />;
  }

  private renderContents(project: ProjectDto, pcr: PCRDto, editor: IEditorStore<PCRDto, PCRDtoValidator>, documents: DocumentSummaryDto[]) {
    const PCRForm = ACC.TypedForm<PCRDto>();

    const reasoningHint = (
      <ACC.Renderers.SimpleString>
        You must explain each change. Be brief and write clearly.<br />
        If you are requesting a reallocation of project costs, you must justify each change to your costs.
      </ACC.Renderers.SimpleString>
    );

    const options: ACC.SelectOption[] = [
      { id: "true", value: "I have finished making changes." }
    ];

    return (
      <ACC.Page
        backLink={<ACC.BackLink route={this.props.routes.pcrPrepare.getLink({ projectId: this.props.projectId, pcrId: this.props.pcrId })}>Back to request</ACC.BackLink>}
        pageTitle={<ACC.Projects.Title project={project} />}
        project={project}
        validator={[editor.validator]}
        error={editor.error}
      >
        <ACC.Renderers.Messages messages={this.props.messages} />

        <ACC.Section>
          <ACC.SummaryList qa="pcr-prepareReasoning">
            <ACC.SummaryListItem label="Request number" content={pcr.requestNumber} qa="numberRow" />
            <ACC.SummaryListItem label="Types" content={<ACC.Renderers.LineBreakList items={pcr.items.map(x => x.shortName)} />} qa="typesRow" />
          </ACC.SummaryList>
        </ACC.Section>

        { this.renderGuidanceSection(pcr) }

        <ACC.Section qa="reasoning-save-and-return">
          <PCRForm.Form
            editor={editor}
            onChange={dto => this.onChange(dto)}
            onSubmit={() => this.onSave(editor.data)}
          >
            <PCRForm.Fieldset heading="Reasoning">
              <PCRForm.MultilineString
                name="reasoningComments"
                label="Reasoning"
                labelHidden={true}
                hint={reasoningHint}
                qa="reason"
                value={m => m.reasoningComments}
                update={(m, v) => m.reasoningComments = v || ""}
                validation={editor.validator.reasoningComments}
                rows={15}
              />
            </PCRForm.Fieldset>
            <ACC.Section title="Files uploaded">
              {
                documents.length > 0 ?
                  <ACC.DocumentList documents={documents} qa="supporting-documents" /> :
                  <ACC.ValidationMessage messageType="info" message="No files uploaded" />
              }
              <ACC.Link styling="SecondaryButton" route={this.props.routes.pcrPrepareReasoningFiles.getLink({ projectId: pcr.projectId, pcrId: pcr.id })}>Upload and remove documents</ACC.Link>
            </ACC.Section>
            <PCRForm.Fieldset heading="Mark as complete">
              <PCRForm.Checkboxes
                name="reasoningStatus"
                options={options}
                value={m => m.reasoningStatus === PCRItemStatus.Complete ? [options[0]] : []}
                update={(m, v) => m.reasoningStatus = (v && v.some(x => x.id === "true")) ? PCRItemStatus.Complete : PCRItemStatus.Incomplete}
                validation={editor.validator.reasoningStatus}
              />
              <PCRForm.Submit>Save and return to request</PCRForm.Submit>
            </PCRForm.Fieldset>
          </PCRForm.Form>
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderGuidanceSection(pcr: PCRDto) {
    if (!pcr.guidance) return null;
    return (
      <ACC.Section qa="guidance">
        <ACC.Renderers.SimpleString>{pcr.guidance}</ACC.Renderers.SimpleString>
      </ACC.Section>
    );
  }

  private onChange(dto: PCRDto): void {
    this.props.onChange(false, dto);
  }

  private onSave(dto: PCRDto): void {
    if (dto.reasoningStatus === PCRItemStatus.ToDo) {
      dto.reasoningStatus = PCRItemStatus.Incomplete;
    }
    this.props.onChange(true, dto);
  }
}

const PCRPrepareReasoningContainer = (props: ProjectChangeRequestPrepareReasoningParams & BaseProps) => (
  <StoresConsumer>
    {stores => (
      <PCRPrepareReasoningComponent
        project={stores.projects.getById(props.projectId)}
        pcr={stores.projectChangeRequests.getById(props.projectId, props.pcrId)}
        editor={stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId)}
        files={stores.documents.pcrOrPcrItemDocuments(props.projectId, props.pcrId)}
        onChange={(save, dto) => {
          stores.messages.clearMessages();
          stores.projectChangeRequests.updatePcrEditor(save, props.projectId, dto, undefined, ({ projectId, id }) => stores.navigation.navigateTo(props.routes.pcrPrepare.getLink({ projectId, pcrId: id })));
        }}
        {...props}
      />
    )}
  </StoresConsumer>
);

export const ProjectChangeRequestPrepareReasoningRoute = defineRoute({
  routeName: "projectChangeRequestPrepareReasoning",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/reasoning",
  container: PCRPrepareReasoningContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    pcrId: route.params.pcrId
  }),
  getTitle: () => ({
    htmlTitle: "Provide reasoning to Innovate UK",
    displayTitle: "Provide reasoning to Innovate UK"
  }),
  accessControl: (auth, { projectId }, config) => config.features.pcrsEnabled && auth.forProject(projectId).hasRole(ProjectRole.ProjectManager)
});
