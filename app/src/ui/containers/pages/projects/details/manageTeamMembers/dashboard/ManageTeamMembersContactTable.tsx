import { Table, TBody, TD, TH, THead, TR } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { ManageTeamMembersDashboardTableData } from "./ManageTeamMembersDashboard.logic";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { useContent } from "@ui/hooks/content.hook";

interface ManageTeamMembersContactTableProps {
  tableData: ManageTeamMembersDashboardTableData[];
  link: React.FunctionComponent<{ data: ManageTeamMembersDashboardTableData }>;
}

const ManageTeamMembersContactTable = ({ tableData, link: Link }: ManageTeamMembersContactTableProps) => {
  const { getContent } = useContent();

  if (tableData.length === 0) {
    return <P>{getContent(x => x.projectContactLabels.noContactsMessage)}</P>;
  }

  return (
    <Table>
      <THead>
        <TR>
          <TH className="govuk-!-width-one-third">
            {getContent(x => x.pages.manageTeamMembers.dashboard.contactName)}
          </TH>
          <TH className="govuk-!-width-one-third">{getContent(x => x.pages.manageTeamMembers.dashboard.contactOrg)}</TH>
          <TH className="govuk-!-width-one-third">
            {getContent(x => x.pages.manageTeamMembers.dashboard.contactOptions)}
          </TH>
        </TR>
      </THead>
      <TBody>
        {tableData.map(data => (
          <TR key={data.pclId}>
            <TD>{data.pcl.name}</TD>
            <TD>{data.partner.name}</TD>
            <TD>
              <Link data={data} />
            </TD>
          </TR>
        ))}
      </TBody>
    </Table>
  );
};

export { ManageTeamMembersContactTable };
