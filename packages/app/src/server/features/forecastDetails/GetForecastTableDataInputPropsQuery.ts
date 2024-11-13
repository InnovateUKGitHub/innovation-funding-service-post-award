import { IContext } from "@framework/types/IContext";
import { GetAllClaimDetailsByPartnerIdQuery } from "@server/features/claimDetails/GetAllClaimDetailsByPartnerIdQuery";
import { GetAllGOLForecastedCostCategoriesQuery } from "@server/features/claims/GetAllGOLForecastedCostCategoriesQuery";
import { GetAllForecastsForPartnerQuery } from "@server/features/forecastDetails/getAllForecastsForPartnerQuery";
import { GetByIdQuery as GetPartnerByIdQuery } from "@server/features/partners/getByIdQuery";
import { GetByIdQuery as GetProjectByIdQuery } from "@server/features/projects/getDetailsByIdQuery";
import { MapToForecastTableProps } from "@ui/components/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import { AuthorisedAsyncQueryBase } from "../common/queryBase";
import { GetAllClaimsByPartnerIdIncludingNewClaimsQuery } from "../claims/GetAllClaimsByPartnerIdIncludingNewClaimsQuery";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";

export class GetForecastTableDataInputPropsQuery extends AuthorisedAsyncQueryBase<
  Omit<MapToForecastTableProps, "clientProfiles">
> {
  public readonly runnableName: string = "GetForecastTableDataInputPropsQuery";
  private readonly projectId: ProjectId;
  private readonly partnerId: PartnerId;

  constructor({ projectId, partnerId }: { projectId: ProjectId; partnerId: PartnerId }) {
    super();
    this.projectId = projectId;
    this.partnerId = partnerId;
  }

  protected async run(context: IContext) {
    const projectPromise = context.runQuery(new GetProjectByIdQuery(this.projectId));
    const partnerPromise = context.runQuery(new GetPartnerByIdQuery(this.partnerId));
    const claimDetailsPromise = context.runQuery(new GetAllClaimDetailsByPartnerIdQuery(this.partnerId));
    const claimTotalProjectPeriodsPromise = context.runQuery(
      new GetAllClaimsByPartnerIdIncludingNewClaimsQuery(this.partnerId),
    );
    const profileTotalCostCategoriesPromise = context.runQuery(
      new GetAllGOLForecastedCostCategoriesQuery(this.partnerId),
    );
    const profileDetailsPromise = context.runQuery(new GetAllForecastsForPartnerQuery(this.partnerId));

    const [project, claimDetails, claimTotalProjectPeriods, profileTotalCostCategories, profileDetails, partner] =
      await Promise.all([
        projectPromise,
        claimDetailsPromise,
        claimTotalProjectPeriodsPromise,
        profileTotalCostCategoriesPromise,
        profileDetailsPromise,
        partnerPromise,
      ]);

    return {
      project,
      partner,
      claimDetails,
      claimTotalProjectPeriods,
      profileTotalCostCategories,
      profileDetails,
    };
  }

  async accessControl(auth: Authorisation) {
    return (
      auth
        .forPartner(this.projectId, this.partnerId)
        .hasAnyRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.ProjectManager) ||
      auth.forProject(this.projectId).hasRole(ProjectRolePermissionBits.MonitoringOfficer)
    );
  }
}
