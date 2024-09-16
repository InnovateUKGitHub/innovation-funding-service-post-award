import { PcrItemDtoMapping } from "@gql/dtoMapper/mapPcrDto";
import { FullDate } from "@ui/components/atoms/Date";
import { SummaryCard } from "@ui/components/atoms/SummaryCard/SummaryCard";
import { SummaryCardContent } from "@ui/components/atoms/SummaryCardContent/SummaryCardContent";
import { SummaryCardTitle } from "@ui/components/atoms/SummaryCardTitle/SummaryCardTitle";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { useContent } from "@ui/hooks/content.hook";

const ManageTeamMemberCreatedPartnerSummaryCard = ({
  pcrItem,
  title,
}: {
  pcrItem: Pick<
    PcrItemDtoMapping,
    | "type"
    | "manageTeamMemberFirstName"
    | "manageTeamMemberLastName"
    | "manageTeamMemberEmail"
    | "manageTeamMemberRole"
    | "manageTeamMemberAssociateStartDate"
  >;
  title: string;
}) => {
  const { getContent } = useContent();
  const { manageTeamMemberRole } = pcrItem;

  return (
    <SummaryCard>
      <SummaryCardTitle header="h2">{title}</SummaryCardTitle>
      <SummaryCardContent>
        <SummaryList>
          <SummaryListItem
            label={x => x.pages.manageTeamMembers.summary.firstName}
            content={pcrItem.manageTeamMemberFirstName}
            qa="after-firstName"
          />
          <SummaryListItem
            label={x => x.pages.manageTeamMembers.summary.lastName}
            content={pcrItem.manageTeamMemberLastName}
            qa="after-lastName"
          />
          <SummaryListItem
            label={x => x.pages.manageTeamMembers.summary.email}
            content={pcrItem.manageTeamMemberEmail}
            qa="after-email"
          />
          <SummaryListItem
            label={x => x.pages.manageTeamMembers.summary.role}
            content={
              manageTeamMemberRole !== null
                ? getContent(x => x.projectLabels[manageTeamMemberRole]({ count: 1 }))
                : null
            }
            qa="after-role"
          />
          {pcrItem.manageTeamMemberAssociateStartDate && (
            <SummaryListItem
              label={x => x.pages.manageTeamMembers.summary.startDate}
              content={<FullDate value={pcrItem.manageTeamMemberAssociateStartDate} />}
              qa="after-startDate"
            />
          )}
        </SummaryList>
      </SummaryCardContent>
    </SummaryCard>
  );
};

export { ManageTeamMemberCreatedPartnerSummaryCard };
