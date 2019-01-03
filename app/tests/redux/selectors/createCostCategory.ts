export default (mod?: Partial<CostCategoryDto>): CostCategoryDto => {
  const template = {
    id: "",
    name: "Labour",
    competitionType: "Sector" as any,
    description: "Labour",
    isCalculated: false,
    hintText: "",
    organistionType: "Industrial" as any
  };
  return { ...template, ...mod };
};
