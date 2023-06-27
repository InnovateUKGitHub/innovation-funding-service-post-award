import { useNavigate } from "react-router-dom";
import { Pending } from "@shared/pending";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { BaseProps, defineRoute } from "../containerBase";
import { ProjectRole } from "@framework/constants/project";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Page } from "@ui/components/layout/page";
import { Section } from "@ui/components/layout/section";
import { BackLink } from "@ui/components/links";
import { PageLoader } from "@ui/components/loading";
import { ShortDate } from "@ui/components/renderers/date";
import { LineBreakList } from "@ui/components/renderers/lineBreakList";
import { SummaryList, SummaryListItem } from "@ui/components/summaryList";
import { ValidationMessage } from "@ui/components/validationMessage";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Title } from "@ui/components/projects/title";
import { createTypedForm } from "@ui/components/form";

export interface PCRDeleteParams {
  projectId: ProjectId;
  pcrId: PcrId;
}

interface Data {
  project: Pick<ProjectDto, "title" | "projectNumber" | "status">;
  pcr: Pick<PCRDto, "requestNumber" | "started" | "lastUpdated"> & { items: Pick<PCRItemDto, "shortName">[] };
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
}

interface Callbacks {
  onDelete: (projectId: ProjectId, pcrId: PcrId, dto: PCRDto) => void;
}

const DeleteForm = createTypedForm<PCRDto>();

const PCRDeleteComponent = ({
  project,
  pcr,
  editor,
  projectId,
  pcrId,
  onDelete,
  routes,
}: BaseProps & Data & Callbacks & PCRDeleteParams) => {
  return (
    <Page
      backLink={
        <BackLink route={routes.pcrsDashboard.getLink({ projectId })}>Back to project change requests</BackLink>
      }
      pageTitle={<Title title={project.title} projectNumber={project.projectNumber} />}
      projectStatus={project.status}
      error={editor.error}
      validator={editor.validator}
    >
      <Section>
        <ValidationMessage messageType="alert" message="All the information will be permanently deleted." />
        <SummaryList qa="pcr_viewItem">
          <SummaryListItem label="Request number" content={pcr.requestNumber} qa="requestNumber" />
          <SummaryListItem
            label="Types"
            content={<LineBreakList items={pcr.items.map(x => x.shortName)} />}
            qa="types"
          />
          <SummaryListItem label="Started" content={<ShortDate value={pcr.started} />} qa="started" />
          <SummaryListItem label="Last updated" content={<ShortDate value={pcr.lastUpdated} />} qa="lastUpdated" />
        </SummaryList>
      </Section>

      <Section>
        <DeleteForm.Form editor={editor} qa="pcrDelete">
          <DeleteForm.Button name="delete" styling="Warning" onClick={() => onDelete(projectId, pcrId, editor.data)}>
            Delete request
          </DeleteForm.Button>
        </DeleteForm.Form>
      </Section>
    </Page>
  );
};

const PCRDeleteContainer = (props: PCRDeleteParams & BaseProps) => {
  const navigate = useNavigate();
  const stores = useStores();

  const combined = Pending.combine({
    project: stores.projects.getById(props.projectId),
    pcr: stores.projectChangeRequests.getById(props.projectId, props.pcrId),
    editor: stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId),
  });

  const onDelete = (projectId: ProjectId, pcrId: PcrId, dto: PCRDto) =>
    stores.projectChangeRequests.deletePcr(projectId, pcrId, dto, "The project change request has been deleted.", () =>
      navigate(props.routes.pcrsDashboard.getLink({ projectId }).path),
    );

  return (
    <PageLoader pending={combined} render={data => <PCRDeleteComponent {...props} {...data} onDelete={onDelete} />} />
  );
};

export const PCRDeleteRoute = defineRoute({
  routeName: "pcrDelete",
  routePath: "/projects/:projectId/pcrs/:pcrId/delete",
  container: PCRDeleteContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
  }),
  getTitle: () => ({
    htmlTitle: "Delete draft request",
    displayTitle: "Delete draft request",
  }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});
