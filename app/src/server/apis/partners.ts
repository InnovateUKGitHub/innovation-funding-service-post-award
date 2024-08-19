import { PartnerDto } from "@framework/dtos/partnerDto";
import { ApiParams, ControllerBase } from "@server/apis/controllerBase";
import { contextProvider } from "@server/features/common/contextProvider";
import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { UpdatePartnerCommand } from "@server/features/partners/updatePartnerCommand";
import { processDto } from "@shared/processResponse";

export interface IPartnersApi<Context extends "client" | "server"> {
  updatePartner: (
    params: ApiParams<
      Context,
      {
        partnerId: PartnerId;
        partnerDto: PickRequiredFromPartial<PartnerDto, "id" | "projectId">;
        validateBankDetails?: boolean;
        verifyBankDetails?: boolean;
      }
    >,
  ) => Promise<PartnerDto>;
}

class Controller extends ControllerBase<"server", PartnerDto> implements IPartnersApi<"server"> {
  constructor() {
    super("partners");
    this.putItem(
      "/:partnerId",
      (p, q, b: PartnerDto) => ({
        partnerId: p.partnerId,
        partnerDto: processDto(b),
        validateBankDetails: q.validateBankDetails === "true",
        verifyBankDetails: q.verifyBankDetails === "true",
      }),
      p => this.updatePartner(p),
    );
  }
  public async updatePartner(
    params: ApiParams<
      "server",
      {
        partnerId: PartnerId;
        partnerDto: PickRequiredFromPartial<PartnerDto, "id" | "projectId">;
        validateBankDetails?: boolean;
        verifyBankDetails?: boolean;
      }
    >,
  ) {
    const context = await contextProvider.start(params);
    await context.runCommand(
      new UpdatePartnerCommand(params.partnerDto as PartnerDto, {
        validateBankDetails: params.validateBankDetails,
        verifyBankDetails: params.verifyBankDetails,
      }),
    );

    const query = new GetByIdQuery(params.partnerId);
    return context.runQuery(query);
  }
}

export const controller = new Controller();
