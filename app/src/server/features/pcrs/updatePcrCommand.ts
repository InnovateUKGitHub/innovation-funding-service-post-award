import { BadRequestError, CommandBase, ValidationError } from "../common";
import { PCRDto, PCRItemDto, PCRItemForPartnerAdditionDto, ProjectRole } from "@framework/dtos";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { Authorisation, IContext, PCRItemType } from "@framework/types";
import { GetAllProjectRolesForUser, GetByIdQuery } from "../projects";
import { mapToPcrDto } from "./mapToPCRDto";
import { GetPCRItemTypesQuery } from "./getItemTypesQuery";
import {
  CostCategoryType,
  ProjectChangeRequestItemEntity,
  ProjectChangeRequestItemForCreateEntity
} from "@framework/entities";
import { GetAllForProjectQuery } from "@server/features/partners";
import { PCRStatus } from "@framework/constants";
import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { sum } from "@framework/util";

export class UpdatePCRCommand extends CommandBase<boolean> {
  constructor(private readonly projectId: string, private readonly projectChangeRequestId: string, private readonly pcr: PCRDto) {
    super();
  }

  protected async accessControl(auth: Authorisation, context: IContext) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  private async insertStatusChange(context: IContext, projectChangeRequestId: string, comments: string, originalStatus: PCRStatus, newStatus: PCRStatus): Promise<void> {
    const shouldPmSee =
      newStatus === PCRStatus.SubmittedToMonitoringOfficer
      || newStatus === PCRStatus.QueriedByMonitoringOfficer
      || (newStatus === PCRStatus.SubmittedToInnovateUK && originalStatus === PCRStatus.QueriedByInnovateUK);

    await context.repositories.projectChangeRequestStatusChange.createStatusChange({
      Acc_ProjectChangeRequest__c: projectChangeRequestId,
      Acc_ExternalComment__c: comments,
      Acc_ParticipantVisibility__c: shouldPmSee
    });
  }

  protected async Run(context: IContext): Promise<boolean> {
    if (this.projectId !== this.pcr.projectId || this.projectChangeRequestId !== this.pcr.id) {
      throw new BadRequestError();
    }

    const projectRoles = await context.runQuery(new GetAllProjectRolesForUser()).then(x => x.forProject(this.projectId).getRoles());
    const itemTypes = await context.runQuery(new GetPCRItemTypesQuery());

    const entityToUpdate = await context.repositories.projectChangeRequests.getById(this.pcr.projectId, this.pcr.id);
    const partners = await context.runQuery(new GetAllForProjectQuery(this.projectId));
    const project = await context.runQuery(new GetByIdQuery(this.projectId));

    const originalDto = mapToPcrDto(entityToUpdate, itemTypes);

    const validationResult = new PCRDtoValidator(this.pcr, projectRoles, itemTypes, true, project, context.config.features, originalDto, partners);

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    entityToUpdate.status = this.pcr.status;
    entityToUpdate.reasoning = this.pcr.reasoningComments;
    entityToUpdate.reasoningStatus = this.pcr.reasoningStatus;
    entityToUpdate.comments = originalDto.status === this.pcr.status ? this.pcr.comments : "";
    await context.repositories.projectChangeRequests.updateProjectChangeRequest(entityToUpdate);

    if (originalDto.status !== this.pcr.status) {
      await this.insertStatusChange(context, this.projectChangeRequestId, this.pcr.comments, originalDto.status, this.pcr.status);
    }

    const paired = this.pcr.items.map(item => ({
      item,
      originalItem: entityToUpdate.items.find(x => x.id === item.id)
    }));

    const itemsToUpdate = paired
      // exclude new items
      .filter(x => !!x.originalItem)
      // get any updates
      .map(x => {
        const updates = this.getItemUpdates(x.originalItem!, x.item);
        return updates ? { ...x.originalItem!, ...updates } : null;
      })
      // filter those that need updating
      .filter(x => !!x)
      .map<ProjectChangeRequestItemEntity>(x => x!)
      ;

    if (itemsToUpdate.length) {
      await context.repositories.projectChangeRequests.updateItems(entityToUpdate, itemsToUpdate);
    }
    const itemsToInsert: ProjectChangeRequestItemForCreateEntity[] = paired
      .filter(x => !x.originalItem)
      .map(x => ({
        recordTypeId: itemTypes.find(t => t.type === x.item.type)!.recordTypeId,
        status: x.item.status,
        projectId: this.projectId,
      }));

    if (itemsToInsert.length) {
      await context.repositories.projectChangeRequests.insertItems(this.projectChangeRequestId, itemsToInsert);
    }

    const partnerAdditionItemDto = this.pcr.items.find(x => x.type === PCRItemType.PartnerAddition) as PCRItemForPartnerAdditionDto;
    if (!!partnerAdditionItemDto) {
      await context.runCommand(new UpdatePCRSpendProfileCommand(this.projectId, partnerAdditionItemDto.id, partnerAdditionItemDto.spendProfile));
    }

    return true;
  }

  // tslint:disable-next-line:cognitive-complexity
  private getItemUpdates(item: ProjectChangeRequestItemEntity, dto: PCRItemDto): Partial<ProjectChangeRequestItemEntity> | null {
    const init = item.status !== dto.status ? { status: dto.status } : null;

    switch (dto.type) {
      case PCRItemType.TimeExtension:
        if (item.additionalMonths !== dto.additionalMonths) {
          return { ...init, additionalMonths: dto.additionalMonths, projectDuration: dto.additionalMonths ? dto.additionalMonths + dto.projectDurationSnapshot : null };
        }
        break;
      case PCRItemType.ScopeChange:
        if (item.projectSummary !== dto.projectSummary || item.publicDescription !== dto.publicDescription) {
          return { ...init, projectSummary: dto.projectSummary, publicDescription: dto.publicDescription };
        }
        break;
      case PCRItemType.ProjectSuspension:
        if (item.suspensionStartDate !== dto.suspensionStartDate || item.suspensionEndDate !== dto.suspensionEndDate) {
          return { ...init, suspensionStartDate: dto.suspensionStartDate, suspensionEndDate: dto.suspensionEndDate };
        }
        break;
      case PCRItemType.AccountNameChange:
        if (item.accountName !== dto.accountName || item.partnerId !== dto.partnerId) {
          return { ...init, accountName: dto.accountName, partnerId: dto.partnerId };
        }
        break;
      case PCRItemType.PartnerWithdrawal:
        if (item.removalPeriod !== dto.removalPeriod || item.partnerId !== dto.partnerId) {
          return { ...init, partnerId: dto.partnerId, removalPeriod: dto.removalPeriod };
        }
        break;
      case PCRItemType.PartnerAddition:
        if (
          item.contact1ProjectRole !== dto.contact1ProjectRole
          || item.contact1Forename !== dto.contact1Forename
          || item.contact1Surname !== dto.contact1Surname
          || item.contact1Phone !== dto.contact1Phone
          || item.contact1Email !== dto.contact1Email
          || item.financialYearEndTurnover !== dto.financialYearEndTurnover
          || item.financialYearEndDate !== dto.financialYearEndDate
          || item.organisationName !== dto.organisationName
          || item.registeredAddress !== dto.registeredAddress
          || item.registrationNumber !== dto.registrationNumber
          || item.projectRole !== dto.projectRole
          || item.partnerType !== dto.partnerType
          || item.isCommercialWork !== dto.isCommercialWork
          || item.projectLocation !== dto.projectLocation
          || item.projectCity !== dto.projectCity
          || item.projectPostcode !== dto.projectPostcode
          || item.participantSize !== dto.participantSize
          || item.numberOfEmployees !== dto.numberOfEmployees
          || item.contact2ProjectRole !== dto.contact2ProjectRole
          || item.contact2Forename !== dto.contact2Forename
          || item.contact2Surname !== dto.contact2Surname
          || item.contact2Phone !== dto.contact2Phone
          || item.contact2Email !== dto.contact2Email
          || item.awardRate !== dto.awardRate
          || item.hasOtherFunding !== dto.hasOtherFunding
          || item.totalOtherFunding !== this.calculateTotalOtherFunding(dto)
          || item.tsbReference !== dto.tsbReference
        ) {
          return {
            ...init,
            contact1ProjectRole: dto.contact1ProjectRole,
            contact1Forename: dto.contact1Forename,
            contact1Surname: dto.contact1Surname,
            contact1Phone: dto.contact1Phone,
            contact1Email: dto.contact1Email,
            financialYearEndTurnover: dto.financialYearEndTurnover,
            financialYearEndDate: dto.financialYearEndDate,
            organisationName: dto.organisationName,
            registeredAddress: dto.registeredAddress,
            registrationNumber: dto.registrationNumber,
            projectRole: dto.projectRole,
            partnerType: dto.partnerType,
            isCommercialWork: dto.isCommercialWork,
            projectLocation: dto.projectLocation,
            projectCity: dto.projectCity,
            projectPostcode: dto.projectPostcode,
            participantSize: dto.participantSize,
            numberOfEmployees: dto.numberOfEmployees,
            contact2ProjectRole: dto.contact2ProjectRole,
            contact2Forename: dto.contact2Forename,
            contact2Surname: dto.contact2Surname,
            contact2Phone: dto.contact2Phone,
            contact2Email: dto.contact2Email,
            awardRate: dto.awardRate,
            hasOtherFunding: dto.hasOtherFunding,
            totalOtherFunding: this.calculateTotalOtherFunding(dto),
            tsbReference: dto.tsbReference,
          };
        }
        break;
      case PCRItemType.MultiplePartnerFinancialVirement:
        if (item.grantMovingOverFinancialYear !== dto.grantMovingOverFinancialYear) {
          return { ...init, grantMovingOverFinancialYear: dto.grantMovingOverFinancialYear };
        }
    }

    return init;
  }

  private calculateTotalOtherFunding(dto: PCRItemForPartnerAdditionDto) {
    return sum(dto.spendProfile.funds.filter(x => x.costCategory === CostCategoryType.Other_Funding), fund => fund.value || 0);
  }
}
