import { BankCheckStatus } from "@framework/constants/partner";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { contextProvider } from "@server/features/common/contextProvider";
import { UpdatePartnerBankDetailsCommand } from "@server/features/partners/updatePartnerBankDetailsCommand";
import { UpdatePartnerBankDetailsVerifyCommand } from "@server/features/partners/updatePartnerBankDetailsVerifyCommand";
import { UpdatePartnerBankStatementCommand } from "@server/features/partners/updatePartnerBankStatementCommand";
import { UpdatePartnerPostcodeCommand } from "@server/features/partners/updatePartnerPostcodeCommand";
import { UpdatePartnerProjectSetupCommand } from "@server/features/partners/updatePartnerProjectSetupCommand";
import { processDto } from "@shared/processResponse";
import { PostcodeSchema } from "@ui/components/templates/PartnerDetailsEdit/partnerDetailsEdit.zod";
import { ProjectSetupSchema } from "@ui/pages/projects/setup/projectSetup.zod";
import { ProjectSetupBankDetailsSchemaType } from "@ui/pages/projects/setup/projectSetupBankDetails.zod";
import { BankStatementSchema } from "@ui/pages/projects/setup/projectSetupBankStatement.zod";
import { z } from "zod";

export type UpdatePartnerPostcodeDto = z.output<PostcodeSchema>;

export type UpdatePartnerBankDetailsDto = z.output<ProjectSetupBankDetailsSchemaType> & {
  bankCheckRetryAttempts: number;
};

export type UpdatePartnerBankStatementDto = z.output<BankStatementSchema>;
export type UpdatePartnerProjectSetupDto = z.output<ProjectSetupSchema>;

export interface IPartnersApi<Context extends "client" | "server"> {
  updatePartnerPostcode: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        partnerId: PartnerId;
        partnerDto: UpdatePartnerPostcodeDto;
      }
    >,
  ) => Promise<boolean>;

  updatePartnerBankDetails: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        partnerId: PartnerId;
        partnerDto: UpdatePartnerBankDetailsDto;
      }
    >,
  ) => Promise<{ bankCheckStatus: BankCheckStatus }>;

  updatePartnerBankDetailsVerify: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        partnerId: PartnerId;
      }
    >,
  ) => Promise<{ bankCheckStatus: BankCheckStatus }>;

  updatePartnerBankStatement: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        partnerId: PartnerId;
        partnerDto: UpdatePartnerBankStatementDto;
      }
    >,
  ) => Promise<boolean>;

  updatePartnerProjectSetup: (
    params: ApiParams<
      Context,
      {
        projectId: ProjectId;
        partnerId: PartnerId;
        partnerDto: UpdatePartnerProjectSetupDto;
      }
    >,
  ) => Promise<boolean>;
}

class Controller
  extends ControllerBase<"server", { bankCheckStatus: BankCheckStatus }>
  implements IPartnersApi<"server">
{
  constructor() {
    super("partners");

    this.putItem(
      "/:projectId/:partnerId/postcode",
      (p, q, b: UpdatePartnerPostcodeDto) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        partnerDto: processDto(b),
      }),
      p => this.updatePartnerPostcode(p),
    );

    this.putItem(
      "/:projectId/:partnerId/bank-details",
      (p, q, b: UpdatePartnerBankDetailsDto) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        partnerDto: processDto(b),
      }),
      p => this.updatePartnerBankDetails(p),
    );

    this.putItem(
      "/:projectId/:partnerId/bank-verify",
      p => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
      }),
      p => this.updatePartnerBankDetailsVerify(p),
    );

    this.putItem(
      "/:projectId/:partnerId/bank-statement",
      (p, q, b) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        partnerDto: processDto(b),
      }),
      p => this.updatePartnerBankStatement(p),
    );

    this.putItem(
      "/:projectId/:partnerId/project-setup",
      (p, q, b) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        partnerDto: processDto(b),
      }),
      p => this.updatePartnerProjectSetup(p),
    );
  }

  public async updatePartnerPostcode(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        partnerId: PartnerId;
        partnerDto: UpdatePartnerPostcodeDto;
      }
    >,
  ) {
    const ctx = await contextProvider.start(params);
    await ctx.runCommand(new UpdatePartnerPostcodeCommand(params.projectId, params.partnerId, params.partnerDto));
    return true;
  }

  public async updatePartnerBankDetails(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        partnerId: PartnerId;
        partnerDto: UpdatePartnerBankDetailsDto;
      }
    >,
  ): Promise<{ bankCheckStatus: BankCheckStatus }> {
    const ctx = await contextProvider.start(params);
    const { bankCheckStatus } = await ctx.runCommand(
      new UpdatePartnerBankDetailsCommand(params.projectId, params.partnerId, params.partnerDto),
    );
    return { bankCheckStatus };
  }

  public async updatePartnerBankDetailsVerify(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        partnerId: PartnerId;
      }
    >,
  ): Promise<{ bankCheckStatus: BankCheckStatus }> {
    const ctx = await contextProvider.start(params);
    const { bankCheckStatus } = await ctx.runCommand(
      new UpdatePartnerBankDetailsVerifyCommand(params.projectId, params.partnerId),
    );
    return { bankCheckStatus };
  }

  public async updatePartnerBankStatement(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        partnerId: PartnerId;
        partnerDto: UpdatePartnerBankStatementDto;
      }
    >,
  ): Promise<boolean> {
    const ctx = await contextProvider.start(params);
    await ctx.runCommand(new UpdatePartnerBankStatementCommand(params.projectId, params.partnerId, params.partnerDto));
    return true;
  }

  public async updatePartnerProjectSetup(
    params: ApiParams<
      "server",
      {
        projectId: ProjectId;
        partnerId: PartnerId;
        partnerDto: UpdatePartnerProjectSetupDto;
      }
    >,
  ): Promise<boolean> {
    const ctx = await contextProvider.start(params);
    await ctx.runCommand(new UpdatePartnerProjectSetupCommand(params.projectId, params.partnerId, params.partnerDto));
    return true;
  }
}

export const controller = new Controller();
