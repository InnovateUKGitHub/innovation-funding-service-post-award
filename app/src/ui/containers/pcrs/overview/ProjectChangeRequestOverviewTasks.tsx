import { PCRItemType, PCRItemStatus } from "@framework/constants/pcrConstants";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { List } from "@ui/components/layout/list";
import { TaskListSection, Task } from "@ui/components/taskList";
import { useContent } from "@ui/hooks/content.hook";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useRoutes } from "@ui/redux/routesProvider";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { getPcrItemTaskStatus } from "../utils/getPcrItemTaskStatus";
import { GetItemTasks, GetItemTaskProps } from "./GetItemTasks";

interface ProjectChangeRequestOverviewTasksProps {
  pcr: Pick<PCRDto, "id" | "reasoningStatus"> & { items: GetItemTaskProps["item"][] };
  projectId: ProjectId;
  editor?: IEditorStore<PCRDto, PCRDtoValidator>;
  editableItemTypes: PCRItemType[];
  mode: "details" | "prepare";
}

const ProjectChangeRequestOverviewTasks = (props: ProjectChangeRequestOverviewTasksProps) => {
  return (
    <List qa="taskList">
      <ProjectChangeRequestOverviewTasksActions {...props} />
      <ProjectChangeRequestOverviewTasksReasoning {...props} />
    </List>
  );
};

const ProjectChangeRequestOverviewTasksActions = ({
  pcr,
  projectId,
  editor,
  editableItemTypes,
  mode,
}: ProjectChangeRequestOverviewTasksProps) => {
  const { getContent } = useContent();
  if (!editableItemTypes.length) return null;

  // Only display PCR items that we are allowed to edit.
  const editableItems = pcr.items.filter(x => editableItemTypes.indexOf(x.type) > -1);

  return (
    <TaskListSection step={1} title={getContent(x => x.taskList.giveUsInfoSectionTitle)} qa="WhatDoYouWantToDo">
      {editableItems.map((x, i) => (
        <GetItemTasks item={x} editor={editor} index={i} pcrId={pcr.id} projectId={projectId} key={i} mode={mode} />
      ))}
    </TaskListSection>
  );
};

const ProjectChangeRequestOverviewTasksReasoning = ({
  pcr,
  projectId,
  editor,
  editableItemTypes,
  mode,
}: ProjectChangeRequestOverviewTasksProps) => {
  const routes = useRoutes();
  const { getContent } = useContent();

  const editableItems = pcr.items.filter(x => editableItemTypes.indexOf(x.type) > -1);
  const stepCount = editableItems.length ? 2 : 1;

  const route = (mode === "prepare" ? routes.pcrPrepareReasoning : routes.pcrViewReasoning).getLink({
    projectId,
    pcrId: pcr.id,
    step: pcr.reasoningStatus === PCRItemStatus.ToDo ? 1 : undefined,
  });

  return (
    <TaskListSection step={stepCount} title={getContent(x => x.taskList.explainSectionTitle)} qa="reasoning">
      <Task
        name={getContent(x => x.taskList.provideReasoning)}
        status={getPcrItemTaskStatus(pcr.reasoningStatus)}
        route={route}
        validation={editor ? [editor.validator.reasoningStatus, editor.validator.reasoningComments] : undefined}
      />
    </TaskListSection>
  );
};

export { ProjectChangeRequestOverviewTasks };
