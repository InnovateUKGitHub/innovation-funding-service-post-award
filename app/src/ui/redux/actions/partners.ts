import {conditionalLoad} from "./dataLoad";
import { findPartnersByProject, partnersStore } from "../selectors/partners";
import { ApiClient } from "../../apiClient";

export function loadPartnersForProject(projectId: string) {
  return conditionalLoad(
    findPartnersByProject(projectId).key,
    partnersStore,
    (params) => ApiClient.partners.getAllByProjectId({projectId, ...params})
  );
}
