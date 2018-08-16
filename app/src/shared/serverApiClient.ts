import { IApiClient } from "./apiClient";
import { controller as contacts } from '../server/apis/contacts';
import { controller as partners } from '../server/apis/partners';
import { controller as projects } from '../server/apis/projects';

const serverApiClient: IApiClient = {
    contacts,
    partners,
    projects
};

export default serverApiClient;