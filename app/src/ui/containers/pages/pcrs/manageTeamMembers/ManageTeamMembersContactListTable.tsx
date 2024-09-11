import { Table, TBody, TD, TH, THead, TR } from "@ui/components/atoms/table/tableComponents";

import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { useContent } from "@ui/hooks/content.hook";
import { ManageTeamMembersTableData } from "./ManageTeamMember.logic";

interface ManageTeamMembersContactTableProps {
  tableData: ManageTeamMembersTableData[];
  link?: React.FunctionComponent<{ data: ManageTeamMembersTableData }> | null;
}

const ManageTeamMembersContactListTable = ({ tableData, link: Link }: ManageTeamMembersContactTableProps) => {
  const { getContent } = useContent();

  if (tableData.length === 0) {
    return <P>{getContent(x => x.projectContactLabels.noContactsMessage)}</P>;
  }

  return (
    <Table>
      <THead>
        <TR>
          <TH className="govuk-!-width-one-third">{getContent(x => x.pages.manageTeamMembers.table.contactName)}</TH>
          <TH className="govuk-!-width-one-third">{getContent(x => x.pages.manageTeamMembers.table.contactOrg)}</TH>
          {Link && (
            <TH className="govuk-!-width-one-third">
              {getContent(x => x.pages.manageTeamMembers.table.contactOptions)}
            </TH>
          )}
        </TR>
      </THead>
      <TBody>
        {tableData.map(data => (
          <TR key={data.pclId}>
            <TD>{data.pcl.name}</TD>
            <TD>{data.partner.name}</TD>
            {Link && (
              <TD>
                <div className="acc-links-group">
                  <Link data={data} />
                </div>
              </TD>
            )}
          </TR>
        ))}
      </TBody>
    </Table>
  );
};

export { ManageTeamMembersContactListTable };
