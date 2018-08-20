import { IApiClient } from "./apiClient";

const clientApi: IApiClient = {
    contacts:{
        getAll: () => fetch("http://localhost:8080/api/contacts").then(x => x.json()),
        get: (id: string) => fetch(`http://localhost:8080/api/contact/${id}`).then(x => x.json())
    },
    projects:{
        get: (id: string) => fetch(`http://localhost:8080/api/projects/${id}`).then(x => x.json())
    },
    projectContacts: {
        getAllByProjectId: (projectId: string) => fetch(`http://localhost:8080/api/projectContacts?projectId=${projectId}`).then(x => x.json())
    },
    partners : {
        getAllByProjectId: (projectId: string) => fetch(`http://localhost:8080/api/partners?projectId=${projectId}`).then(x => x.json())
    }
};

export default clientApi;