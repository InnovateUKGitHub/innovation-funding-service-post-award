import { conditionalLoad } from "./common";
import { ApiClient } from "../..//apiClient";
import {
  findPartnersByProject,
  getPartner,
  partnersStore,
} from "../selectors/partners";

export function loadPartner(partnerId: string) {
  const selector = getPartner(partnerId);
  return conditionalLoad(selector.key, selector.store, params => ApiClient.partners.get({id: partnerId, ...params}));
}

export function loadPartnersForProject(projectId: string) {
  return conditionalLoad(findPartnersByProject(projectId).key, partnersStore, params => ApiClient.partners.getAllByProjectId({projectId, ...params}));
}
