import { FullPCRItemDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title.withFragment";
import { Markdown } from "@ui/components/atomicDesign/atoms/Markdown/markdown";
import { Messages } from "@ui/components/atomicDesign/molecules/Messages/messages";
import { BaseProps } from "@ui/containers/containerBase";
import { PcrWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { Mode, ProjectChangeRequestPrepareItemParams } from "./pcrItemWorkflowContainer";
import { WorkflowStep } from "./pcrItemWorkflowStep";
import { SummarySection } from "./pcrItemWorkflowSummary";
import { useOnSavePcrItem } from "./pcrItemWorkflow.logic";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { useContent } from "@ui/hooks/content.hook";
import { FieldErrors } from "react-hook-form";
import { usePcrItemWorkflowHooks } from "./pcrItemWorkflowHooks";

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
  const standardMessage = "This is required to complete this request.";

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
    setPcrValidationErrors: Dispatch<SetStateAction<RhfErrors>>;
    pcrValidationErrors: RhfErrors;
    displayCompleteForm: boolean;
    allowSubmit: boolean;
    usePcrErrors: <TFormValues extends AnyObject>(pcrErrorConfig: {
      errors: FieldErrors<TFormValues>;
      errorSubset: string[];
      clearErrors: Record<string, boolean>;
    }) => void;
    useSetPcrValidationErrors: <TFormValues extends AnyObject>(
      formStateErrors: FieldErrors<TFormValues>,
      isSummary?: boolean,
    ) => void;
    useClearPcrValidationError: (errorField: string, shouldClear: boolean) => void;
    useErrorSubset: (errorFields: string[]) => void;
    getRequiredToCompleteMessage: (message?: string) => JSX.Element | "This is required to complete this request.";
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

  const {
    onUpdate: onSave,
    apiError,
    isFetching,
  } = useOnSavePcrItem(props.projectId, props.pcrId, props.itemId, setFetchKey);

  const {
    useSetPcrValidationErrors,
    useClearPcrValidationError,
    useErrorSubset,
    usePcrErrors,
    setPcrValidationErrors,
    pcrValidationErrors,
  } = usePcrItemWorkflowHooks();

  const displayCompleteForm = props.mode === "prepare";
  const allowSubmit = true; // this will not necessarily be true after all pcrs have been migrated

  return (
    <PcrWorkflowContext.Provider
      value={{
        ...props,
        workflow,
        pcrValidationErrors,
        setPcrValidationErrors,
        useSetPcrValidationErrors,
        useClearPcrValidationError,
        usePcrErrors,
        useErrorSubset,
        onSave,
        isFetching,
        fetchKey,
        getRequiredToCompleteMessage,
        displayCompleteForm,
        allowSubmit,
      }}
    >
      <Page
        backLink={<PcrBackLink />}
        pageTitle={<Title heading={props.pcrItem.typeName} />}
        projectStatus={props.project.status}
        fragmentRef={props.fragmentRef}
        validationErrors={pcrValidationErrors}
        apiError={apiError}
      >
        <Messages messages={props.messages} />

        <Workflow />
      </Page>
    </PcrWorkflowContext.Provider>
  );
};

const Workflow = () => {
  const { mode, step, pcrItem, workflow } = usePcrWorkflowContext();
  const isPrepareMode = mode === "prepare";
  const isFirstStep = step === 1;

  const displayGuidance = isPrepareMode && isFirstStep;
  return (
    <>
      {displayGuidance && renderGuidanceSection(pcrItem)}

      {workflow?.isOnSummary() ? <SummarySection /> : <WorkflowStep />}
    </>
  );
};

const renderGuidanceSection = (pcrItem: Pick<PCRItemDto, "guidance">) => {
  if (!pcrItem.guidance) return null;

  return (
    <Section qa="guidance">
      <Markdown trusted value={pcrItem.guidance} />
    </Section>
  );
};

const PcrBackLink = () => {
  const { mode, routes, projectId, pcrId } = usePcrWorkflowContext();
  const { getContent } = useContent();

  if (mode === "review") {
    return (
      <BackLink route={routes.pcrReview.getLink({ projectId, pcrId })}>
        {getContent(x => x.pages.pcrItemWorkflow.backToRequest)}
      </BackLink>
    );
  }
  if (mode === "prepare") {
    return (
      <BackLink route={routes.pcrPrepare.getLink({ projectId, pcrId })}>
        {getContent(x => x.pages.pcrItemWorkflow.backToRequest)}
      </BackLink>
    );
  }
  return (
    <BackLink route={routes.pcrDetails.getLink({ projectId, pcrId })}>
      {getContent(x => x.pages.pcrItemWorkflow.backToRequest)}
    </BackLink>
  );
};
