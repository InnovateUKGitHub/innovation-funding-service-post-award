import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { useContent } from "@ui/hooks/content.hook";
import { useFormContext } from "react-hook-form";
import { useManageTeamMemberActionContext } from "../../ManageTeamMemberCrud";

const ManageTeamMemberEmailInput = ({ readOnly = false }: { readOnly?: boolean }) => {
  const { defaults, isFetching, memberToManage } = useManageTeamMemberActionContext();
  const { getFieldState, register } = useFormContext();
  const { getContent } = useContent();

  return (
    <Fieldset>
      <FormGroup hasError={!!getFieldState("email").error}>
        <Label htmlFor="email">{getContent(x => x.pages.manageTeamMembers.modify.labels.email)}</Label>
        <ValidationError error={getFieldState("email").error} />
        {readOnly ? (
          <Hint id="hint-for-email">
            {memberToManage?.pcl?.email || getContent(x => x.pages.manageTeamMembers.modify.labels.noneProvided)}
          </Hint>
        ) : (
          <TextInput
            inputWidth="one-half"
            defaultValue={defaults?.email}
            {...register("email")}
            disabled={isFetching}
          />
        )}
      </FormGroup>
    </Fieldset>
  );
};

export { ManageTeamMemberEmailInput };
