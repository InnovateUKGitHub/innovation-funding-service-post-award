import { PCRItemType, PCRItemStatus, disableSummaryItems } from "@framework/constants/pcrConstants";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { List } from "@ui/components/atomicDesign/atoms/List/list";
import { TaskListSection, Task } from "@ui/components/atomicDesign/molecules/TaskList/TaskList";
import { useContent } from "@ui/hooks/content.hook";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useRoutes } from "@ui/redux/routesProvider";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { getPcrItemTaskStatus } from "../utils/getPcrItemTaskStatus";
import { GetItemTasks, GetItemTaskProps } from "./GetItemTasks";

export type TaskErrors = {
  items?: RhfError[];
  reasoningStatus?: RhfError;
};

interface ProjectChangeRequestOverviewTasksProps {
  pcr: Pick<PCRDto, "id" | "reasoningStatus"> & { items: GetItemTaskProps["item"][] };
  projectId: ProjectId;
  editor?: IEditorStore<PCRDto, PCRDtoValidator>;
  editableItemTypes: PCRItemType[];
  mode: "details" | "prepare";
  rhfErrors?: TaskErrors;
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
  rhfErrors,
}: ProjectChangeRequestOverviewTasksProps) => {
  const { getContent } = useContent();
  if (!editableItemTypes.length) return null;

  // Only display PCR items that we are allowed to edit.
  const editableItems = pcr.items.filter(x => editableItemTypes.indexOf(x.type) > -1);

  return (
    <TaskListSection step={1} title={getContent(x => x.taskList.giveUsInfoSectionTitle)} qa="WhatDoYouWantToDo">
      {editableItems.map((x, i) => (
        <GetItemTasks
          item={x}
          rhfErrors={rhfErrors}
          editor={editor}
          index={i}
          pcrId={pcr.id}
          projectId={projectId}
          key={i}
          mode={mode}
        />
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
  rhfErrors,
}: ProjectChangeRequestOverviewTasksProps) => {
  const routes = useRoutes();
  const { getContent } = useContent();

  const disableSummary = pcr.items.some(x => disableSummaryItems.some(y => x.type === y));
  const editableItems = pcr.items.filter(x => editableItemTypes.indexOf(x.type) > -1);
  const stepCount = editableItems.length ? 2 : 1;

  const route = (mode === "prepare" ? routes.pcrPrepareReasoning : routes.pcrViewReasoning).getLink({
    projectId,
    pcrId: pcr.id,
    step: pcr.reasoningStatus === PCRItemStatus.ToDo ? 1 : undefined,
  });

  const rhfError = rhfErrors?.["reasoningStatus"];

  if (disableSummary) return null;

  return (
    <TaskListSection step={stepCount} title={getContent(x => x.taskList.explainSectionTitle)} qa="reasoning">
      <Task
        name={getContent(x => x.taskList.provideReasoning)}
        status={getPcrItemTaskStatus(pcr.reasoningStatus)}
        route={route}
        validation={editor ? [editor.validator.reasoningStatus, editor.validator.reasoningComments] : undefined}
        rhfError={rhfError}
        id="reasoningStatus"
      />
    </TaskListSection>
  );
};

export {
  ProjectChangeRequestOverviewTasks,
  ProjectChangeRequestOverviewTasksActions,
  ProjectChangeRequestOverviewTasksReasoning,
};
