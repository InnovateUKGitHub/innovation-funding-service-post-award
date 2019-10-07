import { StoreBase } from "./storeBase";
import { PCRDto, PCRItemForTimeExtensionDto, PCRStandardItemDto } from "@framework/dtos";
import { PCRDtoValidator } from "@ui/validators";
import { ProjectsStore } from "./projectsStore";
import { RootState } from "../reducers";
import { ApiClient } from "@ui/apiClient";
import { LoadingStatus, Pending } from "@shared/pending";
import { ActionsUnion, dataLoadAction, messageSuccess } from "../actions";
import { ILinkInfo } from "@framework/types";
import { ProjectChangeRequestDtoValidatorForCreate } from "@ui/validators/projectChangeRequestDtoValidatorForCreate";
import { ProjectChangeRequestItemStatus, ProjectChangeRequestItemTypeEntity, ProjectChangeRequestStandardItemTypes, ProjectChangeRequestStatus } from "@framework/entities";
import { NotFoundError } from "@server/features/common";

export class ProjectChangeRequestStore extends StoreBase {
  constructor(private projectStore: ProjectsStore, getState: () => RootState, queue: (action: any) => void) {
    super(getState, queue);
  }

  private getKeyForRequest(projectId: string, pcrId?: string) {
    return this.buildKey(projectId, pcrId || "new");
  }

  private createValidator(projectId: string, pcrId: string, dto: PCRDto, show: boolean) {
    return Pending.combine({
      projectRole: this.projectStore.getById(projectId).then(x => x.roles),
      original: this.getById(projectId, pcrId),
      recordTypes: this.getAllPcrTypes()
    }).then(({ projectRole, original, recordTypes }) => new PCRDtoValidator(dto, projectRole, original, recordTypes, show));
  }

  getById(projectId: string, pcrId: string) {
    return this.getData("pcr", this.getKeyForRequest(projectId, pcrId), p => ApiClient.pcrs.get({ projectId, id: pcrId, ...p }));
  }

  getItemById(projectId: string, pcrId: string, itemId: string) {
    return this.getById(projectId, pcrId).chain(pcr => {
      const item = pcr.items.find(x => x.id === itemId);
      const error = !item ? new NotFoundError("Item has not bee found in project change request") : null;
      return new Pending(item ? LoadingStatus.Done : LoadingStatus.Failed, item, error);
    });
  }

  getStandardItemById(projectId: string, pcrId: string, itemId: string) {
    return this.getItemById(projectId, pcrId, itemId).chain(item => {
      if (
        item.type === ProjectChangeRequestItemTypeEntity.AccountNameChange ||
        item.type === ProjectChangeRequestItemTypeEntity.MultiplePartnerFinancialVirement ||
        item.type === ProjectChangeRequestItemTypeEntity.PartnerAddition ||
        item.type === ProjectChangeRequestItemTypeEntity.PartnerWithdrawal ||
        item.type === ProjectChangeRequestItemTypeEntity.ProjectSuspension ||
        item.type === ProjectChangeRequestItemTypeEntity.ProjectTermination ||
        item.type === ProjectChangeRequestItemTypeEntity.SinglePartnerFinancialVirement
      ) {
        return Pending.done(item);
      }
      else {
        return new Pending<PCRStandardItemDto>(LoadingStatus.Failed, null, new NotFoundError("Item is incorrect type"));
      }
    });
  }

  getTimeExtentionItemById(projectId: string, pcrId: string, itemId: string) {
    return this.getItemById(projectId, pcrId, itemId).chain(item => {
      if (item.type === ProjectChangeRequestItemTypeEntity.TimeExtension) {
        return Pending.done(item);
      }
      else {
        return new Pending<PCRItemForTimeExtensionDto>(LoadingStatus.Failed, null, new NotFoundError("Item is incorrect type"));
      }
    });
  }

  getAllForProject(projectId: string) {
    return this.getData("pcrs", projectId, p => ApiClient.pcrs.getAll({ projectId, ...p }));
  }

  getAllPcrTypes() {
    return this.getData("pcrTypes", "all", p => ApiClient.pcrs.getTypes({ ...p }));
  }

  getPcrTypeForItem(projectId: string, pcrId: string, itemId: string) {
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

  getPcrCreateEditor(projectId: string, init?: (dto: PCRDto) => void) {
    return this.getEditor(
      "pcr",
      this.getKeyForRequest(projectId),
      () => Pending.done<PCRDto>({
        id: "",
        projectId,
        status: ProjectChangeRequestStatus.Draft,
        statusName: "",
        comments: "",
        reasoningComments: "",
        reasoningStatus: ProjectChangeRequestItemStatus.ToDo,
        reasoningStatusName: "",
        guidance: "",
        requestNumber: NaN,
        started: new Date(),
        lastUpdated: new Date(),
        items: []
      }),
      init,
      (dto) => this.getCreateValidator(dto, false)
    );
  }

  getPcrUpdateEditor(projectId: string, pcrId: string, init?: (dto: PCRDto) => void) {
    return this.getEditor(
      "pcr",
      this.getKeyForRequest(projectId, pcrId),
      () => this.getById(projectId, pcrId),
      init,
      (dto) => this.createValidator(projectId, pcrId, dto, false)
    );
  }

  updatePcrEditor(saving: boolean, projectId: string, dto: PCRDto, message?: string, onComplete?: (result: PCRDto) => void) {
    this.updateEditor(
      saving,
      "pcr",
      this.getKeyForRequest(projectId, dto.id),
      dto,
      (showErrors) => dto.id ? this.getValidator(projectId, dto, showErrors) : this.getCreateValidator(dto, showErrors),
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

  private getValidator(projectId: string, dto: PCRDto, showErrors: boolean): any {
    return Pending.combine({
      projectRoles: this.projectStore.getById(projectId).then(x => x.roles),
      original: this.getById(projectId, dto.id),
      itemTypes: this.getAllPcrTypes(),
    }).then(x => new PCRDtoValidator(dto, x.projectRoles, x.original, x.itemTypes, showErrors));
  }

  private getCreateValidator(dto: PCRDto, showErrors: boolean): any {
    return this.getAllPcrTypes().then(itemTypes => new ProjectChangeRequestDtoValidatorForCreate(dto, itemTypes, showErrors));
  }

  deletePcr(projectId: string, pcrId: string, dto: PCRDto, message?: string, onComplete?: () => void): void {
    this.deleteEditor(
      "pcr",
      this.getKeyForRequest(projectId, pcrId),
      dto,
      () => this.createValidator(projectId, pcrId, dto, false),
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

  getStatusChanges(projectId: string, projectChangeRequestId: string) {
    return this.getData("projectChangeRequestStatusChanges", this.getKeyForRequest(projectId, projectChangeRequestId), p => ApiClient.pcrs.getStatusChanges({ projectId, projectChangeRequestId, ...p }));
  }

}
