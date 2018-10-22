import { IApiClient } from "../server/apis";
import { processResponse } from "./processResponse";
import {ClaimDto, ClaimLineItemDto} from "../ui/models";

const clientApi: IApiClient = {
  claimLineItems: {
    getAllForCategory: (partnerId: string, costCategoryId: string, periodId: number) => ajaxJson(`/api/claim-line-items/?partnerId=${partnerId}&periodId=${periodId}&costCategoryId=${costCategoryId}`),
    saveLineItems: (partnerId: string, costCategoryId: string, periodId: number, lineItems: ClaimLineItemDto[]) => ajaxPost(`/api/claim-line-items/?partnerId=${partnerId}&periodId=${periodId}&costCategoryId=${costCategoryId}`, lineItems)
  },
  claims : {
    getAllByPartnerId: (partnerId: string) => ajaxJson(`/api/claims/?partnerId=${partnerId}`),
    get: (partnerId: string, periodId: number) => ajaxJson(`/api/claims/${partnerId}/${periodId}`),
    update: (partnerId: string, periodId: number, claim: ClaimDto) => ajaxPut(`/api/claims/${partnerId}/${periodId}`, claim)
  },
  claimDetailsSummary: {
    getAllByPartnerIdForPeriod: (partnerId: string, periodId: number) => ajaxJson(`/api/claim-details-summary/${partnerId}/${periodId}`)
  },
  claimDetails: {
    getAllByPartner: (partnerId: string) => ajaxJson(`/api/claim-details/?partnerId=${partnerId}`)
  },
  contacts: {
    getAll: () => ajaxJson("/api/contacts"),
    get: (id: string) => ajaxJson(`/api/contact/${id}`),
  },
  costCategories: {
    getAll: () => ajaxJson("/api/cost-categories"),
  },
  documents: {
    getClaimDetailDocuments: (partnerId: string, periodId: number, costCategoryId: string) => ajaxJson(`/api/documents/claim-details/${partnerId}/${periodId}/${costCategoryId}`),
  },
  forecastDetails: {
    getAllByPartnerId: (partnerId: string, periodId: number) => ajaxJson(`/api/forecast-details/?partnerId=${partnerId}&periodId=${periodId}`),
    get: (partnerId: string, periodId: number, costCategoryId: string) => ajaxJson(`/api/forecast-details/${partnerId}/${periodId}/${costCategoryId}`),
  },
  forecastGolCosts: {
    getAllByPartnerId: (partnerId: string) => ajaxJson(`/api/forecast-gol-costs/?partnerId=${partnerId}`)
  },
  projects: {
    get: (id: string) => ajaxJson(`/api/projects/${id}`),
    getAll: () => ajaxJson("/api/projects"),
  },
  projectContacts: {
    getAllByProjectId: (projectId: string) => ajaxJson(`/api/project-contacts?projectId=${projectId}`),
  },
  partners: {
    get: (id: string) => ajaxJson(`/api/partners/${id}`),
    getAllByProjectId: (projectId: string) => ajaxJson(`/api/partners?projectId=${projectId}`),
  },
};

const getHeaders = () => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  return headers;
};

const ajaxJson = <T>(url: string, opts?: {}): Promise<T> => {
  // TODO - ENV.URL?
  const base = "";
  const headers = getHeaders();
  const options = Object.assign({ headers }, opts);

  return fetch(base + url, options).then(response => {
    if (response.ok) {
      return processResponse(response);
    }

    return response.json()
      .catch(e => Promise.reject(response.statusText))
      .then(errText => Promise.reject(errText));
  });
};

const ajaxPost = <T>(url: string, body: {} = {}, opts?: {}) => {
  const options = Object.assign({
    method: "POST",
    body: JSON.stringify(body)
  }, opts);

  return ajaxJson<T>(url, options);
};

const ajaxPut = <T>(url: string, body: {} = {}, opts?: {}) => {
  return ajaxPost<T>(url, body, {
    ...opts,
    method: "PUT",
  });
};

export default clientApi;
