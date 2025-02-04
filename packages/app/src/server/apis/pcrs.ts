import {
  CreatePcrDto,
  FullPCRItemDto,
  LoanDrawdownExtensionDto,
  PcrAddPartnerAcademicCostsDto,
  PcrAddPartnerAcademicOrganisationDto,
  PcrAddPartnerAgreementToPcrDto,
  PcrAddPartnerFinanceContactDto,
  PcrAddPartnerFundingLevelDto,
  PcrAddPartnerJesStepDto,
  PcrAddPartnerOtherFundingDto,
  PcrAddPartnerOtherSourcesOfFundingDto,
  PcrAddPartnerProjectLocationDto,
  PcrAddPartnerProjectManagerDto,
  PcrAddPartnerRoleAndOrganisationDto,
  PcrChangeDurationDto,
  PCRDto,
  PcrInviteTeamMemberDto,
  PcrRemovePartnerDto,
  PcrRenamePartnerDto,
  PcrReplaceTeamMemberDto,
  PcrScopeChangeDto,
  PCRSummaryDto,
  PcrSuspendProjectDto,
  StandalonePcrDto,
} from "@framework/dtos/pcrDtos";
import { contextProvider } from "@server/features/common/contextProvider";
import { CreateProjectChangeRequestCommand } from "@server/features/pcrs/createProjectChangeRequestCommand";
import { DeleteProjectChangeRequestCommand } from "@server/features/pcrs/deleteProjectChangeRequestCommand";
import { GetPCRByIdQuery } from "@server/features/pcrs/getPCRByIdQuery";
import { UpdatePCRCommand } from "@server/features/pcrs/updatePcrCommand";
import { processDto } from "@shared/processResponse";
import { ApiParams, ControllerBaseWithSummary } from "./controllerBase";
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
import { UpdatePcrAddPartnerJesStepCommand } from "@server/features/pcrs/updatePcrAddPartnerJesStepCommand";
import { UpdatePcrAddPartnerOtherFundingCommand } from "@server/features/pcrs/updateAddPartnerOtherFundingCommand";
import { UpdatePcrAddPartnerOtherSourcesOfFundingCommand } from "@server/features/pcrs/updateAddPartnerOtherSourcesOfFundingCommand";
import { UpdatePcrAddPartnerFundingLevelCommand } from "@server/features/pcrs/updatePcrAddPartnerFundingLevelCommand";
import { UpdatePcrAddPartnerAgreementToPcrCommand } from "@server/features/pcrs/updatePcrAddPartnerAgreementToPcrCommand";
import { CreatePcrReplaceTeamMemberCommand } from "@server/features/pcrs/createPcrReplaceTeamMemberCommand";
import { CreatePcrInviteTeamMemberCommand } from "@server/features/pcrs/createPcrInviteTeamMemberCommand";

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

  addPartnerAcademicCosts(
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerAcademicCostsDto;
      }
    >,
  ): Promise<boolean>;

  addPartnerAcademicOrganisation(
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerAcademicOrganisationDto;
      }
    >,
  ): Promise<boolean>;

  addPartnerAgreementToPcr(
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerAgreementToPcrDto;
      }
    >,
  ): Promise<boolean>;

  addPartnerFinanceContact(
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerFinanceContactDto;
      }
    >,
  ): Promise<boolean>;

  addPartnerFundingLevel(
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerFundingLevelDto;
      }
    >,
  ): Promise<boolean>;

  addPartnerJesStep(
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerJesStepDto;
      }
    >,
  ): Promise<boolean>;

  addPartnerOtherFunding(
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerOtherFundingDto;
      }
    >,
  ): Promise<boolean>;

  addPartnerOtherSourcesOfFunding(
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerOtherSourcesOfFundingDto;
      }
    >,
  ): Promise<boolean>;

  addPartnerProjectManager(
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerProjectManagerDto;
      }
    >,
  ): Promise<boolean>;

  addPartnerProjectLocation(
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerProjectLocationDto;
      }
    >,
  ): Promise<boolean>;

  addPartnerRoleAndOrganisation(
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerRoleAndOrganisationDto;
      }
    >,
  ): Promise<boolean>;

  changeDuration: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrItemId: PcrItemId;
        pcrId: PcrId;
        pcr: PcrChangeDurationDto;
      }
    >,
  ) => Promise<boolean>;

  inviteTeamMember: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcr: PcrInviteTeamMemberDto;
      }
    >,
  ) => Promise<{ id: PcrId }>;

  loanDrawdownExtension: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrItemId: PcrItemId;
        pcrId: PcrId;
        pcr: LoanDrawdownExtensionDto;
      }
    >,
  ) => Promise<boolean>;

  replaceTeamMember: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcr: PcrReplaceTeamMemberDto;
      }
    >,
  ) => Promise<{ id: PcrId }>;

  scopeChange: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrScopeChangeDto;
      }
    >,
  ) => Promise<boolean>;

  renamePartner: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrRenamePartnerDto;
      }
    >,
  ) => Promise<boolean>;

  removePartner: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrRemovePartnerDto;
      }
    >,
  ) => Promise<boolean>;

  suspendProject: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrSuspendProjectDto;
      }
    >,
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

    this.putItem(
      "/:projectId/:pcrId",
      (p, _, b: PCRDto) => ({ projectId: p.projectId, id: p.pcrId, pcr: processDto(b) }),
      this.update,
    );
    this.deleteItem("/:projectId/:pcrId", p => ({ projectId: p.projectId, id: p.pcrId }), this.delete);

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/academic-costs",
      (p, _, b: PcrAddPartnerAcademicCostsDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.addPartnerAcademicCosts,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/academic-organisation",
      (p, _, b: PcrAddPartnerAcademicOrganisationDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.addPartnerAcademicOrganisation,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/agreement-to-pcr",
      (p, _, b: PcrAddPartnerAgreementToPcrDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.addPartnerAgreementToPcr,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/finance-contact",
      (p, _, b: PcrAddPartnerFinanceContactDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.addPartnerFinanceContact,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/funding-level",
      (p, _, b: PcrAddPartnerFundingLevelDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.addPartnerFundingLevel,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/jes-step",
      (p, _, b: PcrAddPartnerJesStepDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.addPartnerJesStep,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/other-funding",
      (p, _, b: PcrAddPartnerOtherFundingDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.addPartnerOtherFunding,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/other-sources-of-funding",
      (p, _, b: PcrAddPartnerOtherSourcesOfFundingDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.addPartnerOtherSourcesOfFunding,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/project-location",
      (p, _, b: PcrAddPartnerProjectLocationDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.addPartnerProjectLocation,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/project-manager",
      (p, _, b: PcrAddPartnerProjectManagerDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.addPartnerProjectManager,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/add-partner/role-and-organisation",
      (p, _, b: PcrAddPartnerRoleAndOrganisationDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.addPartnerRoleAndOrganisation,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/change-duration",
      (p, _, b: PcrChangeDurationDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.changeDuration,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/loan-duration-extension",
      (p, _, b: LoanDrawdownExtensionDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.loanDrawdownExtension,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/scope-change",
      (p, _, b: PcrScopeChangeDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.scopeChange,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/rename-partner",
      (p, _, b: PcrRenamePartnerDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.renamePartner,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/remove-partner",
      (p, _, b: PcrRemovePartnerDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.removePartner,
    );

    this.putItem(
      "/:projectId/:pcrId/:pcrItemId/suspend-project",
      (p, _, b: PcrSuspendProjectDto) => ({
        projectId: p.projectId,
        pcrId: p.pcrId,
        pcrItemId: p.pcrItemId,
        pcr: processDto(b),
      }),
      this.suspendProject,
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

  async addPartnerAcademicCosts(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerAcademicCostsDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrAddPartnerAcademicCostsCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async addPartnerAcademicOrganisation(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerAcademicOrganisationDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrAddPartnerAcademicOrganisationCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async addPartnerAgreementToPcr(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerAgreementToPcrDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrAddPartnerAgreementToPcrCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async addPartnerFinanceContact(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerFinanceContactDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrAddPartnerFinanceContactCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async addPartnerFundingLevel(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerFundingLevelDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrAddPartnerFundingLevelCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async addPartnerJesStep(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerJesStepDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrAddPartnerJesStepCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async addPartnerOtherFunding(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerOtherFundingDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrAddPartnerOtherFundingCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async addPartnerOtherSourcesOfFunding(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerOtherSourcesOfFundingDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrAddPartnerOtherSourcesOfFundingCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async addPartnerProjectLocation(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerProjectLocationDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrAddPartnerProjectLocationCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async addPartnerProjectManager(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerProjectManagerDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrAddPartnerProjectManagerCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async addPartnerRoleAndOrganisation(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrAddPartnerRoleAndOrganisationDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrAddPartnerRoleAndOrganisationCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async changeDuration(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrItemId: PcrItemId;
        pcr: PcrChangeDurationDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrChangeDurationCommand({
        projectId: params.projectId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async loanDrawdownExtension(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrItemId: PcrItemId;
        pcrId: PcrId;
        pcr: LoanDrawdownExtensionDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrLoanDurationExtensionCommand({
        projectId: params.projectId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async removePartner(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrRemovePartnerDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrRemovePartnerCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async renamePartner(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrRenamePartnerDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrRenamePartnerCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
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

  async scopeChange(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrScopeChangeDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrScopeChangeCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
        pcr: params.pcr,
        form: params.pcr.form,
      }),
    );
    return true;
  }

  async suspendProject(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        pcrId: PcrId;
        pcrItemId: PcrItemId;
        pcr: PcrSuspendProjectDto;
      }
    >,
  ): Promise<boolean> {
    const context = await contextProvider.start(params);

    await context.runCommand(
      new UpdatePcrSuspendProjectCommand({
        projectId: params.projectId,
        pcrId: params.pcrId,
        pcrItemId: params.pcrItemId,
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
}

export const controller = new Controller();
