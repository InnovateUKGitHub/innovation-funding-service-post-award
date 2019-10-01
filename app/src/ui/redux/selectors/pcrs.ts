import { dataStoreHelper, editorStoreHelper } from "./common";
import { getKey } from "@framework/util/key";
import { RootState } from "../reducers";
import { PCRDto, PCRItemForTimeExtensionDto, PCRStandardItemDto } from "@framework/dtos/pcrDtos";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { LoadingStatus, Pending } from "@shared/pending";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";
import { ProjectChangeRequestDtoValidatorForCreate } from "@ui/validators/projectChangeRequestDtoValidatorForCreate";
import { ProjectChangeRequestItemStatus, ProjectChangeRequestItemTypeEntity, ProjectChangeRequestStatus } from "@framework/entities";
import { Authorisation } from "@framework/types";

export const getAllPcrTypes = () => dataStoreHelper("pcrTypes", "all");
export const getAllPcrs = (projectId: string) => dataStoreHelper("pcrs", projectId);
export const getPcr = (projectId: string, id: string) => dataStoreHelper("pcr", getKey(projectId, id));

export const getPcrItem = (projectId: string, id: string, itemId: string) => ({ getPending: (store: RootState) => getPcr(projectId, id).getPending(store).then(x => x.items.find(y => y.id === itemId)!) });

export const getPcrItemForTimeExtension = (state: RootState, projectId: string, id: string, itemId: string): Pending<PCRItemForTimeExtensionDto> => {
  return getPcrItem(projectId, id, itemId).getPending(state).chain(x => {
    if (x.type === ProjectChangeRequestItemTypeEntity.TimeExtension) {
      return Pending.done(x);
    }
    return new Pending<PCRItemForTimeExtensionDto>(LoadingStatus.Failed, null, new Error("Item not a Time Extension"));
  });
};

export const getPcrStandardItem = (state: RootState, projectId: string, id: string, itemId: string): Pending<PCRStandardItemDto> => {
  return getPcrItem(projectId, id, itemId).getPending(state).chain(x => {
    switch (x.type) {
      case ProjectChangeRequestItemTypeEntity.AccountNameChange:
      case ProjectChangeRequestItemTypeEntity.MultiplePartnerFinancialVirement:
      case ProjectChangeRequestItemTypeEntity.PartnerAddition:
      case ProjectChangeRequestItemTypeEntity.PartnerWithdrawal:
      case ProjectChangeRequestItemTypeEntity.ProjectSuspension:
      case ProjectChangeRequestItemTypeEntity.ProjectTermination:
      case ProjectChangeRequestItemTypeEntity.ScopeChange:
      case ProjectChangeRequestItemTypeEntity.SinglePartnerFinancialVirement:
        return Pending.done(x);
      default:
        return new Pending<PCRStandardItemDto>(LoadingStatus.Failed, null, new Error("Item not a Standard Type"));
    }
  });
};

const createPcr = (projectId: string): Partial<PCRDto> => ({
  projectId,
  status: ProjectChangeRequestStatus.Draft,
  reasoningStatus: ProjectChangeRequestItemStatus.ToDo,
  items: []
});

export const getPcrEditor = (projectId: string, id: string) => editorStoreHelper<PCRDto, PCRDtoValidator>(
  "pcr",
  (store) => getPcr(projectId, id).getPending(store),
  (dto, store) => {
    const projectRole = new Authorisation(store.user.roleInfo).forProject(projectId).getRoles();
    return Pending.combine({
      original: getPcr(projectId, id).getPending(store),
      recordTypes: getAllPcrTypes().getPending(store)
    }).then(({ original, recordTypes }) => new PCRDtoValidator(dto, projectRole, original, recordTypes, false));
  },
  getKey(projectId, id)
);

export const getPcrEditorForCreate = (projectId: string) => editorStoreHelper<PCRDto, ProjectChangeRequestDtoValidatorForCreate>(
  "pcr",
  (store) => {
    return Pending.done(createPcr(projectId) as PCRDto);
  },
  (dto, store) => Pending.done(new ProjectChangeRequestDtoValidatorForCreate(dto, [], false)),
  getKey(projectId, "new")
);

export const getProjectChangeRequestDocumentOrItemDocumentEditor = (projectChangeRequestItemId: string) => editorStoreHelper<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>(
  "multipleDocuments",
  () => Pending.done({ files: [] }),
  (dto, state) => Pending.done(new MultipleDocumentUpdloadDtoValidator(dto, state.config, false)),
  getKey("projectChangeRequestItem", projectChangeRequestItemId)
);

export const getProjectChangeRequestStatusChanges = (projectChangeRequestId: string) => {
  return dataStoreHelper("projectChangeRequestStatusChanges", getKey(projectChangeRequestId));
};
