import { PCRItemStatus, PCRItemType } from "@framework/constants/pcrConstants";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { ProjectDtoGql } from "@framework/dtos/projectDto";
import { GraphqlError } from "@framework/types/IAppError";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { Content } from "@ui/components/molecules/Content/content";
import { useFetchKey } from "@ui/context/FetchKeyProvider";
import { ClientErrorResponse } from "@framework/util/errorHandlers";
import { BaseProps } from "@ui/app/containerBase";
import { PcrWorkflow } from "@ui/pages/pcrs/pcrWorkflow";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSave: ({ data, context, onSuccess }: { data: any; onSuccess?: () => void; context: { link: ILinkInfo } }) => void;
    workflow: PcrWorkflow;
    fetchKey: number;
    displayCompleteForm: boolean;
    allowSubmit: boolean;
    getRequiredToCompleteMessage: (message?: string) => JSX.Element | "This is required to complete this request.";
    markedAsCompleteHasBeenChecked: boolean;
    setMarkedAsCompleteHasBeenChecked: Dispatch<SetStateAction<boolean>>;
    apiError: ClientErrorResponse | GraphqlError | null;
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

  const [fetchKey] = useFetchKey();
  const [markedAsCompleteHasBeenChecked, setMarkedAsCompleteHasBeenChecked] = useState(
    props.pcrItem.status === PCRItemStatus.Complete,
  );

  const {
    onUpdate: onSave,
    apiError,
    isFetching,
  } = useOnSavePcrItem({
    pcrItemId: props.itemId,
    pcrType: props.pcrType,
    projectId: props.projectId,
    onSuccess: props.refreshItemWorkflowQuery,
    step: props.step,
  });

  const displayCompleteForm = props.mode === "prepare";
  const allowSubmit = true; // this will not necessarily be true after all pcrs have been migrated

  return (
    <PcrWorkflowContext.Provider
      value={{
        apiError,
        ...props,
        workflow,
        onSave,
        isFetching,
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
