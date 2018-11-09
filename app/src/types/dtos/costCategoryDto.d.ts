interface CostCategoryDto {
    id: string;
    name: string;
    organistionType: "Industrial" | "Academic" | "Unknown";
    competitionType: "Sector" | "Unknown";
    isCalculated: boolean;
    description: string;
    hintText: string;
}
