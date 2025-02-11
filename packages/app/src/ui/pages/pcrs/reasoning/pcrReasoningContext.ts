import { Mode } from "./pcrReasoningWorkflow.logic";
import { FullPCRItemDto, PCRDto } from "@framework/dtos/pcrDtos";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { PartnerDocumentSummaryDtoGql } from "@framework/dtos/documentDto";
import { BaseProps } from "@ui/app/containerBase";
import { PCRItemType } from "@framework/constants/pcrConstants";
import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { ClientErrorResponse } from "@framework/util/errorHandlers";
import { z } from "zod";
import { PcrReasoningFilesSchema, PcrReasoningSchema, PcrReasoningSummarySchema } from "./pcrReasoning.zod";

type PcrReasoningContextType = {
  projectId: ProjectId;
  pcrId: PcrId;
  mode: Mode;
  stepNumber?: number;
  pcr: Pick<PCRDto, "reasoningComments" | "requestNumber" | "id" | "projectId" | "reasoningStatus"> & {
    items: Pick<FullPCRItemDto, "shortName" | "type" | "typeName" | "id">[];
  };
  isFetching: boolean;
  onUpdate: ({
    data,
    context,
  }: {
    data: z.output<PcrReasoningSchema> | z.output<PcrReasoningFilesSchema> | z.output<PcrReasoningSummarySchema>;
    context?: { link: ILinkInfo } | undefined;
  }) => Promise<void>;
  documents: Pick<
    PartnerDocumentSummaryDtoGql,
    "id" | "dateCreated" | "description" | "fileName" | "fileSize" | "isOwner" | "link" | "uploadedBy"
  >[];
  messages: BaseProps["messages"];
  routes: BaseProps["routes"];
  config: BaseProps["config"];
  apiError: ClientErrorResponse | null;
  editableItemTypes: PCRItemType[];
  markedAsCompleteHasBeenChecked: boolean;
  setMarkedAsCompleteHasBeenChecked: Dispatch<SetStateAction<boolean>>;
  fetchKey: number;
  fragmentRef: unknown;
};

export const PcrReasoningContext = createContext<PcrReasoningContextType>({} as PcrReasoningContextType);
export const usePcrReasoningContext = () => useContext(PcrReasoningContext);
