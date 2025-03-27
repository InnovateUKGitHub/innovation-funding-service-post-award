import { PartnerDto } from "@framework/dtos/partnerDto";
import { UpdatePartnerFormType } from "@framework/types/updatePartnerFormTypes";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { contextProvider } from "@server/features/common/contextProvider";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { UpdatePartnerPostcodeCommand } from "@server/features/partners/updatePartnerPostcodeCommand";
import { processDto } from "@shared/processResponse";
import { PostcodeSchema } from "@ui/components/templates/PartnerDetailsEdit/partnerDetailsEdit.zod";
import { z } from "zod";

type UpdatePartnerDto = PickRequiredFromPartial<PartnerDto, "id" | "projectId"> & { form: UpdatePartnerFormType };

export type UpdatePartnerPostcodeDto = z.output<PostcodeSchema>;

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
        projectId: ProjectId;
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
      "/:projectId/:partnerId/postcode",
      (p, q, b: UpdatePartnerPostcodeDto) => ({
        projectId: p.projectId,
        partnerId: p.partnerId,
        partnerDto: processDto(b),
      }),
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
    await ctx.runCommand(
      new UpdatePartnerCommand(params.partnerDto as PartnerDto, params.partnerDto.form, {
        validateBankDetails: params.validateBankDetails,
        verifyBankDetails: params.verifyBankDetails,
      }),
    );
    return ctx.runQuery(new GetByIdQuery(params.partnerId));
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
}

export const controller = new Controller();
