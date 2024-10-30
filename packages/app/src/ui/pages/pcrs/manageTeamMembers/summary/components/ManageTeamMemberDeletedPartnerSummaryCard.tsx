import { ProjectContactDtoGql } from "@gql/dtoMapper/mapContactDto";
import { FullDate } from "@ui/components/atoms/Date";
import { SummaryCard } from "@ui/components/atoms/SummaryCard/SummaryCard";
import { SummaryCardContent } from "@ui/components/atoms/SummaryCardContent/SummaryCardContent";
import { SummaryCardTitle } from "@ui/components/atoms/SummaryCardTitle/SummaryCardTitle";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";

const ManageTeamMemberDeletedPartnerSummaryCard = ({
  pcl,
  title,
}: {
  pcl: Pick<ProjectContactDtoGql, "firstName" | "lastName" | "email" | "endDate" | "role">;
  title: string;
}) => (
  <SummaryCard>
    <SummaryCardTitle header="h2">{title}</SummaryCardTitle>
    <SummaryCardContent>
      <SummaryList>
        <SummaryListItem
          label={x => x.pages.manageTeamMembers.summary.firstName}
          content={pcl.firstName}
          qa="before-firstName"
        />
        <SummaryListItem
          label={x => x.pages.manageTeamMembers.summary.lastName}
          content={pcl.lastName}
          qa="before-lastName"
        />
        <SummaryListItem label={x => x.pages.manageTeamMembers.summary.email} content={pcl.email} qa="before-email" />
        <SummaryListItem label={x => x.pages.manageTeamMembers.summary.role} content={pcl.role} qa="before-role" />
        {pcl.endDate && (
          <SummaryListItem
            label={x => x.pages.manageTeamMembers.summary.endDate}
            content={<FullDate value={pcl.endDate} />}
            qa="before-endDate"
          />
        )}
      </SummaryList>
    </SummaryCardContent>
  </SummaryCard>
);

export { ManageTeamMemberDeletedPartnerSummaryCard };
