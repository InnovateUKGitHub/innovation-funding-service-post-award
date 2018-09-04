import { IApiClient } from "../server/apis";

const dateRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

const clientApi: IApiClient = {
    contacts:{
        getAll: () => fetch("http://localhost:8080/api/contacts").then(x => processResponse(x)),
        get: (id: string) => fetch(`http://localhost:8080/api/contact/${id}`).then(x => processResponse(x)),
    },
    projects:{
        get: (id: string) => fetch(`http://localhost:8080/api/projects/${id}`).then(x => processResponse(x)),
        getAll: () => fetch("http://localhost:8080/api/projects").then(x => processResponse(x)),
    },
    projectContacts: {
        getAllByProjectId: (projectId: string) => fetch(`http://localhost:8080/api/projectContacts?projectId=${projectId}`).then(x => processResponse(x)),
    },
    partners : {
        getAllByProjectId: (projectId: string) => fetch(`http://localhost:8080/api/partners?projectId=${projectId}`).then(x => processResponse(x)),
    }
};

const processResponse = (response: any) => response.json().then((x: any) => processDto(x));

export const processDto: any = (data: any) => {
    if(Array.isArray(data)) {
        return data.map((x: any) => processDto(x));
    }
    if(data && data.constructor.prototype === Object.prototype) {
        const newObj: {[key: string]: any} = {};
        Object.keys(data).forEach(key => {
            newObj[key] = processDto(data[key]);
        });
        return newObj;
    }
    if (typeof(data) === "string" && dateRegex.test(data)) {
        return new Date(data);
    }
    return data;
};

export default clientApi;
