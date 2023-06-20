import { ProjectMonitoringLevel } from "@framework/constants/project";

const getMonitoringLevel = (level: string | null | undefined): ProjectMonitoringLevel => {
  switch (level) {
    case "Platinum":
      return ProjectMonitoringLevel.Platinum;
    case "Gold":
      return ProjectMonitoringLevel.Gold;
    case "Silver":
      return ProjectMonitoringLevel.Silver;
    case "Bronze":
      return ProjectMonitoringLevel.Bronze;
    case "Internal Assurance":
      return ProjectMonitoringLevel.InternalAssurance;
    default:
      return ProjectMonitoringLevel.Unknown;
  }
};

export { getMonitoringLevel };
