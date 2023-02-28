import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { PCRTimeExtensionOption } from "@framework/dtos";

import { QueryBase } from "@server/features/common";
import { GetByIdQuery } from "@server/features/projects";

import { monthDifference, totalCalendarMonths } from "@shared/date-helpers";

export class GetTimeExtensionOptionsQuery extends QueryBase<PCRTimeExtensionOption[]> {
  constructor(private readonly projectId: ProjectId) {
    super();
  }

  public async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.MonitoringOfficer, ProjectRole.ProjectManager);
  }

  private createLabelFromDate(dateToParse: Date): string {
    const dateValue = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

    return dateValue.format(dateToParse);
  }

  private generateOptions(endDate: Date, maxFutureLimitInYears: number): PCRTimeExtensionOption[] {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const initialOffset = monthDifference(endDate, currentDate);

    const totalPreviousMonths = Math.abs(initialOffset);
    const currentProjectCount = 1; // Note: We want to include this in list as the initial option
    const totalFutureMonths = totalCalendarMonths * maxFutureLimitInYears;

    const combinedOptionCount = totalPreviousMonths + currentProjectCount + totalFutureMonths;

    return Array.from({ length: combinedOptionCount }, (_, monthCount) => {
      const optionDate = new Date(currentYear, currentMonth + monthCount, 0);

      return {
        label: this.createLabelFromDate(optionDate),
        offset: initialOffset + monthCount,
      };
    });
  }

  protected async run(context: IContext): Promise<PCRTimeExtensionOption[]> {
    const { endDate } = await context.runQuery(new GetByIdQuery(this.projectId));

    return this.generateOptions(endDate, context.config.features.futureTimeExtensionInYears);
  }
}
