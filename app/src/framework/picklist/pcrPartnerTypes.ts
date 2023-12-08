import { PCRPartnerType } from "@framework/constants/pcrConstants";

export const pcrPartnerTypes = [
  {
    value: PCRPartnerType.Business,
    label: "Business",
    id: "business",
    active: true,
  },
  {
    value: PCRPartnerType.Research,
    label: "Research",
    id: "research",
    active: true,
  },
  {
    value: PCRPartnerType.ResearchAndTechnology,
    label: "Research and Technology Organisation (RTO)",
    id: "research_and_technology_organisation",
    active: true,
  },
  {
    value: PCRPartnerType.Other,
    label: "Public Sector, charity or non Je-S registered research organisation",
    id: "public_sector_charity_non_jes_research_organisation",
    active: true,
  },
] as const;
