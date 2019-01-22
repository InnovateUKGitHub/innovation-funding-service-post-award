interface CostCategoryDto {
    id: string;
    name: string;
    organisationType: "Industrial" | "Academic" | "Unknown";
    competitionType: string;
    isCalculated: boolean;
    description: string;
    hintText: string;
}
