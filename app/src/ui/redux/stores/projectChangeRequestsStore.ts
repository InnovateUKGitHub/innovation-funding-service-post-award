import { StoreBase } from "./storeBase";
import { PCRDto, PCRItemForTimeExtensionDto, PCRStandardItemDto } from "@framework/dtos";
import { PCRDtoValidator } from "@ui/validators";
import { ProjectsStore } from "./projectsStore";
import { RootState } from "../reducers";
import { ApiClient } from "@ui/apiClient";
import { LoadingStatus, Pending } from "@shared/pending";
import { dataLoadAction, messageSuccess } from "../actions";
import { NotFoundError } from "@server/features/common";
import * as Dtos from "@framework/dtos";
import {
  PCRItemStatus,
  PCRItemType,
  PCRStatus
} from "@framework/constants";

export class ProjectChangeRequestStore extends StoreBase {
  constructor(private projectStore: ProjectsStore, getState: () => RootState, queue: (action: any) => void) {
    super(getState, queue);
  }

  private getKeyForRequest(projectId: string, pcrId?: string) {
    return this.buildKey(projectId, pcrId || "new");
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

  public getStandardItemById(projectId: string, pcrId: string, itemId: string) {
    return this.getItemById(projectId, pcrId, itemId).chain(item => {
      if (
        item.type === PCRItemType.AccountNameChange ||
        item.type === PCRItemType.MultiplePartnerFinancialVirement ||
        item.type === PCRItemType.PartnerAddition ||
        item.type === PCRItemType.PartnerWithdrawal ||
        item.type === PCRItemType.ProjectSuspension ||
        item.type === PCRItemType.ProjectTermination ||
        item.type === PCRItemType.SinglePartnerFinancialVirement
      ) {
        return Pending.done(item);
      }
      else {
        return new Pending<PCRStandardItemDto>(LoadingStatus.Failed, null, new NotFoundError("Item is incorrect type"));
      }
    });
  }

  public getTimeExtensionItemById(projectId: string, pcrId: string, itemId: string) {
    return this.getItemById(projectId, pcrId, itemId).chain(item => {
      if (item.type === PCRItemType.TimeExtension) {
        return Pending.done(item);
      }
      else {
        return new Pending<PCRItemForTimeExtensionDto>(LoadingStatus.Failed, null, new NotFoundError("Item is incorrect type"));
      }
    });
  }

  public getAllForProject(projectId: string) {
    return this.getData("pcrs", projectId, p => ApiClient.pcrs.getAll({ projectId, ...p }));
  }

  public getAllPcrTypes() {
    return this.getData("pcrTypes", "all", p => ApiClient.pcrs.getTypes({ ...p }));
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
      case PCRItemType.PartnerAddition:
      case PCRItemType.PartnerWithdrawal:
      case PCRItemType.SinglePartnerFinancialVirement:
        return {
          ...baseFields,
          type: itemType.type
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
          projectDuration: null,
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
      default:
        throw new Error("Item type not handled");
    }
  }

  private getValidator(projectId: string, dto: PCRDto, showErrors: boolean): any {
    return Pending.combine({
      projectRoles: this.projectStore.getById(projectId).then(x => x.roles),
      original: dto.id ? this.getById(projectId, dto.id) : Pending.done(undefined),
      itemTypes: this.getAllPcrTypes(),
    }).then(x => new PCRDtoValidator(dto, x.projectRoles, x.itemTypes, showErrors, x.original));
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
