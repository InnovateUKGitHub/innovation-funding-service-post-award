export default (mod?: Partial<CostCategoryDto>): CostCategoryDto => {
  const template = {
    id: "",
    name: "Labour",
    competitionType: "Sector" as any,
    description: "Labour",
    isCalculated: false,
    hintText: "",
    organisationType: "Industrial" as any
  };
  return { ...template, ...mod };
};
