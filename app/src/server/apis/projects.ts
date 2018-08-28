import { GetAllQuery, GetByIdQuery } from "../features/projects";
import { ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";
import { ProjectDto } from "../../models/projectDto";

export interface IProjectsApi {
    get: (id: string) => Promise<ProjectDto|null>;
    getAll: () => Promise<ProjectDto[]>;
}

class Controller extends ControllerBase<ProjectDto> implements IProjectsApi {
    constructor() {
        super();

        this.getItem("/:id", p => ({ id: p.id }), (p) => this.get(p.id));
        this.getCustom("/", p => ({ }), (p) => this.getAll());
    }

    public async get(id: string) {
        const query = new GetByIdQuery(id);
        return await contextProvider.start().runQuery(query);
    }

    public async getAll() {
        const query = new GetAllQuery();
        return await contextProvider.start().runQuery(query);
    }
}

export const controller = new Controller();
