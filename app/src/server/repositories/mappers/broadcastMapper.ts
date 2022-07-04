import { BroadcastDto } from "@framework/dtos/BroadcastDto";
import { ISalesforceBroadcast } from "@server/repositories/broadcastRepository";
import { parseSfLongTextArea } from "@server/util/salesforce-string-helpers";

import { SalesforceBaseMapper } from "./salesforceMapperBase";

export class BroadcastMapper extends SalesforceBaseMapper<ISalesforceBroadcast, BroadcastDto> {
  public map(item: ISalesforceBroadcast): BroadcastDto {
    return {
      id: item.Id,
      title: item.Name,
      startDate: this.clock.parseRequiredSalesforceDateTime(item.Acc_StartDate__c),
      endDate: this.clock.parseRequiredSalesforceDateTime(item.Acc_EndDate__c),
      content: parseSfLongTextArea(item.Acc_Message__c),
    };
  }
}
