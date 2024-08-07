import { PCRItemStatus, PCRItemType } from "@framework/constants/pcrConstants";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { ProjectDtoGql } from "@framework/dtos/projectDto";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Content } from "@ui/components/molecules/Content/content";
import { useFetchKey } from "@ui/context/FetchKeyProvider";
import { ClientErrorResponse } from "@server/errorHandlers";
import { BaseProps } from "@ui/containers/containerBase";
import { PcrWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { useOnSavePcrItem } from "./pcrItemWorkflow.logic";
import {
  Mode,
  ProjectChangeRequestPrepareItemParams,
  ProjectChangeRequestPrepareItemSearchParams,
} from "./pcrItemWorkflowContainer";
import { WorkflowStep } from "./pcrItemWorkflowStep";
import { SummarySection } from "./pcrItemWorkflowSummary";
import { useGetPcrItemMetadata } from "./utils/useGetPcrItemMetadata";

type Data = {
  project: Pick<ProjectDtoGql, "status" | "isActive">;
  pcrItem: Pick<
    FullPCRItemDto,
    | "id"
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
  refreshItemWorkflowQuery: () => Promise<void>;
  pcrType: PCRItemType;
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
  ProjectChangeRequestPrepareItemSearchParams &
  Pick<BaseProps, "config" | "messages" | "routes" | "currentRoute"> & {
    isFetching: boolean;
    onSave: ({
      data,
      context,
    }: {
      data: Partial<FullPCRItemDto> & { button_submit?: string | null };
      context?: { link: ILinkInfo };
    }) => Promise<void>;
    workflow: PcrWorkflow;
    fetchKey: number;
    displayCompleteForm: boolean;
    allowSubmit: boolean;
    getRequiredToCompleteMessage: (message?: string) => JSX.Element | "This is required to complete this request.";
    markedAsCompleteHasBeenChecked: boolean;
    setMarkedAsCompleteHasBeenChecked: Dispatch<SetStateAction<boolean>>;
    apiError: ClientErrorResponse | null;
    refreshItemWorkflowQuery: () => Promise<void>;
  };

const PcrWorkflowContext = createContext<PcrWorkflowContextProps>(null as unknown as PcrWorkflowContextProps);

export const usePcrWorkflowContext = () => useContext(PcrWorkflowContext);

export const PCRItemWorkflow = (props: BaseProps & Data & ProjectChangeRequestPrepareItemParams) => {
  const { getPcrItemContent } = useGetPcrItemMetadata();
  const workflow = PcrWorkflow.getWorkflow(props.pcrItem, props.step);

  if (!workflow) {
    throw new Error("missing a workflow in pcrItemWorkflow");
  }

  const [fetchKey, setFetchKey] = useFetchKey();
  const [markedAsCompleteHasBeenChecked, setMarkedAsCompleteHasBeenChecked] = useState(
    props.pcrItem.status === PCRItemStatus.Complete,
  );

  const {
    onUpdate: onSave,
    apiError,
    isProcessing,
  } = useOnSavePcrItem(
    props.projectId,
    props.pcrId,
    props.itemId,
    setFetchKey,
    props.refreshItemWorkflowQuery,
    props.step,
    props.pcrType,
  );

  const displayCompleteForm = props.mode === "prepare";
  const allowSubmit = true; // this will not necessarily be true after all pcrs have been migrated

  return (
    <PcrWorkflowContext.Provider
      value={{
        apiError,
        ...props,
        workflow,
        onSave,
        isFetching: isProcessing,
        fetchKey,
        getRequiredToCompleteMessage,
        displayCompleteForm,
        allowSubmit,
        markedAsCompleteHasBeenChecked,
        setMarkedAsCompleteHasBeenChecked,
      }}
    >
      <Helmet>
        <title>{getPcrItemContent(props.pcrItem.type).name}</title>
      </Helmet>
      {workflow?.isOnSummary() ? <SummarySection /> : <WorkflowStep />}
    </PcrWorkflowContext.Provider>
  );
};
