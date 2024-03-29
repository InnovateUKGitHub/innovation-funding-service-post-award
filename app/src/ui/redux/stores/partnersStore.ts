import { apiClient } from "@ui/apiClient";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PartnerDtoValidator } from "@ui/validation/validators/partnerValidator";
import { PartnerDocumentsStore } from "@ui/redux/stores/partnerDocumentsStore";
import { StoreBase } from "./storeBase";
import { LoadingStatus } from "@framework/constants/enums";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { dataLoadAction } from "../actions/common/dataLoad";
import { RootActionsOrThunk } from "../actions/root";
import { RootState } from "../reducers/rootReducer";

interface UpdatePartnerOptions {
  onComplete?: (result: PartnerDto) => void;
  onError?: (error: unknown) => void;
  validateBankDetails?: boolean;
  verifyBankDetails?: boolean;
}

export class PartnersStore extends StoreBase {
  constructor(
    private readonly partnerDocumentsStore: PartnerDocumentsStore,
    getState: () => RootState,
    dispatch: (action: RootActionsOrThunk) => void,
  ) {
    super(getState, dispatch);
  }

  public getAll() {
    return this.getData("partners", storeKeys.getPartnersKey(), p => apiClient.partners.getAll(p));
  }

  public getPartnersForProject(projectId: ProjectId) {
    return this.getData("partners", storeKeys.getProjectKey(projectId), p =>
      apiClient.partners.getAllByProjectId({ projectId, ...p }),
    );
  }

  public getById(partnerId: PartnerId) {
    return this.getData("partner", storeKeys.getPartnerKey(partnerId), p =>
      apiClient.partners.get({ partnerId, ...p }),
    );
  }

  public getLeadPartner(projectId: ProjectId) {
    return this.getPartnersForProject(projectId).then(x => x.find(y => y.isLead));
  }

  public getPartnerEditor(projectId: ProjectId, partnerId: PartnerId, init?: (dto: PartnerDto) => void) {
    const partnerDocumentsPending = this.partnerDocumentsStore.getPartnerDocuments(projectId, partnerId);
    return partnerDocumentsPending.chain(partnerDocuments =>
      this.getEditor(
        "partner",
        storeKeys.getPartnerKey(partnerId),
        () => this.getById(partnerId),
        init,
        // Using updated dto instead of getting original as happy to let validation happen server-side
        dto => new PartnerDtoValidator(dto, dto, partnerDocuments, { showValidationErrors: false }),
      ),
    );
  }

  public updatePartner(
    submit: boolean,
    partnerId: PartnerId,
    partnerDto: PartnerDto,
    options?: UpdatePartnerOptions,
  ): void {
    const partnerDocuments = this.partnerDocumentsStore.getPartnerDocuments(partnerDto.projectId, partnerId).data;
    return this.updateEditor(
      submit,
      "partner",
      storeKeys.getPartnerKey(partnerId),
      partnerDto,
      () =>
        new PartnerDtoValidator(partnerDto, partnerDto, partnerDocuments || [], {
          showValidationErrors: true,
          validateBankDetails: options?.validateBankDetails,
        }),
      p =>
        apiClient.partners.updatePartner({
          partnerId,
          partnerDto,
          validateBankDetails: options && options.validateBankDetails,
          verifyBankDetails: options && options.verifyBankDetails,
          ...p,
        }),
      result => {
        this.queue(dataLoadAction(storeKeys.getPartnerKey(partnerId), "partner", LoadingStatus.Updated, result));
        if (options && options.onComplete) {
          options.onComplete(result);
        }
      },
      e => {
        if (options && options.onError) {
          options.onError(e);
        }
      },
    );
  }
}
