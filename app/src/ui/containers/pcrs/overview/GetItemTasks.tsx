import { PCRDto } from "@framework/dtos/pcrDtos";
import { PCRItemDto, PCRItemStatus } from "@framework/types";
import * as ACC from "@ui/components";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { IEditorStore, useRoutes } from "@ui/redux";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { usePcrItemName } from "../utils/getPcrItemName";
import { getPcrItemTaskStatus } from "../utils/getPcrItemTaskStatus";

const GetItemTasks = ({
  editor,
  index,
  item,
  projectId,
  pcrId,
  mode,
}: {
  editor?: IEditorStore<PCRDto, PCRDtoValidator>;
  index: number;
  item: PCRItemDto;
  projectId: ProjectId;
  pcrId: PcrId;
  mode: "details" | "prepare";
}) => {
  const routes = useRoutes();
  const validationErrors = editor?.validator.items.results[index].errors;
  const workflow = PcrWorkflow.getWorkflow(item, 1);
  const { getPcrItemContent } = usePcrItemName();

  return (
    <ACC.Task
      name={getPcrItemContent(item.typeName, item).label}
      status={getPcrItemTaskStatus(item.status)}
      route={(mode === "prepare" ? routes.pcrPrepareItem : routes.pcrViewItem).getLink({
        projectId: projectId,
        pcrId: pcrId,
        itemId: item.id,
        step: item.status === PCRItemStatus.ToDo && workflow && workflow.getCurrentStepInfo() ? 1 : undefined,
      })}
      validation={validationErrors}
    />
  );
};

export { GetItemTasks };
