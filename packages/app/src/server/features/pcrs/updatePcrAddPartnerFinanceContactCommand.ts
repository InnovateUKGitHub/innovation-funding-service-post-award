import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerFinanceContactDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";

import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import {
  FinanceContactSchemaType,
  getFinanceContactSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/financeContact.zod";
import { PcrContactRoleMapper } from "@framework/mappers/pcr";
import { PCRContactRole, PCRItemStatus } from "@framework/constants/pcrConstants";

export class UpdatePcrAddPartnerFinanceContactCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  FinanceContactSchemaType,
  PcrAddPartnerFinanceContactDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerFinanceContactCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerFinanceContactStep;
  protected readonly dto: PcrAddPartnerFinanceContactDto;

  constructor({
    projectId,
    pcrId,
    pcrItemId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcrId: PcrId;
    pcrItemId: PcrItemId;
    pcr: PcrAddPartnerFinanceContactDto;
    form: FormTypes.PcrAddPartnerFinanceContactStep;
  }) {
    super();
    this.projectId = projectId;
    this.pcrId = pcrId;
    this.pcrItemId = pcrItemId;
    this.dto = pcr;
    this.form = form;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected async getZodSchema() {
    return { schema: getFinanceContactSchema(!!this.dto.markedAsComplete), errorMap: addPartnerErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      button_submit: this.dto.button_submit,
      markedAsComplete: !!this.dto.markedAsComplete,
      contact1Email: this.dto.contact1Email,
      contact1Forename: this.dto.contact1Forename,
      contact1Surname: this.dto.contact1Surname,
      contact1Phone: this.dto.contact1Phone,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<FinanceContactSchemaType>,
  ): Promise<boolean> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_Contact1ProjectRole__c: new PcrContactRoleMapper().mapToSalesforcePCRProjectRole(
        PCRContactRole.FinanceContact,
      ),
      Acc_Contact1Forename__c: validatedData.contact1Forename,
      Acc_Contact1Surname__c: validatedData.contact1Surname,
      Acc_Contact1Phone__c: validatedData.contact1Phone,
      Acc_Contact1EmailAddress__c: validatedData.contact1Email,
    });

    return true;
  }
}
