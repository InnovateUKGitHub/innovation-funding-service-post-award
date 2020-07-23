import { StoreBase } from "./storeBase";
import { RootState } from "../reducers";
import { ApiClient } from "@ui/apiClient";
import { storeKeys } from "@ui/redux/stores/storeKeys";
import { PartnerDto } from "@framework/dtos";
import { dataLoadAction } from "../actions";
import { LoadingStatus } from "@shared/pending";
import { PartnerDtoValidator } from "@ui/validators/partnerValidator";
import { ValidationError } from "@server/features/common";

export class PartnersStore extends StoreBase {
  constructor(getState: () => RootState, dispatch: (action: any) => void) {
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
    return this.getEditor(
      "partner",
      storeKeys.getPartnerKey(partnerId),
      () => this.getById(partnerId),
      init,
      (dto) => new PartnerDtoValidator(dto, false)
    );
  }

  public updatePartner(submit: boolean, partnerId: string, partnerDto: PartnerDto, onComplete?: (result: PartnerDto) => void, onError?: (error: any) => void): void {
    return this.updateEditor(
      submit,
      "partner",
      storeKeys.getPartnerKey(partnerId),
      partnerDto,
      () => new PartnerDtoValidator(partnerDto, true),
      p => ApiClient.partners.updatePartner({ partnerId, partnerDto, ...p }),
      (result) => {
        this.queue(dataLoadAction(storeKeys.getPartnerKey(partnerId), "partner", LoadingStatus.Updated, result));
        if(onComplete) {
          onComplete(result);
        }
      },
      (e) => {
        if(onError) {
          onError(e);
        }
      }
    );
  }
}
