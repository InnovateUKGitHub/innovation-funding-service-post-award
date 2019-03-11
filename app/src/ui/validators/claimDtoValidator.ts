import * as Validation from "./common";
import { Results } from "../validation/results";
import { Result } from "../validation/result";
import { ClaimDto, ClaimStatus } from "../../types";

const COMMENTS_LENGTH_MAX = 1000;

export class ClaimDtoValidator extends Results<ClaimDto>  {
    constructor(
      dto: ClaimDto,
      private readonly details: ClaimDetailsSummaryDto[],
      private readonly costCategories: CostCategoryDto[],
      readonly showErrors: boolean
    ) {
        super(dto, showErrors);

        const permittedStatus = [ClaimStatus.DRAFT, ClaimStatus.SUBMITTED, ClaimStatus.MO_QUERIED, ClaimStatus.AWAITING_IUK_APPROVAL, ClaimStatus.INNOVATE_QUERIED];

        this.status = Validation.isTrue(this, !this.model.status || permittedStatus.indexOf(this.model.status) !== -1, `Set a valid status`);
    }

    public id = Validation.required(this, this.model.id, "Id is required");

    public comments = Validation.maxLength(this, this.model.comments, COMMENTS_LENGTH_MAX, `Comments must be a maximum of ${COMMENTS_LENGTH_MAX} characters`);

    public status: Result;

    public claimDetails = Validation.optionalChild(
      this,
      this.details,
      (item) => new ClaimDetailsValidator(item, this.costCategories.find(x => x.id === item.costCategoryId), this.showValidationErrors),
      "Your costs for this period are more than your remaining grant offer letter costs in at least one cost category. You must remove some costs before you can submit this claim."
    );
}

export class ClaimDetailsValidator extends Results<ClaimDetailsSummaryDto> {
    constructor(
      readonly model: ClaimDetailsSummaryDto,
      private readonly costCategory: CostCategoryDto | null | undefined,
      readonly show: boolean
    ) {
        super(model, show);
    }

    costsClaimedThisPeriod = Validation.isFalse(
      this,
      this.model.offerCosts < (this.model.costsClaimedToDate + this.model.costsClaimedThisPeriod),
      this.costCategory
        ? `Your costs for ${this.costCategory.name} this period are more than your remaining grant offer letter costs. You must remove some costs before you can submit this claim.`
        : `Your costs for this period are more than your remaining grant offer letter costs. You must remove some costs before you can submit this claim.`
    );
}
