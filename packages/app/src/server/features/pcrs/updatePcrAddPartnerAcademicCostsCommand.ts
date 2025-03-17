import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerAcademicCostsDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import {
  AcademicCostsSchemaType,
  getAcademicCostsSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/academicCosts.zod";
import { parseCurrency } from "@framework/util/numberHelper";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class UpdatePcrAddPartnerAcademicCostsCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  AcademicCostsSchemaType,
  PcrAddPartnerAcademicCostsDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerAcademicCostsCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerAcademicCostsStep;
  protected readonly dto: PcrAddPartnerAcademicCostsDto;

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
    pcr: PcrAddPartnerAcademicCostsDto;
    form: FormTypes.PcrAddPartnerAcademicCostsStep;
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
    return { schema: getAcademicCostsSchema(!!this.dto.markedAsComplete), errorMap: addPartnerErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      button_submit: this.dto.button_submit,
      tsbReference: this.dto.tsbReference,
      costs: this.dto.costs,
      markedAsComplete: !!this.dto.markedAsComplete,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<AcademicCostsSchemaType>,
  ): Promise<boolean> {
    const newCostItems = validatedData.costs
      .filter(x => !x.id)
      .map(x => ({ ...x, value: parseCurrency(x.value), pcrItemId: this.pcrItemId }));
    const updatedCostItems = validatedData.costs
      .filter(x => !!x.id)
      .map(x => ({ ...x, value: parseCurrency(x.value), pcrItemId: this.pcrItemId, id: x.id ?? "" }));

    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_TSBReference__c: validatedData.tsbReference,
    });

    await context.repositories.pcrSpendProfile.insertSpendProfiles(newCostItems);
    await context.repositories.pcrSpendProfile.updateSpendProfiles(updatedCostItems);

    return true;
  }
}
