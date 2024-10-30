import { PartnerBankDetailsDto } from "@framework/dtos/partnerDto";
import { PartnerBankDetails } from "@framework/entities/partner";
import { SyncCommandBase } from "../common/commandBase";

/**
 * Maps PartnerBankDetails to its equivalent PartnerBankDetailsDto
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 */
export class MapToPartnerBankDetailsDtoCommand extends SyncCommandBase<PartnerBankDetailsDto> {
  public readonly runnableName: string = "MapToPartnerBankDetailsDtoCommand";
  constructor(private readonly item: PartnerBankDetails) {
    super();
  }

  run(): PartnerBankDetailsDto {
    return {
      id: this.item.id,
      accountId: this.item.accountId,
      bankDetails: {
        companyNumber: this.item.companyNumber,
        accountNumber: this.item.accountNumber,
        sortCode: this.item.sortCode,
        firstName: this.item.firstName,
        lastName: this.item.lastName,
        address: {
          accountPostcode: this.item.accountPostcode,
          accountStreet: this.item.accountStreet,
          accountBuilding: this.item.accountBuilding,
          accountLocality: this.item.accountLocality,
          accountTownOrCity: this.item.accountTownOrCity,
        },
      },
    };
  }
}
