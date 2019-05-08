import { dataStoreHelper, dataStoreHelperMap } from "./common";

export const getCostCategories = () => dataStoreHelper("costCategories", "All");
export const getCostCatetory = (id: string) => dataStoreHelperMap(getCostCategories(), x => x.find(y => y.id === id));
