import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import {
  findPartnersByProject,
  getPartner,
} from "../selectors/partners";

export function loadPartner(partnerId: string) {
  return conditionalLoad(getPartner(partnerId), params => ApiClient.partners.get({partnerId, ...params}));
}

export function loadPartnersForProject(projectId: string) {
  return conditionalLoad(findPartnersByProject(projectId), params => ApiClient.partners.getAllByProjectId({projectId, ...params}));
}
