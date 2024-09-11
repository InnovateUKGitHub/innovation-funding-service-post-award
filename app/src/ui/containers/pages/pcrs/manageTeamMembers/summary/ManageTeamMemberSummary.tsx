import { BackLink } from "@ui/components/atoms/Links/links";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { useRoutes } from "@ui/context/routesProvider";
import { useContent } from "@ui/hooks/content.hook";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { PcrPage, PcrBackLink } from "../../pcrPage";
import { useManageTeamMemberSummaryQuery } from "./ManageTeamMemberSummary.logic";

const ManageTeamMemberSummary = () => {
  const { projectId, pcrId, mode } = usePcrWorkflowContext();
  const routes = useRoutes();

  if (mode === "prepare") throw new Error("This page does not support the prepare mode");

  const { pcr, pcrItemCount } = useManageTeamMemberSummaryQuery({
    pcrId,
  });
  const { getContent } = useContent();

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
      </SummaryList>
    </PcrPage>
  );
};

export { ManageTeamMemberSummary };
