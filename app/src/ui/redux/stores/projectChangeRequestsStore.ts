import { LoadingStatus, Pending } from "@shared/pending";
import { StoreBase } from "./storeBase";
import { PCRDtoValidator } from "@ui/validators";
import { ProjectsStore } from "./projectsStore";
import { RootState } from "../reducers";
import { ApiClient } from "@ui/apiClient";
import { PCRDto } from "@framework/dtos";
import { ActionsUnion, dataLoadAction, messageSuccess } from "../actions";
import { ILinkInfo } from "@framework/types";
import { ProjectChangeRequestDtoValidatorForCreate } from "@ui/validators/projectChangeRequestDtoValidatorForCreate";
import { ProjectChangeRequestItemStatus, ProjectChangeRequestStatus } from "@framework/entities";
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

  getAllForProject(projectId: string) {
    return this.getData("pcrs", projectId, p => ApiClient.pcrs.getAll({ projectId, ...p }));
  }

  getAllPcrTypes() {
    return this.getData("pcrTypes", "all", p => ApiClient.pcrs.getTypes({ ...p }));
  }

  getPcrCreateEditor(projectId: string, init?: (dto: PCRDto) => void) {
    return this.getEditor(
      "pcr",
      this.getKeyForRequest(projectId),
      () => Pending.done<PCRDto>({
        id:"",
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
      p => dto.id ? ApiClient.pcrs.update({ projectId, id: dto.id, pcr: dto, ...p }) : ApiClient.pcrs.create({projectId, projectChangeRequestDto: dto, ...p}),
      (result) => {
        this.queue(dataLoadAction(this.getKeyForRequest(projectId, result.id), "pcr", LoadingStatus.Updated, result));
        if (message) {
          this.queue(messageSuccess(message));
        }
        if(onComplete) {
          onComplete(result);
        }
      }
    );
  }

  private getValidator(projectId: string, dto: PCRDto, showErrors: boolean): any {
    return Pending.combine({
      projectRoles:this.projectStore.getById(projectId).then(x => x.roles),
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
        if(message) {
          this.queue(messageSuccess(message));
        }
        if(onComplete) {
          onComplete();
        }
      }
    );
  }

  getStatusChanges(projectId: string, projectChangeRequestId: string) {
    return this.getData("projectChangeRequestStatusChanges", this.getKeyForRequest(projectId, projectChangeRequestId), p => ApiClient.pcrs.getStatusChanges({projectId, projectChangeRequestId, ...p}));
  }

}
