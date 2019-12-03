export default (mod?: Partial<CostCategoryDto>): CostCategoryDto => {
  const template: CostCategoryDto = {
    id: "",
    name: "Labour",
    competitionType: "Sector" as any,
    description: "Labour",
    isCalculated: false,
    hasRelated: false,
    hintText: "",
    organisationType: "Industrial" as any
  };
  return { ...template, ...mod };
};
