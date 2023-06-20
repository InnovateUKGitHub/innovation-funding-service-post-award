import { PartnerBankDetailsDto } from "@framework/dtos/partnerDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { QueryBase } from "../common/queryBase";
import { MapToPartnerBankDetailsDtoCommand } from "./mapToPartnerBankDetailsDto";

/**
 * Fetch bank details from Salesforce.
 * You must run this query with the "Bank Details Verification" user context.
 *
 * @author Leondro Lio <leondro.lio@iuk.ukri.org>
 * @see IContext#asBankDetailsValidationUser
 * @example
 *  const unmaskedPartnerDto = await context
 *    .asBankDetailsValidationUser()
 *    .runQuery(new GetBankVerificationDetailsByIdQuery(this.partner.id));
 */
export class GetBankVerificationDetailsByIdQuery extends QueryBase<PartnerBankDetailsDto> {
  protected async accessControl(auth: Authorisation, context: IContext) {
    // Check if the user running the query is the Bank Details Validation User.
    return context.user.email === context.config.bankDetailsValidationUser.serviceUsername;
  }

  constructor(private readonly partnerId: PartnerId) {
    super();
  }

  async run(context: IContext) {
    const partner = await context.repositories.partners.getById(this.partnerId);
    return context.runSyncCommand(new MapToPartnerBankDetailsDtoCommand(partner));
  }
}
