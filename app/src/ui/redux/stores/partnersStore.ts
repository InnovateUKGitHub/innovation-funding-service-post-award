import { StoreBase } from "./storeBase";
import { RootState } from "../reducers";
import { ApiClient } from "@ui/apiClient";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PartnerDto } from "@framework/dtos";
import { dataLoadAction } from "../actions";
import { LoadingStatus } from "@shared/pending";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { PartnerDocumentsStore } from "@ui/redux/stores/partnerDocumentsStore";

interface UpdatePartnerOptions {
  onComplete?: (result: PartnerDto) => void;
  onError?: (error: any) => void;
  validateBankDetails?: boolean;
  verifyBankDetails?: boolean;
}

export class PartnersStore extends StoreBase {
  constructor(private readonly partnerDocumentsStore: PartnerDocumentsStore, getState: () => RootState, dispatch: (action: any) => void) {
    super(getState, dispatch);
  }

  public getAll() {
    return this.getData("partners", storeKeys.getPartnersKey(), p => ApiClient.partners.getAll({ ...p }));
  }

  public getPartnersForProject(projectId: string) {
    return this.getData("partners", storeKeys.getProjectKey(projectId), p => ApiClient.partners.getAllByProjectId({ projectId, ...p }));
  }

  public getById(partnerId: string) {
    return this.getData("partner", storeKeys.getPartnerKey(partnerId), p => ApiClient.partners.get({ partnerId, ...p }));
  }

  public getLeadPartner(projectId: string) {
    return this.getPartnersForProject(projectId).then(x => x.find(y => y.isLead)!);
  }

  public getPartnerEditor(projectId: string, partnerId: string, init?: (dto: PartnerDto) => void) {
    const partnerDocumentsPending = this.partnerDocumentsStore.getPartnerDocuments(projectId, partnerId);
    return partnerDocumentsPending.chain(partnerDocuments => (this.getEditor(
      "partner",
      storeKeys.getPartnerKey(partnerId),
      () => this.getById(partnerId),
      init,
      // Using updated dto instead of getting original as happy to let validation happen server-side
      (dto) => new PartnerDtoValidator(dto, dto, partnerDocuments, {showValidationErrors: false})
    )));
  }

  public updatePartner(submit: boolean, partnerId: string, partnerDto: PartnerDto, options?: UpdatePartnerOptions): void {
    const partnerDocuments = this.partnerDocumentsStore.getPartnerDocuments(partnerDto.projectId, partnerId).data;
    return this.updateEditor(
      submit,
      "partner",
      storeKeys.getPartnerKey(partnerId),
      partnerDto,
      () => new PartnerDtoValidator(partnerDto, partnerDto, partnerDocuments || [], {
        showValidationErrors: true,
        validateBankDetails: options && options.validateBankDetails
      }),
      p => ApiClient.partners.updatePartner({ partnerId, partnerDto, validateBankDetails: options && options.validateBankDetails, verifyBankDetails: options && options.verifyBankDetails, ...p }),
      (result) => {
        this.queue(dataLoadAction(storeKeys.getPartnerKey(partnerId), "partner", LoadingStatus.Updated, result));
        if(options && options.onComplete) {
          options.onComplete(result);
        }
      },
      (e) => {
        if(options && options.onError) {
          options.onError(e);
        }
      }
    );
  }
}
