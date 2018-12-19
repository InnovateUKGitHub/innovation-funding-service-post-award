interface CostCategoryDto {
    id: string;
    name: string;
    organistionType: "Industrial" | "Academic" | "Unknown";
    competitionType: string;
    isCalculated: boolean;
    description: string;
    hintText: string;
}
