import { DateTime } from "luxon";
import { ProjectDto } from "@framework/dtos";

export const periodInProject = (date: Date|null, project: ProjectDto) => {
  if (!date) return null;

  const dateLuxon = DateTime.fromJSDate(date);
  const projectStartDateLuxon = DateTime.fromJSDate(project.startDate);

  const monthsDiff = dateLuxon.diff(projectStartDateLuxon, "months");
  return Math.ceil((Math.floor(monthsDiff.months + 1))/project.claimFrequency);
};
