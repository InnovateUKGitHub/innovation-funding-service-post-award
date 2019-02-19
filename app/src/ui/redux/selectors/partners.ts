import { dataStoreHelper } from "./common";

export const partnersStore = "partners";
export const findPartnersByProject = (projectId: string) => dataStoreHelper(partnersStore, `projectId=${projectId}`);

export const getAllPartners = () => dataStoreHelper(partnersStore, "all");

export const partnerStore = "partner";
export const getPartner = (partnerId: string) => dataStoreHelper(partnerStore, partnerId);
