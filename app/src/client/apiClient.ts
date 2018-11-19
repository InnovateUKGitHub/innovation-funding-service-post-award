import { IApiClient } from "../server/apis";
import { processResponse } from "../shared/processResponse";
import {DocumentDescription} from "../types/constants";

const clientApi: IApiClient = {
  claimLineItems: {
    getAllForCategory: (params) => ajaxJson(`/api/claim-line-items/?partnerId=${params.partnerId}&periodId=${params.periodId}&costCategoryId=${params.costCategoryId}`),
    saveLineItems: (params) => ajaxPost(`/api/claim-line-items/?partnerId=${params.partnerId}&periodId=${params.periodId}&costCategoryId=${params.costCategoryId}`, params.lineItems)
  },
  claims : {
    getAllByPartnerId: (params) => ajaxJson(`/api/claims/?partnerId=${params.partnerId}`),
    get: (params) => ajaxJson(`/api/claims/${params.partnerId}/${params.periodId}`),
    update: (params) => ajaxPut(`/api/claims/${params.partnerId}/${params.periodId}`, params.claim)
  },
  claimDetailsSummary: {
    getAllByPartnerIdForPeriod: (params) => ajaxJson(`/api/claim-details-summary/${params.partnerId}/${params.periodId}`)
  },
  claimDetails: {
    getAllByPartner: (params) => ajaxJson(`/api/claim-details/?partnerId=${params.partnerId}`)
  },
  contacts: {
    getAll: (params) => ajaxJson("/api/contacts"),
    get: (params) => ajaxJson(`/api/contact/${params.id}`),
  },
  costCategories: {
    getAll: (params) => ajaxJson("/api/cost-categories"),
  },
  documents: {
    getClaimDocuments:(params) => ajaxJson(`/api/documents/claims/${params.partnerId}/${params.periodId}/?description=${DocumentDescription.IAR}`),
    getClaimDetailDocuments: ({ claimDetailKey }) => ajaxJson(`/api/documents/claim-details/${claimDetailKey.partnerId}/${claimDetailKey.periodId}/${claimDetailKey.costCategoryId}`),
    deleteDocument: ({ documentId }) => ajaxJson(`/api/documents/${documentId}`, { method: "DELETE" }),
    uploadClaimDetailDocument: ({ claimDetailKey, file }) => {
      const formData = new FormData();
      formData.append("attachment", file as File);
      return ajaxPostFormData(`/api/documents/claim-details/${claimDetailKey.partnerId}/${claimDetailKey.periodId}/${claimDetailKey.costCategoryId}`, formData);
    }
  },
  forecastDetails: {
    getAllByPartnerId: (params) => ajaxJson(`/api/forecast-details/?partnerId=${params.partnerId}&periodId=${params.periodId}`),
    get: (params) => ajaxJson(`/api/forecast-details/${params.partnerId}/${params.periodId}/${params.costCategoryId}`),
    update: (params) => ajaxPut(`/api/forecast-details/?partnerId=${params.partnerId}&periodId=${params.periodId}&submit=${params.submit}`, params.forecasts),
  },
  forecastGolCosts: {
    getAllByPartnerId: (params) => ajaxJson(`/api/forecast-gol-costs/?partnerId=${params.partnerId}`)
  },
  projects: {
    get: (params) => ajaxJson(`/api/projects/${params.id}`),
    getAll: (params) => ajaxJson("/api/projects"),
  },
  projectContacts: {
    getAllByProjectId: (params) => ajaxJson(`/api/project-contacts?projectId=${params.projectId}`),
  },
  partners: {
    get: (params) => ajaxJson(`/api/partners/${params.id}`),
    getAllByProjectId: (params) => ajaxJson(`/api/partners?projectId=${params.projectId}`),
  },
  users: {
    getCurrent: () => ajaxJson(`/api/users/current`)
  }
};

const getHeaders = () => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  return headers;
};

const ajax = <T>(url: string, opts?: {}): Promise<T> => {
  // TODO - ENV.URL?
  const base = "";
  return fetch(base + url, opts).then(response => {
    if (response.ok) {
      return processResponse(response);
    }
    return response.json()
      .catch(e => Promise.reject(response.statusText))
      .then(errText => Promise.reject(errText));
  });
};

const ajaxJson = <T>(url: string, opts?: {}): Promise<T> => {
  const headers = getHeaders();
  const options = Object.assign({ headers }, opts);
  return ajax(url, options);
};

const ajaxPost = <T>(url: string, body: {} = {}, opts?: {}) => {
  const options = Object.assign({
    method: "POST",
    body: JSON.stringify(body)
  }, opts);

  return ajaxJson<T>(url, options);
};

const ajaxPostFormData = <T>(url: string, formData: FormData, opts?: {}) => {
  const options = { method: "POST", body: formData,  ...opts};
  return ajax<T>(url, options);
};

const ajaxPut = <T>(url: string, body: {} = {}, opts?: {}) => {
  return ajaxPost<T>(url, body, {
    ...opts,
    method: "PUT",
  });
};

export const ApiClient = clientApi;
