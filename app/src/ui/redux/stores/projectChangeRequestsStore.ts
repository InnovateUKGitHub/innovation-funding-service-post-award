import { LoadingStatus, CostCategoryType } from "@framework/constants/enums";
import {
  PCRItemType,
  PCRStatus,
  PCRItemStatus,
  PCRStepType,
  PCRContactRole,
  PCRProjectRole,
  PCRPartnerType,
  PCROrganisationType,
  PCRProjectLocation,
  PCRParticipantSize,
} from "@framework/constants/pcrConstants";
import { TypeOfAid, ProjectRole } from "@framework/constants/project";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { PCRDto, PCRItemTypeDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { PCRSpendProfileCostDto } from "@framework/dtos/pcrSpendProfileDto";
import { convertRolesToPermissionsValue } from "@framework/util/rolesToPermissions";
import { NotFoundError } from "@shared/appError";
import { Pending } from "@shared/pending";
import { apiClient } from "@ui/apiClient";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PCRDtoValidator, PCRPartnerAdditionItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { PCRSpendProfileCostDtoValidator } from "@ui/validation/validators/pcrSpendProfileDtoValidator";
import { dataLoadAction } from "../actions/common/dataLoad";
import { messageSuccess } from "../actions/common/messageActions";
import { RootActionsOrThunk } from "../actions/root";
import { IEditorStore } from "../reducers/editorsReducer";
import { RootState } from "../reducers/rootReducer";
import { PartnersStore } from "./partnersStore";
import { ProjectsStore } from "./projectsStore";
import { StoreBase } from "./storeBase";

export class ProjectChangeRequestStore extends StoreBase {
  constructor(
    private readonly projectStore: ProjectsStore,
    private readonly partnersStore: PartnersStore,
    getState: () => RootState,
    queue: (action: RootActionsOrThunk) => void,
  ) {
    super(getState, queue);
  }

  private getKeyForRequest(projectId: ProjectId, pcrId?: PcrId) {
    return storeKeys.getPcrKey(projectId, pcrId);
  }

  public getById(projectId: ProjectId, pcrId: PcrId) {
    return this.getData("pcr", this.getKeyForRequest(projectId, pcrId), p =>
      apiClient.pcrs.get({ projectId, id: pcrId, ...p }),
    );
  }

  public getItemById(projectId: ProjectId, pcrId: PcrId, itemId: PcrItemId) {
    return this.getById(projectId, pcrId).chain(pcr => {
      const item = pcr.items.find(x => x.id === itemId);
      const error = !item ? new NotFoundError("Item has not bee found in project change request") : null;
      return new Pending(item ? LoadingStatus.Done : LoadingStatus.Failed, item, error);
    });
  }

  public getEditableItemTypes(projectId: ProjectId, projectChangeRequestId: PcrId | null) {
    const nonEditableTypes: PCRItemType[] = [PCRItemType.ProjectTermination];

    if (!projectChangeRequestId) {
      return this.getAllPcrTypes(projectId)
        .then(x => x.map(y => y.type))
        .then(x => x.filter(y => nonEditableTypes.indexOf(y) === -1));
    }

    return this.getById(projectId, projectChangeRequestId)
      .then(x => x.items)
      .then(x => x.map(y => y.type))
      .then(x => x.filter(y => nonEditableTypes.indexOf(y) === -1));
  }

  public getAllForProject(projectId: ProjectId) {
    return this.getData("pcrs", storeKeys.getProjectKey(projectId), p => apiClient.pcrs.getAll({ projectId, ...p }));
  }

  public getAllPcrTypes(projectId: ProjectId) {
    return this.getData("pcrTypes", storeKeys.getPcrTypesKey(), p => apiClient.pcrs.getTypes({ ...p, projectId }));
  }

  public getAllAvailablePcrTypes(projectId: ProjectId, pcrId?: PcrId) {
    return this.getData("pcrAvailableTypes", storeKeys.pcrAvailableTypesKey(projectId), p =>
      apiClient.pcrs.getAvailableTypes({ ...p, projectId, pcrId }),
    );
  }

  public getTimeExtensionOptions(projectId: ProjectId) {
    return this.getData("pcrTimeExtensionOptions", storeKeys.pcrTimeExtensionOptionsKey(projectId), p =>
      apiClient.pcrs.getTimeExtensionOptions({ ...p, projectId }),
    );
  }

  public getPcrProjectRoles() {
    return this.getData("pcrProjectRoles", storeKeys.getPcrProjectRolesKey(), p =>
      apiClient.pcrs.getPcrProjectRoles({ ...p }),
    );
  }

  public getPcrPartnerTypes() {
    return this.getData("pcrPartnerTypes", storeKeys.getPcrPartnerTypesKey(), p =>
      apiClient.pcrs.getPcrPartnerTypes({ ...p }),
    );
  }

  public getPcrParticipantSizes() {
    return this.getData("pcrParticipantSizes", storeKeys.getPcrParticipantSizesKey(), p =>
      apiClient.pcrs.getParticipantSizes({ ...p }),
    );
  }

  public getPcrProjectLocations() {
    return this.getData("pcrProjectLocations", storeKeys.getPcrProjectLocationsKey(), p =>
      apiClient.pcrs.getProjectLocations({ ...p }),
    );
  }

  public getPcrSpendProfileCapitalUsageType() {
    return this.getData("pcrSpendProfileCapitalUsageTypes", storeKeys.getPcrSpendProfileCapitalUsageTypesKey(), p =>
      apiClient.pcrs.getCapitalUsageTypes({ ...p }),
    );
  }

  public getPcrSpendProfileOverheadRateOptions() {
    return this.getData("pcrSpendProfileOverheadRateOptions", storeKeys.getPcrSpendProfileOverheadRateOptionsKey(), p =>
      apiClient.pcrs.getOverheadRateOptions({ ...p }),
    );
  }

  public getPcrTypeForItem(projectId: ProjectId, pcrId: PcrId, itemId: PcrItemId) {
    const data = Pending.combine({
      itemTypes: this.getAllPcrTypes(projectId),
      pcrItem: this.getItemById(projectId, pcrId, itemId),
    });

    return data.chain(result => {
      const itemType = result.itemTypes.find(x => x.type === result.pcrItem.type);
      const status = itemType ? LoadingStatus.Done : LoadingStatus.Failed;
      const error = itemType ? null : new NotFoundError("Unable to find item type");
      return new Pending(status, itemType, error);
    });
  }

  public getPcrCreateEditor(projectId: ProjectId, init?: (dto: PCRDto) => void) {
    return this.getEditor(
      "pcr",
      this.getKeyForRequest(projectId),
      () =>
        Pending.done<PCRDto>({
          id: "" as PcrId,
          projectId,
          status: PCRStatus.DraftWithProjectManager,
          statusName: "",
          comments: "",
          reasoningComments: "",
          reasoningStatus: PCRItemStatus.ToDo,
          reasoningStatusName: "",
          requestNumber: NaN,
          started: new Date(),
          lastUpdated: new Date(),
          items: [],
        }),
      init,
      dto => this.getValidator({ projectId, dto, pcrStepType: PCRStepType.none, showErrors: false }),
    );
  }

  public getPcrUpdateEditor(projectId: ProjectId, pcrId: PcrId, init?: (dto: PCRDto) => void) {
    return this.getEditor(
      "pcr",
      this.getKeyForRequest(projectId, pcrId),
      () => this.getById(projectId, pcrId),
      init,
      dto => this.getValidator({ projectId, dto, pcrStepType: PCRStepType.none, showErrors: false }),
    );
  }

  public getNewSpendProfileCostValidator(
    editorPending: Pending<IEditorStore<PCRDto, PCRDtoValidator>>,
    pcrItemId: PcrItemId,
    costCategoryPending: Pending<CostCategoryDto>,
  ): Pending<PCRSpendProfileCostDtoValidator | undefined> {
    const data = Pending.combine({ editor: editorPending, costCategory: costCategoryPending });
    return data.then(({ editor, costCategory }) => {
      const partnerAdditionValidator = editor.validator.items.results.find(
        x => x.model.id === pcrItemId,
      ) as PCRPartnerAdditionItemDtoValidator;
      return partnerAdditionValidator.spendProfile.results[0].costs.results.find(
        x => !x.model.id && x.model.costCategoryId === costCategory.id,
      );
    });
  }

  public getSpendProfileCostValidator(
    editorPending: Pending<IEditorStore<PCRDto, PCRDtoValidator>>,
    pcrItemId: PcrItemId,
    costId: string,
  ) {
    return editorPending.then(editor => {
      const partnerAdditionValidator = editor.validator.items.results.find(
        x => x.model.id === pcrItemId,
      ) as PCRPartnerAdditionItemDtoValidator;
      return partnerAdditionValidator.spendProfile.results[0].costs.results.find(x => x.model.id === costId);
    });
  }

  public getInitialSpendProfileCost(costCategory: CostCategoryDto): PCRSpendProfileCostDto {
    return {
      id: "" as PcrId,
      description: "",
      value: null,
      costCategory: costCategory.type as CostCategoryType.Other_Costs,
      costCategoryId: costCategory.id,
    };
  }

  public updatePcrEditor({
    saving,
    projectId,
    pcrStepType,
    pcrStepId,
    dto,
    message,
    onComplete,
  }: {
    saving: boolean;
    projectId: ProjectId;
    pcrStepType?: PCRStepType;
    pcrStepId?: PcrItemId;
    dto: PCRDto;
    message?: string;
    onComplete?: (result: PCRDto) => void;
  }) {
    this.updateEditor(
      saving,
      "pcr",
      this.getKeyForRequest(projectId, dto.id),
      dto,
      showErrors => this.getValidator({ projectId, dto, pcrStepType, pcrStepId, showErrors }),
      p =>
        dto.id
          ? apiClient.pcrs.update({ projectId, id: dto.id, pcr: dto, ...p })
          : apiClient.pcrs.create({ projectId, projectChangeRequestDto: dto, ...p }),
      result => {
        this.queue(dataLoadAction(this.getKeyForRequest(projectId, result.id), "pcr", LoadingStatus.Updated, result));
        if (message) {
          this.queue(messageSuccess(message));
        }
        if (onComplete) {
          onComplete(result);
        }
      },
    );
  }

  public createNewChangeRequestItem(itemType: PCRItemTypeDto): PCRItemDto {
    const baseFields = {
      id: "" as PcrItemId,
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
          grantMovingOverFinancialYear: null,
        };
      case PCRItemType.PartnerAddition:
        return {
          ...baseFields,
          type: itemType.type,
          contact1ProjectRole: PCRContactRole.Unknown,
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
          isCommercialWork: null,
          typeOfAid: TypeOfAid.Unknown,
          organisationType: PCROrganisationType.Unknown,
          projectRoleLabel: null,
          partnerTypeLabel: null,
          spendProfile: {
            pcrItemId: baseFields.id,
            costs: [],
            funds: [],
          },
          tsbReference: null,
          projectLocation: PCRProjectLocation.Unknown,
          projectLocationLabel: null,
          projectCity: "",
          projectPostcode: "",
          participantSize: PCRParticipantSize.Unknown,
          participantSizeLabel: null,
          numberOfEmployees: null,
          contact2ProjectRole: PCRContactRole.Unknown,
          contact2Forename: null,
          contact2Surname: null,
          contact2Phone: null,
          contact2Email: null,
          awardRate: null,
          hasOtherFunding: null,
          totalOtherFunding: null,
        };
      case PCRItemType.PartnerWithdrawal:
        return {
          ...baseFields,
          type: itemType.type,
          partnerId: null,
          partnerNameSnapshot: null,
          removalPeriod: null,
        };
      case PCRItemType.AccountNameChange:
        return {
          ...baseFields,
          type: itemType.type,
          partnerId: null,
          accountName: null,
          partnerNameSnapshot: "",
        };
      case PCRItemType.TimeExtension:
        return {
          ...baseFields,
          type: itemType.type,
          offsetMonths: 0,
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
          suspensionEndDate: null,
        };
      case PCRItemType.ProjectTermination:
        return {
          ...baseFields,
          type: itemType.type,
          status: PCRItemStatus.Complete,
        };
      case PCRItemType.LoanDrawdownChange:
      case PCRItemType.PeriodLengthChange:
        return {
          ...baseFields,
          type: itemType.type,
        };
      case PCRItemType.LoanDrawdownExtension:
        return {
          ...baseFields,
          type: itemType.type,
          projectStartDate: null,
          extensionPeriod: null,
          extensionPeriodChange: null,
          availabilityPeriod: null,
          availabilityPeriodChange: null,
          repaymentPeriod: null,
          repaymentPeriodChange: null,
        };
      case PCRItemType.ApproveNewSubcontrator:
        return {
          ...baseFields,
          type: itemType.type,
          // 10179: Add extra fields to map here!
        };
      default:
        throw new Error("Item type not handled");
    }
  }

  private getValidator({
    projectId,
    dto,
    pcrStepType,
    pcrStepId,
    showErrors,
  }: {
    projectId: ProjectId;
    dto: PCRDto;
    pcrStepType?: PCRStepType;
    pcrStepId?: PcrItemId;
    showErrors: boolean;
  }) {
    return Pending.combine({
      projectRoles: this.projectStore.getById(projectId).then(x => x.roles),
      original: dto.id ? this.getById(projectId, dto.id) : Pending.done(undefined),
      itemTypes: this.getAllPcrTypes(projectId),
      project: this.projectStore.getById(projectId),
      partners: this.partnersStore.getPartnersForProject(projectId),
    }).then(
      x =>
        new PCRDtoValidator({
          model: dto,
          role: this.convertRolesToEnumType(x.projectRoles),
          recordTypes: x.itemTypes,
          showValidationErrors: showErrors,
          project: x.project,
          original: x.original,
          partners: x.partners,
          pcrStepType,
          pcrStepId,
        }),
    );
  }

  private convertRolesToEnumType(roles: ProjectRole | SfRoles) {
    if (typeof roles == "number") {
      return roles as ProjectRole;
    } else {
      return convertRolesToPermissionsValue(roles) as ProjectRole;
    }
  }

  public deletePcr(projectId: ProjectId, pcrId: PcrId, dto: PCRDto, message?: string, onComplete?: () => void) {
    this.deleteEditor(
      "pcr",
      this.getKeyForRequest(projectId, pcrId),
      dto,
      () => this.getValidator({ projectId, dto, pcrStepType: PCRStepType.none, showErrors: false }),
      p => apiClient.pcrs.delete({ projectId, id: pcrId, ...p }),
      () => {
        if (message) {
          this.queue(messageSuccess(message));
        }
        if (onComplete) {
          onComplete();
        }
      },
    );
  }

  public getStatusChanges(projectId: ProjectId, projectChangeRequestId: PcrId) {
    return this.getData(
      "projectChangeRequestStatusChanges",
      this.getKeyForRequest(projectId, projectChangeRequestId),
      p => apiClient.pcrs.getStatusChanges({ projectId, projectChangeRequestId, ...p }),
    );
  }
}
