import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { BaseProps } from "@ui/containers/containerBase";
import { PcrWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { Mode, ProjectChangeRequestPrepareItemParams } from "./pcrItemWorkflowContainer";
import { WorkflowStep } from "./pcrItemWorkflowStep";
import { SummarySection } from "./pcrItemWorkflowSummary";
import { useOnSavePcrItem } from "./pcrItemWorkflow.logic";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { UseFormTrigger } from "react-hook-form";
import { usePcrItemWorkflowHooks } from "./pcrItemWorkflowHooks";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { Results } from "@ui/validation/results";
import { IAppError } from "@framework/types/IAppError";

type Data = {
  project: Pick<ProjectDto, "status">;
  pcrItem: Pick<
    FullPCRItemDto,
    | "id"
    | "shortName"
    | "type"
    | "projectRole"
    | "partnerType"
    | "guidance"
    | "isCommercialWork"
    | "typeOfAid"
    | "organisationType"
    | "hasOtherFunding"
    | "status"
    | "typeName"
  >;
  mode: Mode;
  fragmentRef: unknown;
};

/**
 * returns the standard required to complete message with any additional message parts
 * @param {string} [message] additional message
 * @returns {JSX.Element | "This is required to complete this request."} message block
 */
function getRequiredToCompleteMessage(message?: string) {
  // const standardMessage = "This is required to complete this request.";
  const standardMessage = <Content value={x => x.pcrLabels.requiredToComplete} />;

  if (!message) return standardMessage;

  return (
    <span>
      {message}
      <br />
      {standardMessage}
    </span>
  );
}

type PcrWorkflowContextProps = Data &
  ProjectChangeRequestPrepareItemParams &
  Pick<BaseProps, "config" | "messages" | "routes" | "currentRoute"> & {
    isFetching: boolean;
    onSave: ({ data, context }: { data: Partial<FullPCRItemDto>; context?: { link: ILinkInfo } }) => Promise<void>;
    workflow: PcrWorkflow<Partial<FullPCRItemDto>, null>;
    fetchKey: number;
    displayCompleteForm: boolean;
    allowSubmit: boolean;
    getRequiredToCompleteMessage: (message?: string) => JSX.Element | "This is required to complete this request.";
    markedAsCompleteHasBeenChecked: boolean;
    setMarkedAsCompleteHasBeenChecked: Dispatch<SetStateAction<boolean>>;
    useInitialValidate: <TFormValues extends AnyObject>(trigger: UseFormTrigger<TFormValues>) => void;
    useFormValidate: <TFormValues extends AnyObject>(trigger: UseFormTrigger<TFormValues>) => void;
    apiError: IAppError<Results<ResultBase>> | null | undefined;
  };

const PcrWorkflowContext = createContext<PcrWorkflowContextProps>(null as unknown as PcrWorkflowContextProps);

export const usePcrWorkflowContext = () => useContext(PcrWorkflowContext);

export const PCRItemWorkflowMigratedForGql = (props: BaseProps & Data & ProjectChangeRequestPrepareItemParams) => {
  const workflow = PcrWorkflow.getWorkflow(props.pcrItem, props.step) as unknown as PcrWorkflow<
    Partial<FullPCRItemDto>,
    null
  >;

  if (!workflow) {
    throw new Error("missing a workflow in pcrItemWorkflow");
  }

  if (!workflow.isMigratedToGql) {
    throw new Error("this workflow has not been migrated to graphql");
  }

  const [fetchKey, setFetchKey] = useState<number>(0);
  const [markedAsCompleteHasBeenChecked, setMarkedAsCompleteHasBeenChecked] = useState(
    props.pcrItem.status === PCRItemStatus.Complete,
  );

  const {
    onUpdate: onSave,
    apiError,
    isFetching,
  } = useOnSavePcrItem(props.projectId, props.pcrId, props.itemId, setFetchKey);

  const workflowHooks = usePcrItemWorkflowHooks();

  const displayCompleteForm = props.mode === "prepare";
  const allowSubmit = true; // this will not necessarily be true after all pcrs have been migrated

  return (
    <PcrWorkflowContext.Provider
      value={{
        apiError,
        ...props,
        workflow,
        onSave,
        ...workflowHooks,
        isFetching,
        fetchKey,
        getRequiredToCompleteMessage,
        displayCompleteForm,
        allowSubmit,
        markedAsCompleteHasBeenChecked,
        setMarkedAsCompleteHasBeenChecked,
      }}
    >
      {workflow?.isOnSummary() ? <SummarySection /> : <WorkflowStep />}
    </PcrWorkflowContext.Provider>
  );
};
