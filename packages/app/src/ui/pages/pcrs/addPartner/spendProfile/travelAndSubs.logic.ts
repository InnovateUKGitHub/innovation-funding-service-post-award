import { TravelAndSubsistenceSchemaType } from "./spendProfile.zod";
import { projectCostUpdater } from "./spendProfileCosts.logic";

export const useOnUpdateTravelAndSubsistence = () => {
  return projectCostUpdater<TravelAndSubsistenceSchemaType>("addPartnerProjectCostTravelAndSubsistence");
};
