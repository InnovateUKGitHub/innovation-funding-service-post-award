import { dataStoreHelper } from "./common";
import { RootState } from "@ui/redux";

export const partnersStore = "partners";
export const findPartnersByProject = (projectId: string) => dataStoreHelper(partnersStore, `projectId=${projectId}`);
export const getLeadPartner = (state: RootState, projectId: string) => findPartnersByProject(projectId).getPending(state).then(x => x.find(p => p.isLead));

export const getAllPartners = () => dataStoreHelper(partnersStore, "all");

export const partnerStore = "partner";
export const getPartner = (partnerId: string) => dataStoreHelper(partnerStore, partnerId);
