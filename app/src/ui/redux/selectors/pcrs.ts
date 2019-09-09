import { dataStoreHelper, editorStoreHelper } from "./common";
import { getKey } from "@framework/util/key";
import { RootState } from "../reducers";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { Results } from "@ui/validation";
import { MultipleDocumentUpdloadDtoValidator } from "@ui/validators";
import { Pending } from "@shared/pending";
import { PCRDtoValidator } from "@ui/validators/pcrDtoValidator";

export const getAllPcrTypes = () => dataStoreHelper("pcrTypes", "all");
export const getAllPcrs = (projectId: string) => dataStoreHelper("pcrs", projectId);
export const getPcr = (projectId: string, id: string) => dataStoreHelper("pcr", getKey(projectId, id));

export const getPcrItem = (projectId: string, id: string, itemId: string) => ({ getPending: (store: RootState) => getPcr(projectId, id).getPending(store).then(x => x.items.find(y => y.id === itemId)!) });

const createPcr = (projectId: string): Partial<PCRDto> => ({
  projectId,
  items: []
});

export const getPcrEditor = (projectId: string, id?: string) => editorStoreHelper<PCRDto, PCRDtoValidator>(
  "pcr",
  (store) => {
    if (id) {
      return getPcr(projectId, id).getPending(store);
    }
    return Pending.done(createPcr(projectId) as PCRDto);
  },
  (dto, store) => Pending.done(new PCRDtoValidator(dto, false)),
  getKey(projectId, id || "new")
);

export const getProjectChangeRequestItemDocumentEditor = (projectChangeRequestItemId: string, config: { maxFileSize: number, maxUploadFileCount: number }) => editorStoreHelper<MultipleDocumentUploadDto, MultipleDocumentUpdloadDtoValidator>(
  "multipleDocuments",
  () => Pending.done({ files: [] }),
  (dto) => Pending.done(new MultipleDocumentUpdloadDtoValidator(dto, config, false)),
  getKey("projectChangeRequestItem", projectChangeRequestItemId)
);
