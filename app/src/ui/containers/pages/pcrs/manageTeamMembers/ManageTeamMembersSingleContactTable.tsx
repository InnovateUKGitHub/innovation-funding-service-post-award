import { ManageTeamMembersTableData } from "./ManageTeamMember.logic";
import { ManageTeamMembersContactListTable } from "./ManageTeamMembersContactListTable";

interface ManageTeamMembersContactTableProps {
  tableData: ManageTeamMembersTableData | undefined;
}

const ManageTeamMembersSingleContactTable = ({ tableData }: ManageTeamMembersContactTableProps) => {
  if (tableData) {
    return <ManageTeamMembersContactListTable link={null} tableData={[tableData]} />;
  } else {
    return null;
  }
};

export { ManageTeamMembersSingleContactTable };
