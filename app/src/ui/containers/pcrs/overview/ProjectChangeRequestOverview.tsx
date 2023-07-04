import { ProjectChangeRequestOverviewLog } from "./ProjectChangeRequestOverviewLog";
import { ProjectChangeRequestOverviewSummary } from "./ProjectChangeRequestOverviewSummary";
import { ProjectChangeRequestOverviewTasks } from "./ProjectChangeRequestOverviewTasks";
import { ProjectChangeRequestPrepareForm } from "./ProjectChangeRequestPrepareForm";
// import { ProjectChangeRequestPrepareProps } from "./projectChangeRequestPrepare.page";
import { GetItemTaskProps } from "./GetItemTasks";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { Page } from "@ui/components/layout/page";
import { BackLink } from "@ui/components/links";
import { Title } from "@ui/components/projects/title";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/redux/routesProvider";

const PCROverviewComponent = ({
  project,
  pcr,
  editor,
  onChange,
  statusChanges,
  editableItemTypes,
  mode,
}: AnyObject) => {
  const routes = useRoutes();
  const { getContent } = useContent();
  return (
    <Page
      backLink={
        <BackLink route={routes.pcrsDashboard.getLink({ projectId: project.id })}>
          {getContent(x => x.pages.pcrOverview.backToPcrs)}
        </BackLink>
      }
      pageTitle={<Title {...project} />}
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
    </Page>
  );
};

export { PCROverviewComponent };
