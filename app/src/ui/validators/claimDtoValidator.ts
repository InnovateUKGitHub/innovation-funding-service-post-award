import { ClaimDetailsSummaryDto, ClaimDto, CostCategoryDto } from "../models";
import * as Validation from "./common";
import { Results } from "../validation/results";

const COMMENTS_LENGTH_MAX = 100;

export class ClaimDtoValidator extends Results<ClaimDto>  {
    constructor(dto: ClaimDto, private details: ClaimDetailsSummaryDto[], private costCategories: CostCategoryDto[], showErrors: boolean) {
        super(dto, showErrors);
    }

    public comments = Validation.maxLength(this, this.model.comments, COMMENTS_LENGTH_MAX, `Comments must be a maximum of ${COMMENTS_LENGTH_MAX} characters`);

    public claimDetails = Validation.optionalChild(this, this.details, (item) => new ClaimDetailsValidator(item, this.costCategories.find(x => x.id === item.costCategoryId), this.showValidationErrors), "Your costs for this period are more than your remaining grant offer letter costs in at least one cost category. You must remove some costs before you can submit this claim.");

    public totalCost = Validation.isFalse(this, this.model.totalCost > this.model.forecastCost, "Total cost is bigger than the forcast cost");
}

export class ClaimDetailsValidator extends Results<ClaimDetailsSummaryDto> {
    constructor(model: ClaimDetailsSummaryDto, private costCategory: CostCategoryDto|null|undefined, show: boolean) {
        super(model, show);
    }
    costsClaimedThisPeriod = Validation.isFalse(this, this.model.offerCosts < (this.model.costsClaimedToDate + this.model.costsClaimedThisPeriod), this.costCategory ? `Your costs for ${this.costCategory.name} this period are more than your remaining grant offer letter costs. You must remove some costs before you can submit this claim.` : `Your costs for this period are more than your remaining grant offer letter costs. You must remove some costs before you can submit this claim.`);
}
