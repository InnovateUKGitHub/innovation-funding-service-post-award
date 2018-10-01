import { IApiClient } from "../server/apis";
import { processResponse } from "./processResponse";
import {ClaimDto} from "../ui/models";

const clientApi: IApiClient = {
  claimLineItems: {
    getAllForCategory: (partnerId: string, costCategoryId: string, periodId: number) => ajaxJson(`/api/claims/${partnerId}/lineitems?costCategoryId=${costCategoryId}&periodId=${periodId}`)
  },
  claims : {
    getAllByPartnerId: (partnerId: string) => ajaxJson(`/api/claims?partnerId=${partnerId}`),
    getById: (claimId: string) => ajaxJson(`/api/claims/${claimId}`),
    update: (claimId: string, claim: ClaimDto) => ajaxPut(`/api/claims/${claimId}`, claim)
  },
  claimDetails: {
    getAllByPartnerId: (partnerId: string, periodId: number) => ajaxJson(`/api/claimDetails?partnerId=${partnerId}&periodId=${periodId}`)
  },
  contacts: {
    getAll: () => ajaxJson("/api/contacts"),
    get: (id: string) => ajaxJson(`/api/contact/${id}`),
  },
  costCategories: {
    getAll: () => ajaxJson("/api/costcategories"),
  },
  projects: {
    get: (id: string) => ajaxJson(`/api/projects/${id}`),
    getAll: () => ajaxJson("/api/projects"),
  },
  projectContacts: {
    getAllByProjectId: (projectId: string) => ajaxJson(`/api/projectContacts?projectId=${projectId}`),
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
    if (response.status === 200) {
      return processResponse(response);
    }

    return Promise.reject(response.statusText);
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
