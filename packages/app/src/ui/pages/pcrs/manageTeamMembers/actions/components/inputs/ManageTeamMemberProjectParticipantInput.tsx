import { DropdownSelect } from "@ui/components/atoms/form/Dropdown/Dropdown";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { useContent } from "@ui/hooks/content.hook";
import { useFormContext } from "react-hook-form";
import { useManageTeamMemberActionContext } from "../../ManageTeamMemberCrud";

const ManageTeamMemberProjectParticipantInput = ({ readOnly = false }: { readOnly?: boolean }) => {
  const { isFetching, memberToManage, filteredPartners } = useManageTeamMemberActionContext();
  const { getFieldState, register } = useFormContext();
  const { getContent } = useContent();

  return (
    <Fieldset>
      <FormGroup hasError={!!getFieldState("partnerId").error}>
        <Label htmlFor="partnerId">{getContent(x => x.pages.manageTeamMembers.modify.labels.organisation)}</Label>
        <ValidationError error={getFieldState("partnerId").error} />
        {readOnly ? (
          <>
            {/* If we have selected a PCL to modify, show that partner name here */}
            <input type="hidden" value={memberToManage?.partner.id} {...register("partnerId")} />
            <Hint id="hint-for-partnerId">
              {memberToManage?.partner.name || getContent(x => x.pages.manageTeamMembers.modify.labels.noneProvided)}
            </Hint>
          </>
        ) : filteredPartners.length !== 1 ? (
          <DropdownSelect
            disabled={isFetching}
            hasEmptyOption={true}
            placeholder={getContent(x => x.forms.project.manageTeamMembers.partnerId.placeholder)}
            options={filteredPartners.map(x => ({ id: x.id, value: x.name }))}
            {...register("partnerId")}
          />
        ) : (
          <>
            {/* If there is only 1 partner to select, show that partner */}
            <input type="hidden" value={filteredPartners[0].id} {...register("partnerId")} />
            <Hint id="hint-for-partnerId">{filteredPartners[0].name}</Hint>
          </>
        )}
      </FormGroup>
    </Fieldset>
  );
};

export { ManageTeamMemberProjectParticipantInput };
