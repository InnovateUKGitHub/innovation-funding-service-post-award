import * as ACC from "@ui/components";
import { useRoutes } from "@ui/redux";
import { useContent } from "@ui/hooks";
import { ProjectChangeRequestOverviewLog } from "./ProjectChangeRequestOverviewLog";
import { ProjectChangeRequestOverviewSummary } from "./ProjectChangeRequestOverviewSummary";
import { ProjectChangeRequestOverviewTasks } from "./ProjectChangeRequestOverviewTasks";
import { ProjectChangeRequestPrepareForm } from "./ProjectChangeRequestPrepareForm";
import { ProjectChangeRequestPrepareProps } from "./projectChangeRequestPrepare.page";
import { PCRDto } from "@framework/dtos";
import { GetItemTaskProps } from "./GetItemTasks";

const PCROverviewComponent = ({
  project,
  pcr,
  editor,
  onChange,
  statusChanges,
  editableItemTypes,
  mode,
}: ProjectChangeRequestPrepareProps) => {
  const routes = useRoutes();
  const { getContent } = useContent();
  return (
    <ACC.Page
      backLink={
        <ACC.BackLink route={routes.pcrsDashboard.getLink({ projectId: project.id })}>
          {getContent(x => x.pages.pcrOverview.backToPcrs)}
        </ACC.BackLink>
      }
      pageTitle={<ACC.Projects.Title {...project} />}
      project={project}
      validator={editor?.validator}
      error={editor?.error}
    >
      <ProjectChangeRequestOverviewSummary pcr={pcr} projectId={project.id} />
      <ProjectChangeRequestOverviewTasks
        pcr={pcr as unknown as Pick<PCRDto, "id" | "reasoningStatus"> & { items: GetItemTaskProps["item"][] }}
        projectId={project.id}
        editableItemTypes={editableItemTypes}
        editor={editor}
        mode={mode}
      />
      <ProjectChangeRequestOverviewLog statusChanges={statusChanges} />
      {editor && <ProjectChangeRequestPrepareForm editor={editor} onChange={onChange} pcr={pcr} project={project} />}
    </ACC.Page>
  );
};

export { PCROverviewComponent };
