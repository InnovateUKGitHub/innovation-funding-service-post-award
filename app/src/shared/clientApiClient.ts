import { IApiClient } from "../server/apis";
import { processResponse } from "./processResponse";

const clientApi: IApiClient = {
    contacts:{
      getAll: () => ajaxJson("/api/contacts"),
      get: (id: string) => ajaxJson(`/api/contact/${id}`),
    },
    projects:{
      get: (id: string) => ajaxJson(`/api/projects/${id}`),
      getAll: () => ajaxJson("/api/projects"),
    },
    projectContacts: {
      getAllByProjectId: (projectId: string) => ajaxJson(`/api/projectContacts?projectId=${projectId}`),
    },
    partners : {
      getAllByProjectId: (projectId: string) => ajaxJson(`/api/partners?projectId=${projectId}`),
    }
};

const getHeaders = () => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  return headers;
};

const ajaxJson = <T>(url: string, opts?: {}): Promise<T> => {
  // TODO - ENV.URL?
  const base    = "";
  const headers = getHeaders();
  const options = Object.assign({ headers }, opts);

  return fetch(base + url, options).then(response => {
    if(response.status === 200) {
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

export default clientApi;
