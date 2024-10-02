import { BackLink } from "@ui/components/atoms/Links/links";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { useRoutes } from "@ui/context/routesProvider";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { PcrPage, PcrBackLink } from "../../pcrPage";
import { useManageTeamMemberSummaryQuery } from "./ManageTeamMemberSummary.logic";
import { ManageTeamMemberDeletedPartnerSummaryCard } from "./components/ManageTeamMemberDeletedPartnerSummaryCard";
import { ManageTeamMemberCreatedPartnerSummaryCard } from "./components/ManageTeamMemberCreatedPartnerSummaryCard";
import { ManageTeamMemberMethod } from "@framework/constants/pcrConstants";

const ManageTeamMemberSummary = () => {
  const { getContent } = useContent();
  const { projectId, pcrId, itemId, mode } = usePcrWorkflowContext();
  const routes = useRoutes();

  if (mode === "prepare") throw new Error("This page does not support the prepare mode");

  const { pcr, pcrItem, pcl, pcrItemCount } = useManageTeamMemberSummaryQuery({
    pcrId,
    pcrItemId: itemId,
  });

  const { manageTeamMemberType } = pcrItem;

  return (
    <PcrPage
      validationErrors={undefined}
      backLink={
        pcrItemCount === 1 ? (
          <BackLink route={routes.pcrsDashboard.getLink({ projectId })}>
            {getContent(x => x.pages.pcrOverview.backToPcrs)}
          </BackLink>
        ) : (
          <PcrBackLink />
        )
      }
    >
      <SummaryList qa="pcr_reasoning">
        <SummaryListItem label={x => x.pcrLabels.requestNumber} content={pcr.requestNumber} qa="numberRow" />
        <SummaryListItem
          label={x => x.pcrLabels.type({ count: pcrItemCount })}
          content={getContent(x => x.pcrTypes.manageTeamMembers)}
          qa="typesRow"
        />
        {manageTeamMemberType && (
          <SummaryListItem
            label={x => x.pages.manageTeamMembers.summary.action}
            content={getContent(x => x.pages.manageTeamMembers.types[manageTeamMemberType])}
            qa="actionRow"
          />
        )}
      </SummaryList>

      {/* Display one card */}
      {manageTeamMemberType === ManageTeamMemberMethod.DELETE && (
        <ManageTeamMemberDeletedPartnerSummaryCard
          title={getContent(x => x.pages.manageTeamMembers.summary.projectManageTeamMembersDelete.removedTeamMember)}
          pcl={pcl}
        />
      )}

      {/* Display one card */}
      {manageTeamMemberType === ManageTeamMemberMethod.CREATE && (
        <ManageTeamMemberCreatedPartnerSummaryCard
          title={getContent(x => x.pages.manageTeamMembers.summary.projectManageTeamMembersCreate.invitedTeamMember)}
          pcrItem={pcrItem}
        />
      )}

      {/* Display both cards */}
      {(manageTeamMemberType === ManageTeamMemberMethod.REPLACE ||
        manageTeamMemberType === ManageTeamMemberMethod.UPDATE) && (
        <>
          <div className="govuk-grid-column-one-half">
            <ManageTeamMemberDeletedPartnerSummaryCard
              title={getContent(x => x.pages.manageTeamMembers.summary[manageTeamMemberType].removedTeamMember)}
              pcl={pcl}
            />
          </div>
          <div className="govuk-grid-column-one-half">
            <ManageTeamMemberCreatedPartnerSummaryCard
              title={getContent(x => x.pages.manageTeamMembers.summary[manageTeamMemberType].invitedTeamMember)}
              pcrItem={pcrItem}
            />
          </div>
        </>
      )}
    </PcrPage>
  );
};

export { ManageTeamMemberSummary };
