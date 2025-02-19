import type {
  CreatePcrDto,
  FullPCRItemDto,
  LoanDrawdownExtensionDto,
  PcrAddPartnerAcademicCostsDto,
  PcrAddPartnerAcademicOrganisationDto,
  PcrAddPartnerCompanyDetailsDto,
  PcrAddPartnerFinanceContactDto,
  PcrAddPartnerFundingLevelDto,
  PcrAddPartnerOtherFundingDto,
  PcrAddPartnerOtherSourcesOfFundingDto,
  PcrAddPartnerOrganisationDetailsDto,
  PcrAddPartnerProjectLocationDto,
  PcrAddPartnerProjectManagerDto,
  PcrAddPartnerRoleAndOrganisationDto,
  PcrChangeDurationDto,
  PcrDeleteTeamMemberDto,
  PCRDto,
  PcrInviteTeamMemberDto,
  PcrRemovePartnerDto,
  PcrRenamePartnerDto,
  PcrReplaceTeamMemberDto,
  PcrScopeChangeDto,
  PCRSummaryDto,
  PcrSuspendProjectDto,
  PcrUpdateTeamMemberDto,
  StandalonePcrDto,
  PcrAddPartnerFinancialDetailsDto,
  PcrAddPartnerProjectCostOtherCostDto,
  PcrAddPartnerProjectCostLabourDto,
  PcrAddPartnerProjectCostMaterialsDto,
  PcrAddPartnerProjectCostCapitalUsageDto,
  PcrAddPartnerProjectCostTravelAndSubsistenceDto,
  PcrAddPartnerProjectCostSubcontractingDto,
  PcrAddPartnerProjectCostOverheadDto,
  PcrAddPartnerSummaryDto,
  PcrFilesStepDto,
  ReasoningDto,
  PcrSubmitDto,
  ApproveNewSubcontractorDto,
  LoanDrawdownChangeDto,
} from "@framework/dtos/pcrDtos";
import { contextProvider } from "@server/features/common/contextProvider";
import { CreateProjectChangeRequestCommand } from "@server/features/pcrs/createProjectChangeRequestCommand";
import { DeleteProjectChangeRequestCommand } from "@server/features/pcrs/deleteProjectChangeRequestCommand";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { processDto } from "@shared/processResponse";
import { ApiParams, ControllerBaseWithSummary, RequestQueryParams, RequestUrlParams } from "./controllerBase";
import { UpdatePcrScopeChangeCommand } from "@server/features/pcrs/updatePcrScopeChangeCommand";
import { UpdatePcrRenamePartnerCommand } from "@server/features/pcrs/updatePcrRenamePartnerCommand";
import { UpdatePcrRemovePartnerCommand } from "@server/features/pcrs/updatePcrRemovePartnerCommand";
import { UpdatePcrChangeDurationCommand } from "@server/features/pcrs/updatePcrChangeDurationCommand";
import { UpdatePcrSuspendProjectCommand } from "@server/features/pcrs/updatePcrSuspendProjectCommand";
import { UpdatePcrAddPartnerRoleAndOrganisationCommand } from "@server/features/pcrs/updatePcrAddPartnerRoleAndOrganisationCommand";
import { UpdatePcrAddPartnerAcademicOrganisationCommand } from "@server/features/pcrs/updatePcrAddPartnerAcademicOrganisationCommand";
import { UpdatePcrAddPartnerProjectLocationCommand } from "@server/features/pcrs/updatePcrAddPartnerProjectLocationCommand";
import { UpdatePcrAddPartnerFinanceContactCommand } from "@server/features/pcrs/updatePcrAddPartnerFinanceContactCommand";
import { UpdatePcrAddPartnerProjectManagerCommand } from "@server/features/pcrs/updatePcrAddPartnerProjectManagerCommand";
import { UpdatePcrLoanDurationExtensionCommand } from "@server/features/pcrs/updateLoanDurationExtensionCommand";
import { UpdatePcrAddPartnerAcademicCostsCommand } from "@server/features/pcrs/updatePcrAddPartnerAcademicCostsCommand";
import { UpdatePcrAddPartnerOtherFundingCommand } from "@server/features/pcrs/updateAddPartnerOtherFundingCommand";
import { UpdatePcrAddPartnerOtherSourcesOfFundingCommand } from "@server/features/pcrs/updateAddPartnerOtherSourcesOfFundingCommand";
import { UpdatePcrAddPartnerFundingLevelCommand } from "@server/features/pcrs/updatePcrAddPartnerFundingLevelCommand";
import { CreatePcrReplaceTeamMemberCommand } from "@server/features/pcrs/createPcrReplaceTeamMemberCommand";
import { CreatePcrInviteTeamMemberCommand } from "@server/features/pcrs/createPcrInviteTeamMemberCommand";
import { CreatePcrUpdateTeamMemberCommand } from "@server/features/pcrs/createPcrUpdateTeamMemberCommand";
import { CreatePcrDeleteTeamMemberCommand } from "@server/features/pcrs/createPcrDeleteTeamMemberCommand";
import { UpdatePcrAddPartnerCompanyDetailsCommand } from "@server/features/pcrs/updatePcrAddPartnerCompanyDetailsCommand";
import { UpdatePcrAddPartnerOrganisationDetailsCommand } from "@server/features/pcrs/updatePcrAddPartnerOrganisationDetailsCommand";
import { FormTypes } from "@ui/zod/FormTypes";
import { ISessionUser } from "@framework/types/IUser";
import { AuthorisedAsyncCommandBase } from "@server/features/common/commandBase";
import { UpdatePcrAddPartnerFinancialDetailsCommand } from "@server/features/pcrs/updatePcrAddPartnerFinancialDetailsCommand";
import { UpdatePcrAddPartnerProjectCostOtherCommand } from "@server/features/pcrs/updatePcrAddPartnerProjectCostOtherCommand";
import { UpdatePcrAddPartnerProjectCostLabourCommand } from "@server/features/pcrs/updatePcrAddPartnerProjectCostLabourCommand";
import { UpdatePcrAddPartnerProjectCostMaterialsCommand } from "@server/features/pcrs/updatePcrAddPartnerProjectCostMaterialsCommand";
import { UpdatePcrAddPartnerProjectCostCapitalUsageCommand } from "@server/features/pcrs/updatePcrAddPartnerProjectCostCapitalUsageCommand";
import { UpdatePcrAddPartnerProjectCostTravelAndSubsistenceCommand } from "@server/features/pcrs/updatePcrAddPartnerProjectCostTravelAndSubsistenceCommand";
import { UpdatePcrAddPartnerProjectCostSubcontractingCommand } from "@server/features/pcrs/updatePcrAddPartnerProjectCostSubcontractingCommand";
import { UpdatePcrAddPartnerProjectCostOverheadCommand } from "@server/features/pcrs/updatePcrAddPartnerProjectCostOverheadCommand";
import { DeleteProjectCostCommand } from "@server/features/pcrs/deletePcrAddPartnerProjectCostCommand";
import { UpdatePcrAddPartnerSummaryCommand } from "@server/features/pcrs/updatePcrAddPartnerSummaryCommand";
import { DeleteLabourCostCommand } from "@server/features/pcrs/deletePcrAddPartnerLabourCostCommand";
import { UpdatePcrFilesStepCommand } from "@server/features/pcrs/updatePcrFilesStepCommand";
import { UpdatePcrReasoningCommand } from "@server/features/pcrs/updatePcrReasoningCommand";
import { SubmitPcrCommand } from "@server/features/pcrs/submitPcrCommand";
import { UpdatePcrApproveNewSubcontractorCommand } from "@server/features/pcrs/updatePcrApproveNewSubcontractorCommand";
import { UpdatePcrLoanDrawdownChangeCommand } from "@server/features/pcrs/updateLoanDurationChangeCommand";

type PcrUpdateParams<Context extends "client" | "server", TDto> = ApiParams<
  Context,
  { projectId: ProjectId; pcrId: PcrId; pcrItemId: PcrItemId; pcr: TDto }
>;

type PcrUpdateMethod<Context extends "client" | "server", TDto, TReturn> = (
  params: PcrUpdateParams<Context, TDto>,
) => Promise<TReturn>;

export interface IPCRsApi<Context extends "client" | "server"> {
  create: (
    params: ApiParams<Context, { projectId: ProjectId; projectChangeRequestDto: CreatePcrDto }>,
  ) => Promise<PCRDto>;

  update: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        id: PcrId;
        pcr: PickRequiredFromPartial<Omit<PCRDto, "items">, "projectId" | "id"> & {
          items?: PickRequiredFromPartial<FullPCRItemDto, "id" | "type">[];
        };
      }
    >,
  ) => Promise<PCRDto>;

  inviteTeamMember: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcr: PcrInviteTeamMemberDto;
      }
    >,
  ) => Promise<{ id: PcrId }>;

  deleteTeamMember: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcr: PcrDeleteTeamMemberDto;
      }
    >,
  ) => Promise<{ id: PcrId }>;

  replaceTeamMember: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcr: PcrReplaceTeamMemberDto;
      }
    >,
  ) => Promise<{ id: PcrId }>;

  updateTeamMember: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcr: PcrUpdateTeamMemberDto;
      }
    >,
  ) => Promise<{ id: PcrId }>;
  pcrFilesStep: PcrUpdateMethod<Context, PcrFilesStepDto, boolean>;
  addPartnerAcademicCosts: PcrUpdateMethod<Context, PcrAddPartnerAcademicCostsDto, boolean>;
  addPartnerAcademicOrganisation: PcrUpdateMethod<Context, PcrAddPartnerAcademicOrganisationDto, boolean>;
  addPartnerCompanyDetails: PcrUpdateMethod<Context, PcrAddPartnerCompanyDetailsDto, boolean>;
  addPartnerFinanceContact: PcrUpdateMethod<Context, PcrAddPartnerFinanceContactDto, boolean>;
  addPartnerFinancialDetails: PcrUpdateMethod<Context, PcrAddPartnerFinancialDetailsDto, boolean>;
  addPartnerFundingLevel: PcrUpdateMethod<Context, PcrAddPartnerFundingLevelDto, boolean>;
  addPartnerOtherFunding: PcrUpdateMethod<Context, PcrAddPartnerOtherFundingDto, boolean>;
  addPartnerOtherSourcesOfFunding: PcrUpdateMethod<Context, PcrAddPartnerOtherSourcesOfFundingDto, boolean>;
  addPartnerOrganisationDetails: PcrUpdateMethod<Context, PcrAddPartnerOrganisationDetailsDto, boolean>;
  addPartnerProjectManager: PcrUpdateMethod<Context, PcrAddPartnerProjectManagerDto, boolean>;
  addPartnerProjectLocation: PcrUpdateMethod<Context, PcrAddPartnerProjectLocationDto, boolean>;
  addPartnerRoleAndOrganisation: PcrUpdateMethod<Context, PcrAddPartnerRoleAndOrganisationDto, boolean>;
  addPartnerProjectCostCapitalUsage: PcrUpdateMethod<Context, PcrAddPartnerProjectCostCapitalUsageDto, boolean>;
  addPartnerProjectCostLabour: PcrUpdateMethod<Context, PcrAddPartnerProjectCostLabourDto, boolean>;
  addPartnerProjectCostMaterials: PcrUpdateMethod<Context, PcrAddPartnerProjectCostMaterialsDto, boolean>;
  addPartnerProjectCostOtherCost: PcrUpdateMethod<Context, PcrAddPartnerProjectCostOtherCostDto, boolean>;
  addPartnerProjectCostOverhead: PcrUpdateMethod<Context, PcrAddPartnerProjectCostOverheadDto, boolean>;
  addPartnerProjectCostSubcontracting: PcrUpdateMethod<Context, PcrAddPartnerProjectCostSubcontractingDto, boolean>;
  addPartnerProjectCostTravelAndSubsistence: PcrUpdateMethod<
    Context,
    PcrAddPartnerProjectCostTravelAndSubsistenceDto,
    boolean
  >;
  addPartnerSummary: PcrUpdateMethod<Context, PcrAddPartnerSummaryDto, boolean>;
  changeDuration: PcrUpdateMethod<Context, PcrChangeDurationDto, boolean>;
  loanDrawdownExtension: PcrUpdateMethod<Context, LoanDrawdownExtensionDto, boolean>;
  loanDrawdownChange: PcrUpdateMethod<Context, LoanDrawdownChangeDto, boolean>;
  scopeChange: PcrUpdateMethod<Context, PcrScopeChangeDto, boolean>;
  renamePartner: PcrUpdateMethod<Context, PcrRenamePartnerDto, boolean>;
  removePartner: PcrUpdateMethod<Context, PcrRemovePartnerDto, boolean>;
  suspendProject: PcrUpdateMethod<Context, PcrSuspendProjectDto, boolean>;
  submitPcr: (
    params: ApiParams<Context, { projectId: ProjectId; pcrId: PcrId; pcr: PcrSubmitDto }>,
  ) => Promise<boolean>;
  reasoning: (
    params: ApiParams<Context, { projectId: ProjectId; pcrId: PcrId; pcr: ReasoningDto }>,
  ) => Promise<boolean>;
  approveNewSubcontractor: PcrUpdateMethod<Context, ApproveNewSubcontractorDto, boolean>;
  deleteProjectCost: (
    params: ApiParams<Context, { projectId: ProjectId; pcrId: PcrId; pcrItemId: PcrItemId; costId: CostId }>,
  ) => Promise<boolean>;
  deleteLabourCost: (
    params: ApiParams<Context, { projectId: ProjectId; pcrId: PcrId; pcrItemId: PcrItemId; costId: CostId }>,
  ) => Promise<boolean>;
  delete: (params: ApiParams<Context, { projectId: ProjectId; id: PcrId }>) => Promise<boolean>;
}

class Controller
  extends ControllerBaseWithSummary<"server", PCRSummaryDto, PCRDto | StandalonePcrDto>
  implements IPCRsApi<"server">
{
  constructor() {
    super("pcrs");

    this.postItem(
      "/:projectId",
      (p, _, b: PCRDto) => ({
        projectId: p.projectId,
        projectChangeRequestDto: processDto(b),
      }),
      this.create,
    );

    this.postItem(
      "/:projectId/manage-team-member/delete",
      (p, _, b: PcrDeleteTeamMemberDto) => ({
        projectId: p.projectId,
        pcr: processDto(b),
      }),
      this.deleteTeamMember,
    );

    this.postItem(
      "/:projectId/manage-team-member/invite",
      (p, _, b: PcrInviteTeamMemberDto) => ({
        projectId: p.projectId,
        pcr: processDto(b),
      }),
      this.inviteTeamMember,
    );

    this.postItem(
      "/:projectId/manage-team-member/replace",
      (p, _, b: PcrReplaceTeamMemberDto) => ({
        projectId: p.projectId,
        pcr: processDto(b),
      }),
      this.replaceTeamMember,
    );

    this.postItem(
      "/:projectId/manage-team-member/update",
      (p, _, b: PcrUpdateTeamMemberDto) => ({
        projectId: p.projectId,
        pcr: processDto(b),
      }),
      this.updateTeamMember,
    );

    this.putItem(
      "/:projectId/:pcrId",
      (p, _, b: PCRDto) => ({ projectId: p.projectId, id: p.pcrId, pcr: processDto(b) }),
      this.update,
    );

    this.deleteItem("/:projectId/:pcrId", p => ({ projectId: p.projectId, id: p.pcrId }), this.delete);

    this.putItem("/:projectId/:pcrId/:pcrItemId/pcr-files", requestParams<PcrFilesStepDto>, this.pcrFilesStep);

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/approve-new-subcontractor",
      requestParams<ApproveNewSubcontractorDto>,
      this.approveNewSubcontractor,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/academic-costs",
      requestParams<PcrAddPartnerAcademicCostsDto>,
      this.addPartnerAcademicCosts,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/academic-organisation",
      requestParams<PcrAddPartnerAcademicOrganisationDto>,
      this.addPartnerAcademicOrganisation,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/company-details",
      requestParams<PcrAddPartnerCompanyDetailsDto>,
      this.addPartnerCompanyDetails,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/finance-contact",
      requestParams<PcrAddPartnerFinanceContactDto>,
      this.addPartnerFinanceContact,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/financial-details",
      requestParams<PcrAddPartnerFinancialDetailsDto>,
      this.addPartnerFinancialDetails,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/funding-level",
      requestParams<PcrAddPartnerFundingLevelDto>,
      this.addPartnerFundingLevel,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/other-funding",
      requestParams<PcrAddPartnerOtherFundingDto>,
      this.addPartnerOtherFunding,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/other-sources-of-funding",
      requestParams<PcrAddPartnerOtherSourcesOfFundingDto>,
      this.addPartnerOtherSourcesOfFunding,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/organisation-details",
      requestParams<PcrAddPartnerOrganisationDetailsDto>,
      this.addPartnerOrganisationDetails,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/project-location",
      requestParams<PcrAddPartnerProjectLocationDto>,
      this.addPartnerProjectLocation,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/project-manager",
      requestParams<PcrAddPartnerProjectManagerDto>,
      this.addPartnerProjectManager,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/role-and-organisation",
      requestParams<PcrAddPartnerRoleAndOrganisationDto>,
      this.addPartnerRoleAndOrganisation,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/summary",
      requestParams<PcrAddPartnerSummaryDto>,
      this.addPartnerSummary,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/project-cost/capital-usage",
      requestParams<PcrAddPartnerProjectCostCapitalUsageDto>,
      this.addPartnerProjectCostCapitalUsage,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/project-cost/labour",
      requestParams<PcrAddPartnerProjectCostLabourDto>,
      this.addPartnerProjectCostLabour,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/project-cost/materials",
      requestParams<PcrAddPartnerProjectCostMaterialsDto>,
      this.addPartnerProjectCostMaterials,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/project-cost/other-cost",
      requestParams<PcrAddPartnerProjectCostOtherCostDto>,
      this.addPartnerProjectCostOtherCost,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/project-cost/overhead",
      requestParams<PcrAddPartnerProjectCostOverheadDto>,
      this.addPartnerProjectCostOverhead,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/project-cost/subcontracting",
      requestParams<PcrAddPartnerProjectCostSubcontractingDto>,
      this.addPartnerProjectCostSubcontracting,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/project-cost/travel-and-subsistence",
      requestParams<PcrAddPartnerProjectCostTravelAndSubsistenceDto>,
      this.addPartnerProjectCostTravelAndSubsistence,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/change-duration",
      requestParams<PcrChangeDurationDto>,
      this.changeDuration,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/loan-duration-extension",
      requestParams<LoanDrawdownExtensionDto>,
      this.loanDrawdownExtension,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/loan-drawdown-change",
      requestParams<LoanDrawdownChangeDto>,
      this.loanDrawdownChange,
    );

    this.putItem("/:projectId/:pcrId/:pcrItemId/scope-change", requestParams<PcrScopeChangeDto>, this.scopeChange);

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/rename-partner",
      requestParams<PcrRenamePartnerDto>,
      this.renamePartner,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/remove-partner",
      requestParams<PcrRemovePartnerDto>,
      this.removePartner,
    );

    this.putItem("/:projectId/:pcrId/reasoning", requestParams<ReasoningDto>, this.reasoning);

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/suspend-project",
      requestParams<PcrSuspendProjectDto>,
      this.suspendProject,
    );

    this.putItem("/:projectId/:pcrId/submit-pcr", requestParams<PcrSubmitDto>, this.submitPcr);

    this.deleteItem(
      "/:projectId/:pcrId/:pcrItemId/:costId",
      p => ({ projectId: p.projectId, pcrId: p.pcrId, pcrItemId: p.pcrItemId, costId: p.costId as CostId }),
      this.deleteProjectCost,
    );

    this.deleteItem(
      "/:projectId/:pcrId/:pcrItemId/:costId/labour",
      p => ({ projectId: p.projectId, pcrId: p.pcrId, pcrItemId: p.pcrItemId, costId: p.costId as CostId }),
      this.deleteLabourCost,
    );

    this.deleteItem("/:projectId/:pcrId", p => ({ projectId: p.projectId, id: p.pcrId }), this.delete);
  }

  async create(
    params: ApiParams<"server", { projectId: ProjectId; projectChangeRequestDto: CreatePcrDto }>,
  ): Promise<PCRDto> {
    const context = await contextProvider.start(params);

    const id = (await context.runCommand(
      new CreateProjectChangeRequestCommand(params.projectId, params.projectChangeRequestDto),
    )) as PcrId;

    return context.runQuery(new GetPCRByIdQuery(params.projectId, id));
  }

  async update(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        id: PcrId | PcrItemId;
        pcr: PickRequiredFromPartial<Omit<PCRDto, "items">, "projectId" | "id"> & {
          items?: PickRequiredFromPartial<FullPCRItemDto, "id" | "type">[];
        };
      }
    >,
  ): Promise<PCRDto> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePCRCommand({ projectId: params.projectId, projectChangeRequestId: params.id, pcr: params.pcr }),
    );
    return context.runQuery(new GetPCRByIdQuery(params.projectId, params.id));
  }

  async pcrFilesStep(params: PcrUpdateParams<"server", PcrFilesStepDto>) {
    return await runUpdateCommand(params, new UpdatePcrFilesStepCommand(getParams(params)));
  }

  async approveNewSubcontractor(params: PcrUpdateParams<"server", ApproveNewSubcontractorDto>) {
    return await runUpdateCommand(params, new UpdatePcrApproveNewSubcontractorCommand(getParams(params)));
  }

  async addPartnerAcademicCosts(params: PcrUpdateParams<"server", PcrAddPartnerAcademicCostsDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerAcademicCostsCommand(getParams(params)));
  }

  async addPartnerAcademicOrganisation(params: PcrUpdateParams<"server", PcrAddPartnerAcademicOrganisationDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerAcademicOrganisationCommand(getParams(params)));
  }

  async addPartnerCompanyDetails(params: PcrUpdateParams<"server", PcrAddPartnerCompanyDetailsDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerCompanyDetailsCommand(getParams(params)));
  }

  async addPartnerFinanceContact(params: PcrUpdateParams<"server", PcrAddPartnerFinanceContactDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerFinanceContactCommand(getParams(params)));
  }

  async addPartnerFinancialDetails(params: PcrUpdateParams<"server", PcrAddPartnerFinancialDetailsDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerFinancialDetailsCommand(getParams(params)));
  }

  async addPartnerFundingLevel(params: PcrUpdateParams<"server", PcrAddPartnerFundingLevelDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerFundingLevelCommand(getParams(params)));
  }

  async addPartnerOtherFunding(params: PcrUpdateParams<"server", PcrAddPartnerOtherFundingDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerOtherFundingCommand(getParams(params)));
  }

  async addPartnerOtherSourcesOfFunding(params: PcrUpdateParams<"server", PcrAddPartnerOtherSourcesOfFundingDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerOtherSourcesOfFundingCommand(getParams(params)));
  }

  async addPartnerOrganisationDetails(params: PcrUpdateParams<"server", PcrAddPartnerOrganisationDetailsDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerOrganisationDetailsCommand(getParams(params)));
  }

  async addPartnerProjectLocation(params: PcrUpdateParams<"server", PcrAddPartnerProjectLocationDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerProjectLocationCommand(getParams(params)));
  }

  async addPartnerProjectManager(params: PcrUpdateParams<"server", PcrAddPartnerProjectManagerDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerProjectManagerCommand(getParams(params)));
  }

  async addPartnerRoleAndOrganisation(params: PcrUpdateParams<"server", PcrAddPartnerRoleAndOrganisationDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerRoleAndOrganisationCommand(getParams(params)));
  }

  async addPartnerSummary(params: PcrUpdateParams<"server", PcrAddPartnerSummaryDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerSummaryCommand(getParams(params)));
  }

  async addPartnerProjectCostCapitalUsage(params: PcrUpdateParams<"server", PcrAddPartnerProjectCostCapitalUsageDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerProjectCostCapitalUsageCommand(getParams(params)));
  }

  async addPartnerProjectCostLabour(params: PcrUpdateParams<"server", PcrAddPartnerProjectCostLabourDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerProjectCostLabourCommand(getParams(params)));
  }

  async addPartnerProjectCostMaterials(params: PcrUpdateParams<"server", PcrAddPartnerProjectCostMaterialsDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerProjectCostMaterialsCommand(getParams(params)));
  }

  async addPartnerProjectCostOtherCost(params: PcrUpdateParams<"server", PcrAddPartnerProjectCostOtherCostDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerProjectCostOtherCommand(getParams(params)));
  }

  async addPartnerProjectCostOverhead(params: PcrUpdateParams<"server", PcrAddPartnerProjectCostOverheadDto>) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerProjectCostOverheadCommand(getParams(params)));
  }

  async addPartnerProjectCostSubcontracting(
    params: PcrUpdateParams<"server", PcrAddPartnerProjectCostSubcontractingDto>,
  ) {
    return await runUpdateCommand(params, new UpdatePcrAddPartnerProjectCostSubcontractingCommand(getParams(params)));
  }

  async addPartnerProjectCostTravelAndSubsistence(
    params: PcrUpdateParams<"server", PcrAddPartnerProjectCostTravelAndSubsistenceDto>,
  ) {
    return await runUpdateCommand(
      params,
      new UpdatePcrAddPartnerProjectCostTravelAndSubsistenceCommand(getParams(params)),
    );
  }

  async changeDuration(params: PcrUpdateParams<"server", PcrChangeDurationDto>) {
    return await runUpdateCommand(params, new UpdatePcrChangeDurationCommand(getParams(params)));
  }

  async loanDrawdownChange(params: PcrUpdateParams<"server", LoanDrawdownChangeDto>) {
    return await runUpdateCommand(params, new UpdatePcrLoanDrawdownChangeCommand(getParams(params)));
  }

  async loanDrawdownExtension(params: PcrUpdateParams<"server", LoanDrawdownExtensionDto>) {
    return await runUpdateCommand(params, new UpdatePcrLoanDurationExtensionCommand(getParams(params)));
  }

  async reasoning(params: ApiParams<"server", { projectId: ProjectId; pcrId: PcrId; pcr: ReasoningDto }>) {
    return await runUpdateCommand(
      params,
      new UpdatePcrReasoningCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
  }

  async removePartner(params: PcrUpdateParams<"server", PcrRemovePartnerDto>) {
    return await runUpdateCommand(params, new UpdatePcrRemovePartnerCommand(getParams(params)));
  }

  async renamePartner(params: PcrUpdateParams<"server", PcrRenamePartnerDto>) {
    return await runUpdateCommand(params, new UpdatePcrRenamePartnerCommand(getParams(params)));
  }

  async scopeChange(params: PcrUpdateParams<"server", PcrScopeChangeDto>) {
    return await runUpdateCommand(params, new UpdatePcrScopeChangeCommand(getParams(params)));
  }

  async suspendProject(params: PcrUpdateParams<"server", PcrSuspendProjectDto>) {
    return await runUpdateCommand(params, new UpdatePcrSuspendProjectCommand(getParams(params)));
  }

  async deleteTeamMember(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcr: PcrDeleteTeamMemberDto;
      }
    >,
  ): Promise<{ id: PcrId }> {
    const context = await contextProvider.start(params);

    const res = await context.runCommand(
      new CreatePcrDeleteTeamMemberCommand({
        projectId: params.projectId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return res;
  }

  async inviteTeamMember(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcr: PcrInviteTeamMemberDto;
      }
    >,
  ): Promise<{ id: PcrId }> {
    const context = await contextProvider.start(params);

    const res = await context.runCommand(
      new CreatePcrInviteTeamMemberCommand({
        projectId: params.projectId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return res;
  }

  async replaceTeamMember(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcr: PcrReplaceTeamMemberDto;
      }
    >,
  ): Promise<{ id: PcrId }> {
    const context = await contextProvider.start(params);

    const res = await context.runCommand(
      new CreatePcrReplaceTeamMemberCommand({
        projectId: params.projectId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return res;
  }

  async updateTeamMember(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcr: PcrUpdateTeamMemberDto;
      }
    >,
  ): Promise<{ id: PcrId }> {
    const context = await contextProvider.start(params);

    const res = await context.runCommand(
      new CreatePcrUpdateTeamMemberCommand({
        projectId: params.projectId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return res;
  }

  async submitPcr(params: ApiParams<"server", { projectId: ProjectId; pcrId: PcrId; pcr: PcrSubmitDto }>) {
    const context = await contextProvider.start(params);
    await context.runCommand(
      new SubmitPcrCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async delete(params: ApiParams<"server", { projectId: ProjectId; id: PcrId }>): Promise<boolean> {
    const command = new DeleteProjectChangeRequestCommand(params.projectId, params.id);
    return (await contextProvider.start(params)).runCommand(command);
  }

  async deleteProjectCost(
    params: ApiParams<"server", { projectId: ProjectId; pcrId: PcrId; pcrItemId: PcrItemId; costId: CostId }>,
  ): Promise<boolean> {
    return await runUpdateCommand(
      params,
      new DeleteProjectCostCommand(params.projectId, params.pcrId, params.pcrItemId, params.costId),
    );
  }

  async deleteLabourCost(
    params: ApiParams<"server", { projectId: ProjectId; pcrId: PcrId; pcrItemId: PcrItemId; costId: CostId }>,
  ): Promise<boolean> {
    return await runUpdateCommand(
      params,
      new DeleteLabourCostCommand(params.projectId, params.pcrId, params.pcrItemId, params.costId),
    );
  }
}

export const controller = new Controller();

/**
 * Runs an AuthorisedAsyncCommandBase with the given parameters and returns true if the command
 * runs successfully. The command is run in a context started with the provided parameters.
 */
async function runUpdateCommand(
  params: { user: ISessionUser; traceId: string },
  command: AuthorisedAsyncCommandBase<boolean>,
) {
  const context = await contextProvider.start(params);
  await context.runCommand(command);

  return true;
}

/**
 * generates params to pass from the request to the request controller
 */
function requestParams<T>(p: RequestUrlParams, q: RequestQueryParams, b: T) {
  return {
    projectId: p.projectId,
    pcrId: p.pcrId,
    pcrItemId: p.pcrItemId,
    pcr: processDto(b),
  };
}

/**
 * generates params to pass from the request controller to the command
 */
function getParams<T extends { form: FormTypes }>(params: {
  projectId: ProjectId;
  pcrId: PcrId;
  pcrItemId: PcrItemId;
  pcr: T;
}) {
  return {
    projectId: params.projectId,
    pcrId: params.pcrId,
    pcrItemId: params.pcrItemId,
    pcr: params.pcr,
    form: params.pcr.form as T extends { form: infer TForm } ? TForm : never,
  };
}
