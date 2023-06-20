/* eslint-disable @typescript-eslint/naming-convention */

import { GetAvailableItemTypesQuery } from "./getAvailableItemTypesQuery";
import { GetAllPCRsQuery } from "./getAllPCRsQuery";
import { PCRItemType } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { PCRDto, PCRItemTypeDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { ProjectChangeRequestItemForCreateEntity } from "@framework/entities/projectChangeRequest";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { BadRequestError, ValidationError } from "../common/appError";
import { CommandBase } from "../common/commandBase";
import { GetByIdQuery } from "../projects/getDetailsByIdQuery";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { GetAllForProjectQuery } from "../partners/getAllForProjectQuery";

export class CreateProjectChangeRequestCommand extends CommandBase<string> {
  constructor(private readonly projectId: ProjectId, private readonly projectChangeRequestDto: PCRDto) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.ProjectManager);
  }

  private async insertProjectChangeRequest(
    context: IContext,
    projectChangeRequestDto: PCRDto,
    itemTypes: PCRItemTypeDto[],
  ): Promise<PcrId> {
    const newPCR = {
      projectId: projectChangeRequestDto.projectId,
      reasoningStatus: projectChangeRequestDto.reasoningStatus,
      status: projectChangeRequestDto.status,
      items: projectChangeRequestDto.items.map(x => this.mapItem(projectChangeRequestDto, x, itemTypes)),
    };

    return context.repositories.projectChangeRequests.createProjectChangeRequest(newPCR);
  }

  private async insertStatusChange(context: IContext, projectChangeRequestId: string): Promise<void> {
    const pcrToBeChanged = {
      Acc_ProjectChangeRequest__c: projectChangeRequestId,
      Acc_ExternalComment__c: "",
      Acc_ParticipantVisibility__c: true,
    };

    await context.repositories.projectChangeRequestStatusChange.createStatusChange(pcrToBeChanged);
  }

  protected async run(context: IContext) {
    if (this.projectChangeRequestDto.id) {
      throw new BadRequestError("Project change request has already been created");
    }

    if (this.projectChangeRequestDto.projectId !== this.projectId) {
      throw new BadRequestError("Project type does not match change request project type");
    }

    const itemTypes = await context.runQuery(new GetAvailableItemTypesQuery(this.projectId));
    const projectRoles = await context
      .runQuery(new GetAllProjectRolesForUser())
      .then(x => x.forProject(this.projectId).getRoles());
    const projectDto = await context.runQuery(new GetByIdQuery(this.projectId));
    const partners = await context.runQuery(new GetAllForProjectQuery(this.projectId));
    const projectPcrs = await context.runQuery(new GetAllPCRsQuery(this.projectId));

    const validationResult = new PCRDtoValidator({
      model: this.projectChangeRequestDto,
      role: projectRoles,
      recordTypes: itemTypes,
      showValidationErrors: true,
      project: projectDto,
      original: undefined,
      partners: partners,
      projectPcrs: projectPcrs,
    });

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    const projectChangeRequestId = await this.insertProjectChangeRequest(
      context,
      this.projectChangeRequestDto,
      itemTypes,
    );
    await this.insertStatusChange(context, projectChangeRequestId);
    return projectChangeRequestId;
  }

  private mapItem(
    dto: PCRDto,
    itemDto: PCRItemDto,
    itemTypes: PCRItemTypeDto[],
  ): ProjectChangeRequestItemForCreateEntity {
    const matchedItem = itemTypes.find(t => t.type === itemDto.type);
    if (!matchedItem) throw new Error(`cannot find item matching ${itemDto.type}`);
    const init = {
      projectId: dto.projectId,
      recordTypeId: matchedItem.recordTypeId,
      status: itemDto.status,
    };
    switch (itemDto.type) {
      case PCRItemType.TimeExtension:
        return {
          ...init,
          offsetMonths: itemDto.offsetMonths,
          projectDuration: itemDto.offsetMonths ? itemDto.offsetMonths + itemDto.projectDurationSnapshot : null,
        };
      case PCRItemType.ScopeChange:
        return { ...init, projectSummary: itemDto.projectSummary, publicDescription: itemDto.publicDescription };
      case PCRItemType.ProjectSuspension:
        return {
          ...init,
          suspensionStartDate: itemDto.suspensionStartDate,
          suspensionEndDate: itemDto.suspensionEndDate,
        };
      case PCRItemType.AccountNameChange:
        return { ...init, accountName: itemDto.accountName, partnerId: itemDto.partnerId };
      case PCRItemType.PartnerWithdrawal:
        return { ...init, removalPeriod: itemDto.removalPeriod, partnerId: itemDto.partnerId };
      case PCRItemType.PartnerAddition:
        return {
          ...init,
          contact1ProjectRole: itemDto.contact1ProjectRole,
          contact1Forename: itemDto.contact1Forename,
          contact1Surname: itemDto.contact1Surname,
          contact1Phone: itemDto.contact1Phone,
          contact1Email: itemDto.contact1Email,
          financialYearEndDate: itemDto.financialYearEndDate,
          financialYearEndTurnover: itemDto.financialYearEndTurnover,
          organisationName: itemDto.organisationName,
          registeredAddress: itemDto.registeredAddress,
          registrationNumber: itemDto.registrationNumber,
          projectRole: itemDto.projectRole,
          partnerType: itemDto.partnerType,
          isCommercialWork: itemDto.isCommercialWork,
          projectCity: itemDto.projectCity,
          projectLocation: itemDto.projectLocation,
          projectPostcode: itemDto.projectPostcode,
          participantSize: itemDto.participantSize,
          numberOfEmployees: itemDto.numberOfEmployees,
          contact2ProjectRole: itemDto.contact2ProjectRole,
          contact2Forename: itemDto.contact2Forename,
          contact2Surname: itemDto.contact2Surname,
          contact2Phone: itemDto.contact2Phone,
          contact2Email: itemDto.contact2Email,
          awardRate: itemDto.awardRate,
          hasOtherFunding: itemDto.hasOtherFunding,
          tsbReference: itemDto.tsbReference,
        };
      case PCRItemType.MultiplePartnerFinancialVirement:
        return { ...init, grantMovingOverFinancialYear: itemDto.grantMovingOverFinancialYear };

      case PCRItemType.LoanDrawdownChange:
      default:
        return init;
    }
  }
}
