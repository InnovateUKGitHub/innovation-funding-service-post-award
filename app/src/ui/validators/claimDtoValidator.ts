import { ClaimDto } from "../models";
import * as Validation from "./common";
import { Results } from "../validation/results";

const COMMENTS_LENGTH_MAX = 100;

export class ClaimDtoValidator extends Results<ClaimDto>  {

    constructor(dto: ClaimDto, showErrors: boolean) {
        super(dto, showErrors);
    }

    public comments = Validation.all(this,
        () => Validation.required(this, this.model.comments, "Comments are required"),
        () => Validation.maxLength(this, this.model.comments, COMMENTS_LENGTH_MAX, `Comments must be a maximum of ${COMMENTS_LENGTH_MAX} characters`),
    );

    // public totalCost = Validation.isTrue(this, this.model.totalCost > this.model.forecastCost, "Total cost is bigger than the forcast cost");
}
