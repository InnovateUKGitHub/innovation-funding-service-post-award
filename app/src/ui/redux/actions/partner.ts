import {conditionalLoad} from "./dataLoad";
import {ApiClient} from "../../../shared/apiClient";
import { getPartner, partnerStore } from "../selectors/partner";

export function loadPartner(id: string) {
  return conditionalLoad(
    getPartner(id).key,
    partnerStore,
    (params) => ApiClient.partners.get({id, ...params})
  );
}
