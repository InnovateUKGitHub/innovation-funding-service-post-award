import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { FullPCRItemDto, PCRDto } from "@framework/dtos/pcrDtos";
import { Task } from "@ui/components/taskList";
import { PcrWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { useRoutes } from "@ui/redux/routesProvider";
import { usePcrItemName } from "../utils/getPcrItemName";
import { getPcrItemTaskStatus } from "../utils/getPcrItemTaskStatus";

export type GetItemTaskProps = {
  editor?: IEditorStore<PCRDto, PCRDtoValidator>;
  index: number;
  item: Pick<
    FullPCRItemDto,
    | "accountName"
    | "hasOtherFunding"
    | "id"
    | "isCommercialWork"
    | "organisationName"
    | "organisationType"
    | "partnerNameSnapshot"
    | "partnerType"
    | "projectRole"
    | "status"
    | "type"
    | "typeName"
    | "typeOfAid"
  >;
  projectId: ProjectId;
  pcrId: PcrId;
  mode: "details" | "prepare";
};

const GetItemTasks = ({ editor, index, item, projectId, pcrId, mode }: GetItemTaskProps) => {
  const routes = useRoutes();
  const validationErrors = editor?.validator.items.results[index].errors;
  const workflow = PcrWorkflow.getWorkflow(item, 1);
  const { getPcrItemContent } = usePcrItemName();

  return (
    <Task
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
