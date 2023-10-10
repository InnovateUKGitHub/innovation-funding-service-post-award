import { ProjectRole } from "@framework/constants/project";
import { Pending } from "@shared/pending";
import { Loader, PageLoader } from "@ui/components/bjss/loading";
import { useStores } from "@ui/redux/storesProvider";
import { BaseProps, defineRoute } from "../../../containerBase";
import { PCRItemType } from "@framework/constants/pcrConstants";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { PCRDto, PCRItemDto, PCRItemTypeDto } from "@framework/dtos/pcrDtos";
import { ProjectDto } from "@framework/dtos/projectDto";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { FinancialVirementDto } from "@framework/dtos/financialVirementDto";
import { MultipleDocumentUploadDto } from "@framework/dtos/documentUploadDto";
import { MultipleDocumentUploadDtoValidator } from "@ui/validation/validators/documentUploadValidator";
import { PcrItemContext, SummarySection } from "../pcrItemWorkflow";
import { noop } from "@ui/helpers/noop";
import { PcrWorkflow, WorkflowPcrType } from "../pcrWorkflow";
import { Results } from "@ui/validation/results";
import { PcrSummaryProvider } from "../components/PcrSummary/PcrSummary";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { PCRReasoningSummary } from "../reasoning/pcrReasoningSummary";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { GovWidthContainer } from "@ui/components/atomicDesign/atoms/GovWidthContainer/GovWidthContainer";
import { PrintButton } from "@ui/components/atomicDesign/molecules/PrintButton/PrintButton";
import { Page } from "@ui/components/bjss/Page/page";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { useRoutes } from "@ui/redux/routesProvider";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { ILinkInfo } from "@framework/types/ILinkInfo";

type BackMode = "prepare" | "details" | "review";

interface PCRParams {
  projectId: ProjectId;
  pcrId: PcrId;
  backMode: BackMode;
}

interface PCRDataProps {
  project: ProjectDto;
  partners: PartnerDto[];
  pcr: PCRDto;
  editor: IEditorStore<PCRDto, PCRDtoValidator>;
  editableItemTypes: PCRItemType[];
  documents: DocumentSummaryDto[];
}

interface PCRItemParams extends PCRParams {
  itemId: PcrItemId;
}

interface PCRItemContainerProps {
  pcrItem: PCRItemDto;
}

interface PCRItemDataProps extends PCRDataProps {
  virement: FinancialVirementDto;
  pcrItem: PCRItemDto;
  pcrItemType: PCRItemTypeDto;
  documentsEditor: IEditorStore<MultipleDocumentUploadDto, MultipleDocumentUploadDtoValidator>;
}

const stubProps = {
  onSave: noop,
  onChange: noop,
  mode: "print",
} as const;

const PCRItemThing = (props: PCRItemParams & BaseProps & PCRItemDataProps) => {
  const workflow = PcrWorkflow.getWorkflow(props.pcrItem as WorkflowPcrType, undefined) as unknown as PcrWorkflow<
    PCRItemDto,
    Results<PCRItemDto>
  >;

  if (!workflow) {
    throw new Error("missing a workflow in pcrItemWorkflow");
  }

  const newProps = {
    ...props,
    ...stubProps,
    workflow,
  } as const;

  return (
    <PcrItemContext.Provider value={newProps}>
      <PcrSummaryProvider type={props.pcrItem.type} partners={props.partners} virement={props.virement}>
        <SummarySection />
      </PcrSummaryProvider>
    </PcrItemContext.Provider>
  );
};

const PCRItemContainer = (props: PCRItemParams & BaseProps & PCRDataProps & PCRItemContainerProps) => {
  const stores = useStores();

  const moreCombined = Pending.combine({
    virement: stores.financialVirements.get(props.projectId, props.pcrId, props.itemId),
    pcrItemType: stores.projectChangeRequests.getPcrTypeForItem(props.projectId, props.pcrId, props.itemId),
    documentsEditor: stores.projectChangeRequestDocuments.getPcrOrPcrItemDocumentsEditor(props.projectId, props.itemId),
  });

  return <Loader pending={moreCombined} render={x => <PCRItemThing {...props} {...x} />} />;
};

const PCRPrintPage = (props: PCRParams & BaseProps & PCRDataProps) => {
  const routes = useRoutes();
  let backlink: ILinkInfo;

  switch (props.backMode) {
    case "prepare":
      backlink = routes.pcrPrepare.getLink({ pcrId: props.pcrId, projectId: props.projectId });
    case "details":
      backlink = routes.pcrDetails.getLink({ pcrId: props.pcrId, projectId: props.projectId });
    case "review":
      backlink = routes.pcrReview.getLink({ pcrId: props.pcrId, projectId: props.projectId });
  }

  return (
    <Page
      pageTitle={<Title projectNumber={props.project.projectNumber} title={props.project.title} />}
      backLink={<BackLink route={backlink}>Back to Project Change Request</BackLink>}
    >
      <GovWidthContainer>
        <PrintButton onClick={() => window.print()} />

        <Section title="PCR Reasoning" className="acc-section__print">
          <PCRReasoningSummary {...stubProps} {...props} />
        </Section>

        {props.pcr.items.map(y => (
          <Section key={y.id} title={y.typeName} className="acc-section__print">
            <PCRItemContainer {...props} pcrItem={y} itemId={y.id} />
          </Section>
        ))}
      </GovWidthContainer>
    </Page>
  );
};

const PCRPrintContainer = (props: PCRParams & BaseProps) => {
  const stores = useStores();

  const combined = Pending.combine({
    project: stores.projects.getById(props.projectId),
    partners: stores.partners.getPartnersForProject(props.projectId),
    pcr: stores.projectChangeRequests.getById(props.projectId, props.pcrId),
    editor: stores.projectChangeRequests.getPcrUpdateEditor(props.projectId, props.pcrId),
    editableItemTypes: stores.projectChangeRequests.getEditableItemTypes(props.projectId, props.pcrId),
    documents: stores.projectChangeRequestDocuments.pcrOrPcrItemDocuments(props.projectId, props.pcrId),
  });

  return <PageLoader pending={combined} render={x => <PCRPrintPage {...props} {...x} />} />;
};

export const PCRPrintRoute = defineRoute<PCRParams>({
  allowRouteInActiveAccess: true,
  routeName: "pcrPrintDetails",
  routePath: "/projects/:projectId/pcrs/:pcrId/:backMode/print",
  container: PCRPrintContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    backMode: route.params.backMode as BackMode,
  }),
  getTitle: () => ({
    htmlTitle: "Request",
    displayTitle: "Request",
  }),
  accessControl: (auth, { projectId }) =>
    auth.forProject(projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer),
});
