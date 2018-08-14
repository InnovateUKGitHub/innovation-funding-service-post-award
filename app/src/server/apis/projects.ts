import { GetByIdQuery } from "../features/projects/getDetailsByIdQuery";
import { ProjectDetailsDto } from "../../containers/projects/details";
import { ControllerBase } from "./controllerBase";
import contextProvider from "../features/common/contextProvider";

class Controller extends ControllerBase<ProjectDetailsDto>
{
    constructor() {
        super("projects");

        this.getItem("/:id", p => ({ id: p.id }), (p) => this.get(p.id));
    }


    public async get(id: string) {
        const query = new GetByIdQuery(id);
        return await contextProvider.start().runQuery(query);
    }

}
export const controller = new Controller();