import { ClaimDto, ClaimStatus, CostsSummaryForPeriodDto } from "@framework/types";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { Result } from "../validation/result";
import { Results } from "../validation/results";
import * as Validation from "./common";

const commentsLengthMax = 1000;

export class ClaimDtoValidator extends Results<ClaimDto>  {
    constructor(
      dto: ClaimDto,
      private readonly originalStatus: ClaimStatus,
      private readonly details: CostsSummaryForPeriodDto[],
      private readonly costCategories: CostCategoryDto[],
      private readonly documents: DocumentSummaryDto[],
      readonly showErrors: boolean
    ) {
        super(dto, showErrors);

        const permittedStatus = [ClaimStatus.DRAFT, ClaimStatus.SUBMITTED, ClaimStatus.MO_QUERIED, ClaimStatus.AWAITING_IUK_APPROVAL, ClaimStatus.INNOVATE_QUERIED];

        this.status = Validation.isTrue(this, !this.model.status || permittedStatus.indexOf(this.model.status) !== -1, "Set a valid status");
    }

    private readonly iarRequiredStatus = new Map<ClaimStatus, ClaimStatus[]>([
      [
        ClaimStatus.DRAFT,
        [
          ClaimStatus.SUBMITTED,
        ]
      ],
      [
        ClaimStatus.MO_QUERIED,
        [
          ClaimStatus.SUBMITTED,
        ]
      ],
      [
        ClaimStatus.INNOVATE_QUERIED,
        [
          ClaimStatus.AWAITING_IUK_APPROVAL,
        ]
      ]
    ]);

    public id = Validation.required(this, this.model.id, "Id is required");

    public comments = Validation.all(this,
      () => this.model.status === ClaimStatus.MO_QUERIED && this.originalStatus !== ClaimStatus.MO_QUERIED ? Validation.required(this, this.model.comments, "Comments are required if querying a claim") : Validation.valid(this),
      () => Validation.maxLength(this, this.model.comments, commentsLengthMax, `Comments must be a maximum of ${commentsLengthMax} characters`)
    );

    public status: Result;

    private validateIar() {
      const iarRequiredStatus = this.iarRequiredStatus.get(this.originalStatus);
      const isIarRequired = this.model.isIarRequired && iarRequiredStatus && iarRequiredStatus.indexOf(this.model.status) !== -1;
      return Validation.isTrue(this, !isIarRequired || this.documents.length > 0, "You must upload a supporting document before you can submit this claim.");
    }
    public iar = this.validateIar();

    readonly remainingOfferCosts = this.details.reduce((total, item) => total + item.remainingOfferCosts, 0);

    public totalCosts = Validation.isPositiveFloat(this, this.remainingOfferCosts, "You must reduce your claim to ensure the remaining eligible costs are zero or higher.");
}
