import { ClaimDto } from "../models";
import * as Validation from "./common";

export class ClaimDtoValidator extends Validation.Results<ClaimDto>  {
    constructor(dto: ClaimDto, showErrors: boolean) {
        super(dto, showErrors);
    }

    public comments = Validation.all(this,
        () => Validation.required(this, this.model.comments, "Comments are required"),
        () => Validation.maxLength(this, this.model.comments, 10, "Comments must be a maximum of 10 characters"),
    );

    // public totalCost = Validation.isTrue(this, this.model.totalCost > this.model.forecastCost, "Total cost is bigger than the forcast cost");
}
