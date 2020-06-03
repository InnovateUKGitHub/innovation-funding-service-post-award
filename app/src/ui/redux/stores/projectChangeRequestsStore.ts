import { StoreBase } from "./storeBase";
import * as Dtos from "@framework/dtos";
import { PCRDto, PCRItemForTimeExtensionDto, PCRStandardItemDto } from "@framework/dtos";
import { PCRDtoValidator, PCRPartnerAdditionItemDtoValidator } from "@ui/validators";
import { ProjectsStore } from "./projectsStore";
import { IEditorStore, RootState } from "../reducers";
import { ApiClient } from "@ui/apiClient";
import { LoadingStatus, Pending } from "@shared/pending";
import { dataLoadAction, messageSuccess } from "../actions";
import { NotFoundError } from "@server/features/common";
import {
  PCRContactRole,
  PCRItemStatus,
  PCRItemType,
  PCRParticipantSize,
  PCRPartnerType,
  PCRProjectLocation,
  PCRProjectRole,
  PCRStatus,
} from "@framework/constants";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { ConfigStore } from "@ui/redux/stores/configStore";
import { CostCategoryType } from "@framework/entities";
import { PCRSpendProfileCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PCRSpendProfileCostDtoValidator } from "@ui/validators/pcrSpendProfileDtoValidator";

export class ProjectChangeRequestStore extends StoreBase {
  constructor(private projectStore: ProjectsStore, private readonly configStore: ConfigStore, getState: () => RootState, queue: (action: any) => void) {
    super(getState, queue);
  }

  private getKeyForRequest(projectId: string, pcrId?: string) {
    return storeKeys.getPcrKey(projectId, pcrId);
  }

  public getById(projectId: string, pcrId: string) {
    return this.getData("pcr", this.getKeyForRequest(projectId, pcrId), p => ApiClient.pcrs.get({ projectId, id: pcrId, ...p }));
  }

  public getItemById(projectId: string, pcrId: string, itemId: string) {
    return this.getById(projectId, pcrId).chain(pcr => {
      const item = pcr.items.find(x => x.id === itemId);
      const error = !item ? new NotFoundError("Item has not bee found in project change request") : null;
      return new Pending(item ? LoadingStatus.Done : LoadingStatus.Failed, item, error);
    });
  }

  public getEditableItemTypes(projectId: string, projectChangeRequestId: string | null) {
    const nonEditableTypes: PCRItemType[] = [
      PCRItemType.ProjectTermination
    ];

    if (!projectChangeRequestId) {
      return this.getAllPcrTypes()
        .then(x => x.map(y => y.type))
        .then(x => x.filter(y => nonEditableTypes.indexOf(y) === -1));
    }

    return this.getById(projectId, projectChangeRequestId).then(x => x.items)
      .then(x => x.map(y => y.type))
      .then(x => x.filter(y => nonEditableTypes.indexOf(y) === -1));
  }

  public getAllForProject(projectId: string) {
    return this.getData("pcrs", storeKeys.getProjectKey(projectId), p => ApiClient.pcrs.getAll({ projectId, ...p }));
  }

  public getAllPcrTypes() {
    return this.getData("pcrTypes", storeKeys.getPcrTypesKey(), p => ApiClient.pcrs.getTypes({ ...p }));
  }

  public getPcrProjectRoles() {
    return this.getData("pcrProjectRoles", storeKeys.getPcrProjectRolesKey(), p => ApiClient.pcrs.getPcrProjectRoles({ ...p }));
  }

  public getPcrPartnerTypes() {
    return this.getData("pcrPartnerTypes", storeKeys.getPcrPartnerTypesKey(), p => ApiClient.pcrs.getPcrPartnerTypes({ ...p }));
  }

  public getPcrParticipantSizes() {
    return this.getData("pcrParticipantSizes", storeKeys.getPcrParticipantSizesKey(), p => ApiClient.pcrs.getParticipantSizes({ ...p }));
  }

  public getPcrProjectLocations() {
    return this.getData("pcrProjectLocations", storeKeys.getPcrProjectLocationsKey(), p => ApiClient.pcrs.getProjectLocations({ ...p }));
  }

  public getPcrSpendProfileCapitalUsageType() {
    return this.getData("pcrSpendProfileCapitalUsageTypes", storeKeys.getPcrSpendProfileCapitalUsageTypesKey(), p => ApiClient.pcrs.getCapitalUsageTypes({ ...p }));
  }

  public getPcrTypeForItem(projectId: string, pcrId: string, itemId: string) {
    const data = Pending.combine({
      itemTypes: this.getAllPcrTypes(),
      pcrItem: this.getItemById(projectId, pcrId, itemId)
    });

    return data.chain(result => {
      const itemType = result.itemTypes.find(x => x.type === result.pcrItem.type);
      const status = itemType ? LoadingStatus.Done : LoadingStatus.Failed;
      const error = itemType ? null : new NotFoundError("Unable to find item type");
      return new Pending(status, itemType, error);
    });
  }

  public getPcrCreateEditor(projectId: string, init?: (dto: PCRDto) => void) {
    return this.getEditor(
      "pcr",
      this.getKeyForRequest(projectId),
      () => Pending.done<PCRDto>({
        id: "",
        projectId,
        status: PCRStatus.Draft,
        statusName: "",
        comments: "",
        reasoningComments: "",
        reasoningStatus: PCRItemStatus.ToDo,
        reasoningStatusName: "",
        requestNumber: NaN,
        started: new Date(),
        lastUpdated: new Date(),
        items: []
      }),
      init,
      (dto) => this.getValidator(projectId, dto, false)
    );
  }

  public getPcrUpdateEditor(projectId: string, pcrId: string, init?: (dto: PCRDto) => void) {
    return this.getEditor(
      "pcr",
      this.getKeyForRequest(projectId, pcrId),
      () => this.getById(projectId, pcrId),
      init,
      (dto) => this.getValidator(projectId, dto, false)
    );
  }

  public getNewSpendProfileCostValidator(editorPending: Pending<IEditorStore<PCRDto, PCRDtoValidator>>, pcrItemId: string, costCategoryPending: Pending<CostCategoryDto>): Pending<PCRSpendProfileCostDtoValidator | undefined>  {
    const data = Pending.combine({editor: editorPending, costCategory: costCategoryPending});
    return data.then(({editor, costCategory}) => {
      const partnerAdditionValidator = editor.validator.items.results.find(x => x.model.id === pcrItemId) as PCRPartnerAdditionItemDtoValidator;
      return partnerAdditionValidator.spendProfile.results[0].costs.results.find(x => !x.model.id && x.model.costCategoryId === costCategory.id);
    });
  }

  public getSpendProfileCostValidator(editorPending: Pending<IEditorStore<PCRDto, PCRDtoValidator>>, pcrItemId: string, costId: string) {
    return editorPending.then(editor => {
      const partnerAdditionValidator = editor.validator.items.results.find(x => x.model.id === pcrItemId) as PCRPartnerAdditionItemDtoValidator;
      return partnerAdditionValidator.spendProfile.results[0].costs.results.find(x => x.model.id === costId)!;
    });
  }

  public getInitialSpendProfileCost(costCategory: CostCategoryDto): PCRSpendProfileCostDto {
    return {id: "", description: "", value: null, costCategory: costCategory.type as CostCategoryType.Unknown, costCategoryId: costCategory.id};
  }

  public updatePcrEditor(saving: boolean, projectId: string, dto: PCRDto, message?: string, onComplete?: (result: PCRDto) => void) {
    this.updateEditor(
      saving,
      "pcr",
      this.getKeyForRequest(projectId, dto.id),
      dto,
      (showErrors) => this.getValidator(projectId, dto, showErrors),
      p => dto.id ? ApiClient.pcrs.update({ projectId, id: dto.id, pcr: dto, ...p }) : ApiClient.pcrs.create({ projectId, projectChangeRequestDto: dto, ...p }),
      (result) => {
        this.queue(dataLoadAction(this.getKeyForRequest(projectId, result.id), "pcr", LoadingStatus.Updated, result));
        if (message) {
          this.queue(messageSuccess(message));
        }
        if (onComplete) {
          onComplete(result);
        }
      }
    );
  }

  public createNewChangeRequestItem(itemType: Dtos.PCRItemTypeDto): (Dtos.PCRItemDto) {
    const baseFields = {
      id: "",
      guidance: "",
      typeName: itemType.displayName,
      status: PCRItemStatus.ToDo,
      statusName: "",
      shortName: "",
    };

    switch (itemType.type) {
      case PCRItemType.MultiplePartnerFinancialVirement:
        return {
          ...baseFields,
          type: itemType.type,
          grantMovingOverFinancialYear: null
        };
      case PCRItemType.SinglePartnerFinancialVirement:
        return {
          ...baseFields,
          type: itemType.type
        };
      case PCRItemType.PartnerAddition:
        return {
          ...baseFields,
          type: itemType.type,
          contact1ProjectRole: PCRContactRole.Unknown,
          contact1ProjectRoleLabel: null,
          contact1Forename: null,
          contact1Surname: null,
          contact1Phone: null,
          contact1Email: null,
          financialYearEndDate: null,
          financialYearEndTurnover: null,
          organisationName: null,
          registeredAddress: null,
          registrationNumber: null,
          projectRole: PCRProjectRole.Unknown,
          partnerType: PCRPartnerType.Unknown,
          organisationType: null,
          projectRoleLabel: null,
          partnerTypeLabel: null,
          spendProfile: {
            pcrItemId: baseFields.id,
            costs: []
          },
          projectLocation: PCRProjectLocation.Unknown,
          projectLocationLabel: null,
          projectCity: "",
          projectPostcode: "",
          participantSize: PCRParticipantSize.Unknown,
          participantSizeLabel: null,
          numberOfEmployees: null,
          contact2ProjectRole: PCRContactRole.Unknown,
          contact2ProjectRoleLabel: null,
          contact2Forename: null,
          contact2Surname: null,
          contact2Phone: null,
          contact2Email: null,
        };
      case PCRItemType.PartnerWithdrawal:
        return {
          ...baseFields,
          type: itemType.type,
          partnerId: null,
          withdrawalDate: null,
          partnerNameSnapshot: null,
        };
      case PCRItemType.AccountNameChange:
        return {
          ...baseFields,
          type: itemType.type,
          partnerId: null,
          accountName: null,
          partnerNameSnapshot: ""
        };
      case PCRItemType.TimeExtension:
        return {
          ...baseFields,
          type: itemType.type,
          additionalMonths: null,
          projectDurationSnapshot: 0,
        };
      case PCRItemType.ScopeChange:
        return {
          ...baseFields,
          type: itemType.type,
          publicDescription: "",
          projectSummary: "",
          projectSummarySnapshot: "",
          publicDescriptionSnapshot: "",
        };
      case PCRItemType.ProjectSuspension:
        return {
          ...baseFields,
          type: itemType.type,
          suspensionStartDate: null,
          suspensionEndDate: null
        };
      case PCRItemType.ProjectTermination:
        return {
          ...baseFields,
          type: itemType.type,
          status: PCRItemStatus.Complete,
        };
      case PCRItemType.PeriodLengthChange:
        return {
          ...baseFields,
          type: itemType.type,
        };
      default:
        throw new Error("Item type not handled");
    }
  }

  private getValidator(projectId: string, dto: PCRDto, showErrors: boolean): any {
    return Pending.combine({
      projectRoles: this.projectStore.getById(projectId).then(x => x.roles),
      original: dto.id ? this.getById(projectId, dto.id) : Pending.done(undefined),
      itemTypes: this.getAllPcrTypes(),
      project: this.projectStore.getById(projectId)
    }).then(x => new PCRDtoValidator(dto, x.projectRoles, x.itemTypes, showErrors, x.project, this.configStore.getConfig().features, x.original));
  }

  public deletePcr(projectId: string, pcrId: string, dto: PCRDto, message?: string, onComplete?: () => void): void {
    this.deleteEditor(
      "pcr",
      this.getKeyForRequest(projectId, pcrId),
      dto,
      () => this.getValidator(projectId, dto, false),
      (p) => ApiClient.pcrs.delete({ projectId, id: pcrId, ...p }),
      () => {
        if (message) {
          this.queue(messageSuccess(message));
        }
        if (onComplete) {
          onComplete();
        }
      }
    );
  }

  public getStatusChanges(projectId: string, projectChangeRequestId: string) {
    return this.getData("projectChangeRequestStatusChanges", this.getKeyForRequest(projectId, projectChangeRequestId), p => ApiClient.pcrs.getStatusChanges({ projectId, projectChangeRequestId, ...p }));
  }

}
