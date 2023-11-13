import { PCRPartnerType } from "@framework/constants/pcrConstants";
import { Option } from "@framework/dtos/option";

export const pcrPartnerTypes = [
  {
    value: PCRPartnerType.Business,
    label: "Business",
    active: true,
  },
  {
    value: PCRPartnerType.Research,
    label: "Research",
    active: true,
  },
  {
    value: PCRPartnerType.ResearchAndTechnology,
    label: "Research and Technology Organisation (RTO)",
    active: true,
  },
  {
    value: PCRPartnerType.Other,
    label: "Public Sector, charity or non Je-S registered research organisation",
    active: true,
  },
] as Option<PCRPartnerType>[];
