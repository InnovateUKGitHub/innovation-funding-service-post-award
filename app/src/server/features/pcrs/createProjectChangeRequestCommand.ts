import { BadRequestError, CommandBase, Configuration, ValidationError } from "@server/features/common";
import { PCRDto, PCRItemDto, PCRItemTypeDto, ProjectDto, ProjectRole } from "@framework/dtos";
import { Authorisation, IContext } from "@framework/types";
import { GetPCRItemTypesQuery } from "@server/features/pcrs/getItemTypesQuery";
import { ProjectChangeRequestItemForCreateEntity } from "@framework/entities";
import { PCRDtoValidator } from "@ui/validators";
import { GetAllProjectRolesForUser, GetByIdQuery } from "@server/features/projects";
import { PCRItemType } from "@framework/constants";

export class CreateProjectChangeRequestCommand extends CommandBase<string> {
  constructor(
    private readonly projectId: string,
    private readonly projectChangeRequestDto: PCRDto
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasRole(ProjectRole.ProjectManager);
  }

  private async insertProjectChangeRequest(context: IContext, projectChangeRequestDto: PCRDto, itemTypes: PCRItemTypeDto[]): Promise<string> {
    const project = await context.runQuery(new GetByIdQuery(this.projectId));
    return context.repositories.projectChangeRequests.createProjectChangeRequest({
      projectId: projectChangeRequestDto.projectId,
      reasoningStatus: projectChangeRequestDto.reasoningStatus,
      status: projectChangeRequestDto.status,
      items: projectChangeRequestDto.items.map(x => this.mapItem(projectChangeRequestDto, x, itemTypes, project))
    });
  }

  private async insertStatusChange(context: IContext, projectChangeRequestId: string): Promise<void> {
    await context.repositories.projectChangeRequestStatusChange.createStatusChange({
      Acc_ProjectChangeRequest__c: projectChangeRequestId,
      Acc_ExternalComment__c: "",
      Acc_ParticipantVisibility__c: true,
    });
  }

  protected async Run(context: IContext) {

    if (this.projectChangeRequestDto.id) {
      throw new BadRequestError("Project change request has already been created");
    }

    if (this.projectChangeRequestDto.projectId !== this.projectId) {
      throw new BadRequestError("Project type does not match change request project type");
    }

    const itemTypes = await context.runQuery(new GetPCRItemTypesQuery());
    const projectRoles = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.forProject(this.projectId).getRoles());
    const projectDto = await context.runQuery(new GetByIdQuery(this.projectId));
    const validationResult = new PCRDtoValidator(this.projectChangeRequestDto, projectRoles, itemTypes,true, projectDto, context.config.features);

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    const projectChangeRequestId = await this.insertProjectChangeRequest(context, this.projectChangeRequestDto, itemTypes);
    await this.insertStatusChange(context, projectChangeRequestId);
    return projectChangeRequestId;
  }

  private mapItem(dto: PCRDto, itemDto: PCRItemDto, itemTypes: PCRItemTypeDto[], project: ProjectDto): ProjectChangeRequestItemForCreateEntity {
    const init = {
      projectId: dto.projectId,
      recordTypeId: itemTypes.find(t => t.type === itemDto.type)!.recordTypeId,
      status: itemDto.status
    };
    switch (itemDto.type) {
      case PCRItemType.TimeExtension:
          return { ...init, additionalMonths: itemDto.additionalMonths, projectDuration: itemDto.additionalMonths ? itemDto.additionalMonths + itemDto.projectDurationSnapshot : null };
      case PCRItemType.ScopeChange:
          return { ...init, projectSummary: itemDto.projectSummary, publicDescription: itemDto.publicDescription };
      case PCRItemType.ProjectSuspension:
          return { ...init, suspensionStartDate: itemDto.suspensionStartDate, suspensionEndDate: itemDto.suspensionEndDate };
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
      default:
        return init;
    }
  }
}
