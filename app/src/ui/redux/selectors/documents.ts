import { dataStoreHelper, IDataSelector } from "./common";
import { DocumentSummaryDto } from "../../models";
import { getKey } from "../../../util/key";

export const documentStore = "documents";
export const getClaimDetailDocuments = (partnerId: string, periodId: number, costCategoryId: string) => dataStoreHelper(documentStore, getKey("claim", "detail", partnerId, periodId, costCategoryId)) as IDataSelector<DocumentSummaryDto[]>;
