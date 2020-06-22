import {ContentBase} from "@content/contentBase";
import {CostCategoryType} from "@framework/entities";

export class PcrSpendProfileMessages extends ContentBase {
    constructor(parent: ContentBase) {
        super(parent, "spend-profile-messages");
    }

    public readonly costGuidance = (costCategory: CostCategoryType) => {
        switch (costCategory) {
            case CostCategoryType.Labour: return this.getContent(`cost-guidance-labour`, {markdown: true});
            case CostCategoryType.Overheads: return this.getContent(`cost-guidance-overheads`, {markdown: true});
            case CostCategoryType.Materials: return this.getContent(`cost-guidance-materials`, {markdown: true});
            case CostCategoryType.Subcontracting: return this.getContent(`cost-guidance-subcontracting`, {markdown: true});
            case CostCategoryType.Capital_Usage: return this.getContent(`cost-guidance-capital-usage`, {markdown: true});
            case CostCategoryType.Travel_And_Subsistence: return this.getContent(`cost-guidance-travel-and-subs`, {markdown: true});
            case CostCategoryType.Other_Costs: return this.getContent("cost-guidance-other-costs", {markdown: true});
            default:
                return this.getContent(`cost-guidance-default`, {markdown: true});
        }
    }
}
