import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { FullPCRItemDto, PCRDto } from "@framework/dtos/pcrDtos";
import { Task } from "@ui/components/atomicDesign/molecules/TaskList/TaskList";
import { PcrWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { useRoutes } from "@ui/redux/routesProvider";
import { useGetPcrItemMetadata } from "../utils/useGetPcrItemMetadata";
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
    | "typeOfAid"
  >;
  projectId: ProjectId;
  pcrId: PcrId;
  mode: "details" | "prepare";
  rhfErrors?: { items?: { key: string; message: string | null }[] };
};

const GetItemTasks = ({ editor, rhfErrors, index, item, projectId, pcrId, mode }: GetItemTaskProps) => {
  const routes = useRoutes();
  const validationErrors = editor?.validator.items.results[index].errors;
  const workflow = PcrWorkflow.getWorkflow(item, 1);
  const { getPcrItemContent, getPcrItemMetadata } = useGetPcrItemMetadata();

  const itemMetadata = getPcrItemMetadata(item.type);

  const rhfError = rhfErrors?.items?.[index];

  return (
    <Task
      id={`items_${index}`}
      name={getPcrItemContent(item.type, item).label}
      status={itemMetadata?.disableStatus ? undefined : getPcrItemTaskStatus(item.status)}
      route={(mode === "prepare" ? routes.pcrPrepareItem : routes.pcrViewItem).getLink({
        projectId: projectId,
        pcrId: pcrId,
        itemId: item.id,
        step: item.status === PCRItemStatus.ToDo && workflow && workflow.getCurrentStepInfo() ? 1 : undefined,
      })}
      rhfError={rhfError}
      validation={validationErrors}
    />
  );
};

export { GetItemTasks };
