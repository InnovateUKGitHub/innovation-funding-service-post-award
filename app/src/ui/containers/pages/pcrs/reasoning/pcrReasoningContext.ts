import { Mode } from "./pcrReasoningWorkflow.logic";
import { FullPCRItemDto, PCRDto } from "@framework/dtos/pcrDtos";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { PartnerDocumentSummaryDtoGql } from "@framework/dtos/documentDto";
import { BaseProps } from "@ui/containers/containerBase";
import { IAppError } from "@framework/types/IAppError";
import { Results } from "@ui/validation/results";
import { PCRItemType } from "@framework/constants/pcrConstants";
import { Dispatch, SetStateAction, createContext, useContext } from "react";

type PcrReasoningContextType = {
  projectId: ProjectId;
  pcrId: PcrId;
  mode: Mode;
  stepNumber?: number;
  pcr: Pick<PCRDto, "reasoningComments" | "requestNumber" | "id" | "projectId" | "reasoningStatus"> & {
    items: Pick<FullPCRItemDto, "shortName" | "type" | "typeName" | "id">[];
  };
  isFetching: boolean;
  onUpdate: ({ data, context }: { data: Partial<PCRDto>; context?: { link: ILinkInfo } | undefined }) => Promise<void>;
  documents: Pick<
    PartnerDocumentSummaryDtoGql,
    "id" | "dateCreated" | "description" | "fileName" | "fileSize" | "isOwner" | "link" | "uploadedBy"
  >[];
  messages: BaseProps["messages"];
  routes: BaseProps["routes"];
  config: BaseProps["config"];
  apiError: IAppError<Results<ResultBase>> | null | undefined;
  editableItemTypes: PCRItemType[];
  markedAsCompleteHasBeenChecked: boolean;
  setMarkedAsCompleteHasBeenChecked: Dispatch<SetStateAction<boolean>>;
  fetchKey: number;
  fragmentRef: unknown;
};

export const PcrReasoningContext = createContext<PcrReasoningContextType>({} as PcrReasoningContextType);
export const usePcrReasoningContext = () => useContext(PcrReasoningContext);
