import { IApiClient } from "../server/apis";
import { processResponse } from "../shared/processResponse";

const clientApi: IApiClient = {
  claimLineItems: {
    getAllForCategory: (params) => ajaxJson(`/api/claim-line-items/?projectId=${params.projectId}&partnerId=${params.partnerId}&periodId=${params.periodId}&costCategoryId=${params.costCategoryId}`),
    saveLineItems: (params) => ajaxPost(`/api/claim-line-items/?projectId=${params.projectId}&partnerId=${params.partnerId}&periodId=${params.periodId}&costCategoryId=${params.costCategoryId}`, params.lineItems)
  },
  claims : {
    getAllByProjectId: (params) => ajaxJson(`/api/claims/?projectId=${params.projectId}`),
    getAllByPartnerId: (params) => ajaxJson(`/api/claims/?partnerId=${params.partnerId}`),
    get: (params) => ajaxJson(`/api/claims/${params.partnerId}/${params.periodId}`),
    update: (params) => ajaxPut(`/api/claims/${params.projectId}/${params.partnerId}/${params.periodId}`, params.claim)
  },
  claimDetailsSummary: {
    getAllByPartnerIdForPeriod: (params) => ajaxJson(`/api/claim-details-summary/${params.projectId}/${params.partnerId}/${params.periodId}`)
  },
  claimDetails: {
    getAllByPartner: (params) => ajaxJson(`/api/claim-details/?partnerId=${params.partnerId}`)
  },
  contacts: {
    getAll: (params) => ajaxJson("/api/contacts"),
    get: (params) => ajaxJson(`/api/contact/${params.contactId}`),
  },
  costCategories: {
    getAll: (params) => ajaxJson("/api/cost-categories"),
  },
  documents: {
    getClaimDocuments:(params) => ajaxJson(`/api/documents/claims/${params.partnerId}/${params.periodId}/?description=${params.description}`),
    getClaimDetailDocuments: ({ claimDetailKey }) => ajaxJson(`/api/documents/claim-details/${claimDetailKey.partnerId}/${claimDetailKey.periodId}/${claimDetailKey.costCategoryId}`),
    deleteDocument: ({ documentId }) => ajaxJson(`/api/documents/${documentId}`, { method: "DELETE" }),
    uploadClaimDetailDocument: ({ claimDetailKey, file }) => {
      const formData = new FormData();
      formData.append("attachment", file as File);
      return ajaxPostFormData(`/api/documents/claim-details/${claimDetailKey.partnerId}/${claimDetailKey.periodId}/${claimDetailKey.costCategoryId}`, formData);
    },
    uploadClaimDocument: ({ claimKey, file, description }) => {
      const formData = new FormData();
      formData.append("attachment", file as File);
      if (description) { formData.append("description", description); }
      return ajaxPostFormData(`/api/documents/claims/${claimKey.partnerId}/${claimKey.periodId}`, formData);
    }
  },
  forecastDetails: {
    getAllByPartnerId: (params) => ajaxJson(`/api/forecast-details/?partnerId=${params.partnerId}`),
    get: (params) => ajaxJson(`/api/forecast-details/${params.partnerId}/${params.periodId}/${params.costCategoryId}`),
    update: (params) => ajaxPut(`/api/forecast-details/?projectId=${params.projectId}&partnerId=${params.partnerId}&submit=${params.submit}`, params.forecasts),
  },
  forecastGolCosts: {
    getAllByPartnerId: (params) => ajaxJson(`/api/forecast-gol-costs/?partnerId=${params.partnerId}`)
  },
  projects: {
    get: (params) => ajaxJson(`/api/projects/${params.projectId}`),
    getAll: (params) => ajaxJson("/api/projects"),
  },
  projectContacts: {
    getAllByProjectId: (params) => ajaxJson(`/api/project-contacts?projectId=${params.projectId}`),
  },
  partners: {
    get: (params) => ajaxJson(`/api/partners/${params.partnerId}`),
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

const ajax = <T>(url: string, opts?: RequestInit): Promise<T> => {
  // TODO - ENV.URL?
  const base = "";
  const options = Object.assign({ credentials: "same-origin" as RequestCredentials }, opts);

  return fetch(base + url, options).then(response => {
    if (response.ok) {
      return processResponse(response);
    }
    return response.json()
      .catch(e => Promise.reject(response.statusText))
      .then(errText => Promise.reject(errText));
  });
};

const ajaxJson = <T>(url: string, opts?: RequestInit): Promise<T> => {
  const headers = getHeaders();
  const options = Object.assign({ headers }, opts);
  return ajax(url, options);
};

const ajaxPost = <T>(url: string, body: {} = {}, opts?: RequestInit) => {
  const options: RequestInit = Object.assign({}, opts, {
    method: "POST",
    body: JSON.stringify(body)
  });

  return ajaxJson<T>(url, options);
};

const ajaxPostFormData = <T>(url: string, formData: FormData, opts?: RequestInit) => {
  const options: RequestInit = Object.assign({}, opts, {
    method: "POST",
    body: formData
  });
  return ajax<T>(url, options);
};

// tslint:disable: no-identical-functions
const ajaxPut = <T>(url: string, body: {} = {}, opts?: RequestInit) => {
  const options: RequestInit = Object.assign({}, opts, {
    method: "PUT",
    body: JSON.stringify(body)
  });

  return ajaxJson<T>(url, options);
};

export const ApiClient = clientApi;
