import { dataStoreHelper, IDataSelector } from "./common";
import { PartnerDto } from "../../models";

export const partnersStore = "partners";
export const findPartnersByProject = (projectId: string) => dataStoreHelper(partnersStore, `projectId=${projectId}`) as IDataSelector<PartnerDto[]>;

export const partnerStore = "partner";
export const getPartner = (partnerId: string) => dataStoreHelper(partnerStore, partnerId) as IDataSelector<PartnerDto>;
