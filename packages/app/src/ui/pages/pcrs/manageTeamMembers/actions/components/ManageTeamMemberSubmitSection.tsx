import { Button } from "@ui/components/atoms/Button/Button";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Link } from "@ui/components/atoms/Links/links";
import { useContent } from "@ui/hooks/content.hook";
import { useManageTeamMemberActionContext } from "../ManageTeamMemberCrud";
import { ManageTeamMemberMethod } from "@framework/constants/pcrConstants";

const ManageTeamMemberSubmitSection = () => {
  const { method, hideBottomSection, backRoute, isFetching, role } = useManageTeamMemberActionContext();
  const { getContent } = useContent();

  if (hideBottomSection) return null;

  return (
    <Fieldset>
      <div className="govuk-button-group">
        <Button
          type="submit"
          styling={
            method === ManageTeamMemberMethod.DELETE || method === ManageTeamMemberMethod.REPLACE
              ? "Warning"
              : "Primary"
          }
          disabled={isFetching}
        >
          {getContent(x => x.pages.manageTeamMembers.modify.messages[method][role].apply)}
        </Button>
        <Link styling="Link" route={backRoute} disabled={isFetching}>
          {getContent(x => x.pages.manageTeamMembers.modify.labels.cancel)}
        </Link>
      </div>
    </Fieldset>
  );
};

export { ManageTeamMemberSubmitSection };
