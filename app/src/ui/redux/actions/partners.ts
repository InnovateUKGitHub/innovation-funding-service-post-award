import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import {
  findPartnersByProject,
  getPartner,
  partnersStore,
} from "../selectors/partners";

export function loadPartner(partnerId: string) {
  return conditionalLoad(getPartner(partnerId), params => ApiClient.partners.get({id: partnerId, ...params}));
}

export function loadPartnersForProject(projectId: string) {
  return conditionalLoad(findPartnersByProject(projectId), params => ApiClient.partners.getAllByProjectId({projectId, ...params}));
}
