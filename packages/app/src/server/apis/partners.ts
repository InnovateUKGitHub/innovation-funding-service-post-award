import { PartnerDto } from "@framework/dtos/partnerDto";
import { UpdatePartnerFormType } from "@framework/types/updatePartnerFormTypes";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { contextProvider } from "@server/features/common/contextProvider";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { ProjectSetupBankStatementCommand } from "@server/features/partners/projectSetupBankStatementCommand";
import { ProjectSetupCommand } from "@server/features/partners/projectSetupCommand";
import { ProjectSetupPostcodeCommand } from "@server/features/partners/projectSetupPostcodeCommand";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { processDto } from "@shared/processResponse";
import { FormTypes } from "@ui/zod/FormTypes";

type UpdatePartnerDto = PickRequiredFromPartial<PartnerDto, "id" | "projectId"> & { form: UpdatePartnerFormType };

type UpdatePartnerPostcodeDto = UpdatePartnerDto & {
  postcode: string;
  form: FormTypes.ProjectSetupPostcode | FormTypes.PartnerDetailsEdit;
};

export interface IPartnersApi<Context extends "client" | "server"> {
  updatePartner: (
    params: ApiParams<
      Context,
      {
        partnerId: PartnerId;
        partnerDto: UpdatePartnerDto;
        validateBankDetails?: boolean;
        verifyBankDetails?: boolean;
      }
    >,
  ) => Promise<PartnerDto>;

  updatePartnerPostcode: (
    params: ApiParams<
      Context,
      {
        partnerId: PartnerId;
        partnerDto: UpdatePartnerPostcodeDto;
      }
    >,
  ) => Promise<boolean>;
}

class Controller extends ControllerBase<"server", PartnerDto> implements IPartnersApi<"server"> {
  constructor() {
    super("partners");
    this.putItem(
      "/:partnerId",
      (p, q, b: UpdatePartnerDto) => ({
        partnerId: p.partnerId,
        partnerDto: processDto(b),
        validateBankDetails: q.validateBankDetails === "true",
        verifyBankDetails: q.verifyBankDetails === "true",
      }),
      p => this.updatePartner(p),
    );
    this.putItem(
      "/:partnerId/update-postcode",
      (p, q, b: UpdatePartnerPostcodeDto) => ({ partnerId: p.partnerId, partnerDto: processDto(b) }),
      p => this.updatePartnerPostcode(p),
    );
  }

  public async updatePartner(
    params: ApiParams<
      "server",
      {
        partnerId: PartnerId;
        partnerDto: UpdatePartnerDto;
        validateBankDetails?: boolean;
        verifyBankDetails?: boolean;
      }
    >,
  ) {
    const ctx = await contextProvider.start(params);
    switch (params.partnerDto.form) {
      case FormTypes.ProjectSetupPostcode:
        await ctx.runCommand(new ProjectSetupPostcodeCommand(params.partnerDto as PartnerDto, params.partnerDto.form));
        break;
      case FormTypes.ProjectSetup:
        await ctx.runCommand(new ProjectSetupCommand(params.partnerDto as PartnerDto, params.partnerDto.form));
        break;
      case FormTypes.ProjectSetupBankStatement:
        await ctx.runCommand(
          new ProjectSetupBankStatementCommand(params.partnerDto as PartnerDto, params.partnerDto.form),
        );
        break;
      default:
        await ctx.runCommand(
          new UpdatePartnerCommand(params.partnerDto as PartnerDto, params.partnerDto.form, {
            validateBankDetails: params.validateBankDetails,
            verifyBankDetails: params.verifyBankDetails,
          }),
        );
        break;
    }

    return ctx.runQuery(new GetByIdQuery(params.partnerId));
  }

  public async updatePartnerPostcode(
    params: ApiParams<"server", { partnerId: PartnerId; partnerDto: UpdatePartnerPostcodeDto }>,
  ) {
    const ctx = await contextProvider.start(params);
    await ctx.runCommand(new ProjectSetupPostcodeCommand(params.partnerDto as PartnerDto, params.partnerDto.form));
    return true; // if it gets this far, it succeeded
  }
}

export const controller = new Controller();
