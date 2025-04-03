import { FullDate } from "@ui/components/atoms/Date";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { useContent } from "@ui/hooks/content.hook";
import { useManageTeamMemberActionContext } from "../../ManageTeamMemberCrud";

const ManageTeamMemberEndDate = ({ bold = false }: { bold?: boolean }) => {
  const { memberToManage } = useManageTeamMemberActionContext();
  const { getContent } = useContent();

  if (!memberToManage?.pcl.endDate) return null;

  return (
    <Fieldset>
      <FormGroup>
        <Legend notBold={!bold} isSubQuestion>
          {getContent(x => x.pages.manageTeamMembers.modify.labels.existingEndDate)}
        </Legend>
        <Hint id="hint-for-current-end-date">
          <FullDate value={memberToManage?.pcl.endDate} />
        </Hint>
      </FormGroup>
    </Fieldset>
  );
};

export { ManageTeamMemberEndDate };
