export default (mod?: Partial<CostCategoryDto>): CostCategoryDto => {
  const template = {
    id: "",
    name: "Labour",
    competitionType: "Sector" as "Sector",
    description: "Labour",
    isCalculated: false,
    hintText: "",
    organistionType: "Industrial" as "Industrial"
  };
  return { ...template, ...mod };
};
