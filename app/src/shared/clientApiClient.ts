import { IApiClient } from "./apiClient";
import * as contacts from '../client/apis/contacts';
import * as projects from '../client/apis/projects';

const clientApi: IApiClient = {
    contacts,
    projects,
    partners : {
        getAllByProjectId: (projectId: string) => fetch(`http://localhost:8080/api/partners?projectId=${projectId}`).then(x => x.json())
    }
};

export default clientApi;