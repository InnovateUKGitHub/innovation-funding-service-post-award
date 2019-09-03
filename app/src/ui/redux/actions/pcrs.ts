import { ApiClient } from "../../apiClient";
import { conditionalLoad } from "./common";
import { getAllPcrs, getAllPcrTypes, getPcr } from "../selectors/pcrs";

export function loadPcrTypes() {
  return conditionalLoad(getAllPcrTypes(), params => ApiClient.pcrs.getTypes({...params}));
}

export function loadPcrs(projectId: string) {
  return conditionalLoad(getAllPcrs(projectId), params => ApiClient.pcrs.getAll({ projectId,...params}));
}

export function loadPcr(projectId: string, id: string) {
  return conditionalLoad(getPcr(projectId, id), params => ApiClient.pcrs.get({ projectId, id,...params}));
}
