import { PCRDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { UpdatePCRSpendProfileCommand } from "@server/features/pcrs/updatePcrSpendProfileCommand";
import { GetAllPCRsQuery } from "@server/features/pcrs/getAllPCRsQuery";
import { GetPCRItemTypesQuery } from "./getItemTypesQuery";
import { mapToPcrDto } from "./mapToPCRDto";
import { CostCategoryType } from "@framework/constants/enums";
import { PCRStepType, PCRStatus, PCRItemType, PCRItemTypeName } from "@framework/constants/pcrConstants";
import { ProjectRole } from "@framework/constants/project";
import { PCRDto, PCRItemForPartnerAdditionDto, PCRItemDto, FullPCRItemDto } from "@framework/dtos/pcrDtos";
import {
  ProjectChangeRequestItemEntity,
  ProjectChangeRequestItemForCreateEntity,
} from "@framework/entities/projectChangeRequest";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { sumBy } from "@framework/util/numberHelper";
import { BadRequestError, InActiveProjectError, ValidationError } from "../common/appError";
import { CommandBase } from "../common/commandBase";
import { GetByIdQuery } from "../projects/getDetailsByIdQuery";
import { GetAllProjectRolesForUser } from "../projects/getAllProjectRolesForUser";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { GetAllForProjectQuery } from "../partners/getAllForProjectQuery";
import { GetPCRByIdQuery } from "./getPCRByIdQuery";
import { mergePcrData } from "@framework/util/pcrHelper";

type PcrData = PickRequiredFromPartial<Omit<PCRDto, "items">, "projectId" | "id"> & {
  items?: PickRequiredFromPartial<FullPCRItemDto, "id">[];
};

export class UpdatePCRCommand extends CommandBase<boolean> {
  private readonly projectId: ProjectId;
  private readonly projectChangeRequestId: PcrId | PcrItemId;
  private readonly pcr: PcrData;
  private readonly pcrStepType: PCRStepType;

  constructor({
    projectId,
    projectChangeRequestId,
    pcr,
    pcrStepType = PCRStepType.none,
  }: {
    projectId: ProjectId;
    projectChangeRequestId: PcrId | PcrItemId;
    pcr: PcrData;
    pcrStepType?: PCRStepType;
  }) {
    super();
    this.projectId = projectId;
    this.projectChangeRequestId = projectChangeRequestId;
    this.pcr = pcr;
    this.pcrStepType = pcrStepType;
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager, ProjectRole.MonitoringOfficer);
  }

  private async insertStatusChange(
    context: IContext,
    projectChangeRequestId: string,
    comments: string,
    originalStatus: PCRStatus,
    newStatus: PCRStatus,
  ): Promise<void> {
    const nowSubmittedToMo = newStatus === PCRStatus.SubmittedToMonitoringOfficer;
    const nowQueriedToMo = newStatus === PCRStatus.QueriedByMonitoringOfficer;
    const nowQueriedToInnovateUk = newStatus === PCRStatus.SubmittedToInnovateUK;
    const previouslyQueriedByInnovateUk = originalStatus === PCRStatus.QueriedByInnovateUK;

    const shouldPmSee = nowSubmittedToMo || nowQueriedToMo || (nowQueriedToInnovateUk && previouslyQueriedByInnovateUk);

    await context.repositories.projectChangeRequestStatusChange.createStatusChange({
      Acc_ProjectChangeRequest__c: projectChangeRequestId,
      Acc_ExternalComment__c: comments,
      Acc_ParticipantVisibility__c: shouldPmSee,
    });
  }

  protected async run(context: IContext): Promise<boolean> {
    const hasMismatchProjectId = this.projectId !== this.pcr.projectId;
    const hasMismatchPcrId = this.projectChangeRequestId !== this.pcr.id;

    if (hasMismatchProjectId || hasMismatchPcrId) throw new BadRequestError();

    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));

    if (!isProjectActive) throw new InActiveProjectError();

    const pcr = await context.runQuery(new GetPCRByIdQuery(this.pcr.projectId, this.pcr.id));

    const auth = await context.runQuery(new GetAllProjectRolesForUser());
    const projectRoles = auth.forProject(this.projectId).getRoles();
    const itemTypes = await context.runQuery(new GetPCRItemTypesQuery(this.projectId));

    const entityToUpdate = await context.repositories.projectChangeRequests.getById(this.pcr.projectId, this.pcr.id);
    const partners = await context.runQuery(new GetAllForProjectQuery(this.projectId));
    const project = await context.runQuery(new GetByIdQuery(this.projectId));
    const allPcrs = await context.runQuery(new GetAllPCRsQuery(this.projectId));

    const mergedPcr = mergePcrData(this.pcr, pcr);

    const originalDto = mapToPcrDto(entityToUpdate, itemTypes);

    const validationResult = new PCRDtoValidator({
      model: mergedPcr,
      role: projectRoles,
      recordTypes: itemTypes,
      showValidationErrors: true,
      project: project,
      original: originalDto,
      partners: partners,
      projectPcrs: allPcrs,
      pcrStepType: this.pcrStepType,
    });

    if (!validationResult.isValid) throw new ValidationError(validationResult);

    entityToUpdate.status = mergedPcr.status;
    entityToUpdate.reasoning = mergedPcr.reasoningComments;
    entityToUpdate.reasoningStatus = mergedPcr.reasoningStatus;
    entityToUpdate.comments = originalDto.status === mergedPcr.status ? mergedPcr.comments : "";

    await context.repositories.projectChangeRequests.updateProjectChangeRequest(entityToUpdate);

    if (originalDto.status !== mergedPcr.status) {
      await this.insertStatusChange(
        context,
        this.projectChangeRequestId,
        mergedPcr.comments,
        originalDto.status,
        mergedPcr.status,
      );
    }

    const paired = mergedPcr.items.map(item => ({
      item,
      originalItem: entityToUpdate.items.find(x => x.id === item.id),
    }));

    const itemsToUpdate = paired
      // exclude new items
      .filter(x => !!x.originalItem)
      // get any updates
      .map(x => {
        const updates = this.getItemUpdates(x.originalItem as ProjectChangeRequestItemEntity, x.item);
        return updates ? { ...x.originalItem, ...updates } : null;
      })
      // filter those that need updating
      .filter(x => !!x) as ProjectChangeRequestItemEntity[];

    if (itemsToUpdate.length) {
      await context.repositories.projectChangeRequests.updateItems(entityToUpdate, itemsToUpdate);
    }

    const itemsToInsert: ProjectChangeRequestItemForCreateEntity[] = paired
      .filter(x => !x.originalItem)
      .map(x => {
        const itemType = itemTypes.find(t => t.type === x.item.type);
        if (!itemType) throw new Error(`Cannot find item matching ${x.item.type}`);
        return {
          recordTypeId: itemType.recordTypeId,
          status: x.item.status,
          projectId: this.projectId,
        };
      });

    if (itemsToInsert.length) {
      await context.repositories.projectChangeRequests.insertItems(this.projectChangeRequestId, itemsToInsert);
    }

    if (auth.forProject(this.projectId).hasRole(ProjectRole.ProjectManager)) {
      const partnerAdditionItemDto = mergedPcr?.items?.find(
        x => x.type === PCRItemType.PartnerAddition,
      ) as PCRItemForPartnerAdditionDto;

      if (partnerAdditionItemDto) {
        await context.runCommand(
          new UpdatePCRSpendProfileCommand(
            this.projectId,
            partnerAdditionItemDto.id,
            partnerAdditionItemDto.spendProfile ?? {
              costs: [],
              funds: [],
              pcrItemId: undefined,
            },
          ),
        );
      }
    }

    return true;
  }

  private getItemUpdates(
    item: ProjectChangeRequestItemEntity,
    dto: PCRItemDto,
  ): Partial<ProjectChangeRequestItemEntity> | null {
    const statusChange = item.status !== dto.status;
    const init = statusChange ? { status: dto.status } : null;
    switch (dto.type) {
      case PCRItemType.TimeExtension:
        if (statusChange || item.offsetMonths !== dto.offsetMonths) {
          return {
            ...init,
            offsetMonths: dto.offsetMonths,
            projectDuration: dto.offsetMonths ? dto.offsetMonths + dto.projectDurationSnapshot : null,
            shortName: PCRItemTypeName.TimeExtension,
          };
        }
        break;
      case PCRItemType.ScopeChange:
        if (
          statusChange ||
          item.projectSummary !== dto.projectSummary ||
          item.publicDescription !== dto.publicDescription
        ) {
          return { ...init, projectSummary: dto.projectSummary, publicDescription: dto.publicDescription };
        }
        break;
      case PCRItemType.ProjectSuspension:
        if (
          statusChange ||
          item.suspensionStartDate !== dto.suspensionStartDate ||
          item.suspensionEndDate !== dto.suspensionEndDate
        ) {
          return { ...init, suspensionStartDate: dto.suspensionStartDate, suspensionEndDate: dto.suspensionEndDate };
        }
        break;
      case PCRItemType.AccountNameChange:
        if (statusChange || item.accountName !== dto.accountName || item.partnerId !== dto.partnerId) {
          return { ...init, accountName: dto.accountName, partnerId: dto.partnerId };
        }
        break;
      case PCRItemType.PartnerWithdrawal:
        if (statusChange || item.removalPeriod !== dto.removalPeriod || item.partnerId !== dto.partnerId) {
          return { ...init, partnerId: dto.partnerId, removalPeriod: dto.removalPeriod };
        }
        break;
      case PCRItemType.PartnerAddition:
        if (
          statusChange ||
          item.contact1ProjectRole !== dto.contact1ProjectRole ||
          item.contact1Forename !== dto.contact1Forename ||
          item.contact1Surname !== dto.contact1Surname ||
          item.contact1Phone !== dto.contact1Phone ||
          item.contact1Email !== dto.contact1Email ||
          item.financialYearEndTurnover !== dto.financialYearEndTurnover ||
          item.financialYearEndDate !== dto.financialYearEndDate ||
          item.organisationName !== dto.organisationName ||
          item.registeredAddress !== dto.registeredAddress ||
          item.registrationNumber !== dto.registrationNumber ||
          item.projectRole !== dto.projectRole ||
          item.partnerType !== dto.partnerType ||
          item.isCommercialWork !== dto.isCommercialWork ||
          item.projectLocation !== dto.projectLocation ||
          item.projectCity !== dto.projectCity ||
          item.projectPostcode !== dto.projectPostcode ||
          item.participantSize !== dto.participantSize ||
          item.numberOfEmployees !== dto.numberOfEmployees ||
          item.contact2ProjectRole !== dto.contact2ProjectRole ||
          item.contact2Forename !== dto.contact2Forename ||
          item.contact2Surname !== dto.contact2Surname ||
          item.contact2Phone !== dto.contact2Phone ||
          item.contact2Email !== dto.contact2Email ||
          item.awardRate !== dto.awardRate ||
          item.hasOtherFunding !== dto.hasOtherFunding ||
          item.totalOtherFunding !== this.calculateTotalOtherFunding(dto) ||
          item.tsbReference !== dto.tsbReference
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
        if (statusChange || item.grantMovingOverFinancialYear !== dto.grantMovingOverFinancialYear) {
          return {
            ...init,
            grantMovingOverFinancialYear: dto.grantMovingOverFinancialYear,
          };
        }
        break;

      case PCRItemType.LoanDrawdownExtension: {
        if (
          dto.availabilityPeriod &&
          dto.availabilityPeriodChange &&
          dto.extensionPeriod &&
          dto.extensionPeriodChange &&
          dto.repaymentPeriod &&
          dto.repaymentPeriodChange
        ) {
          return {
            ...init,
            availabilityPeriodChange: dto.availabilityPeriodChange - dto.availabilityPeriod,
            extensionPeriodChange: dto.extensionPeriodChange - dto.extensionPeriod,
            repaymentPeriodChange: dto.repaymentPeriodChange - dto.repaymentPeriod,
          };
        }

        break;
      }
    }

    return init;
  }

  private calculateTotalOtherFunding(dto: PCRItemForPartnerAdditionDto) {
    return sumBy(
      dto.spendProfile.funds.filter(
        x =>
          x.costCategory === CostCategoryType.Other_Public_Sector_Funding ||
          x.costCategory === CostCategoryType.Other_Funding,
      ),
      fund => fund.value || 0,
    );
  }
}
