import { DateInput } from "@ui/components/atoms/DateInputs/DateInput";
import { DropdownSelect } from "@ui/components/atoms/form/Dropdown/Dropdown";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { useContent } from "@ui/hooks/content.hook";
import { useFormContext } from "react-hook-form";
import { useManageTeamMemberActionContext } from "../BaseManageTeamMember";
import { ManageTeamMemberMethod } from "@framework/constants/pcrConstants";
import { useMemo } from "react";
import { ProjectRole } from "@framework/dtos/projectContactDto";

const ManageTeamMemberInputs = () => {
  const { method, role, defaults, isFetching, memberToManage, filteredPartners } = useManageTeamMemberActionContext();
  const { getFieldState, register } = useFormContext();
  const { getContent } = useContent();
  const today = useMemo(() => {
    const dateTime = new Date();

    return {
      day: dateTime.getDate(),
      month: dateTime.getMonth() + 1,
      year: dateTime.getFullYear(),
    };
  }, []);

  return (
    <>
      <Fieldset>
        <FormGroup hasError={!!getFieldState("firstName").error}>
          <Label htmlFor="firstName">{getContent(x => x.pages.manageTeamMembers.modify.labels.firstName)}</Label>
          <ValidationError error={getFieldState("firstName").error} />
          <TextInput
            inputWidth="one-third"
            defaultValue={defaults?.firstName}
            {...register("firstName")}
            disabled={isFetching}
          />
        </FormGroup>
      </Fieldset>

      <Fieldset>
        <FormGroup hasError={!!getFieldState("lastName").error}>
          <Label htmlFor="lastName">{getContent(x => x.pages.manageTeamMembers.modify.labels.lastName)}</Label>
          <ValidationError error={getFieldState("lastName").error} />
          <TextInput
            inputWidth="one-third"
            defaultValue={defaults.lastName}
            {...register("lastName")}
            disabled={isFetching}
          />
        </FormGroup>
      </Fieldset>

      <Fieldset>
        <FormGroup hasError={!!getFieldState("partnerId").error}>
          <Label htmlFor="partnerId">{getContent(x => x.pages.manageTeamMembers.modify.labels.organisation)}</Label>
          <ValidationError error={getFieldState("partnerId").error} />
          {method === ManageTeamMemberMethod.CREATE ? (
            filteredPartners.length !== 1 ? (
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
            )
          ) : (
            <>
              {/* If we have selected a PCL to modify, show that partner name here */}
              <input type="hidden" value={memberToManage?.partner.id} {...register("partnerId")} />
              <Hint id="hint-for-partnerId">
                {memberToManage?.partner.name || getContent(x => x.pages.manageTeamMembers.modify.labels.noneProvided)}
              </Hint>
            </>
          )}
        </FormGroup>
      </Fieldset>

      <Fieldset>
        <FormGroup hasError={!!getFieldState("email").error}>
          <Label htmlFor="email">{getContent(x => x.pages.manageTeamMembers.modify.labels.email)}</Label>
          <ValidationError error={getFieldState("email").error} />
          {method === ManageTeamMemberMethod.CREATE || method === ManageTeamMemberMethod.REPLACE ? (
            <TextInput
              inputWidth="one-half"
              defaultValue={defaults?.email}
              {...register("email")}
              disabled={isFetching}
            />
          ) : (
            <Hint id="hint-for-email">
              {memberToManage?.pcl?.email || getContent(x => x.pages.manageTeamMembers.modify.labels.noneProvided)}
            </Hint>
          )}
        </FormGroup>
      </Fieldset>

      {method === ManageTeamMemberMethod.CREATE &&
        (role === ProjectRole.ASSOCIATE ? (
          <Fieldset>
            <FormGroup hasError={!!getFieldState("startDate").error}>
              <Label htmlFor="startDate">{getContent(x => x.pages.manageTeamMembers.modify.labels.startDate)}</Label>
              <ValidationError error={getFieldState("startDate").error} />
              <div className="govuk-date-input">
                <DateInput
                  type="day"
                  {...register("startDate.day")}
                  defaultValue={defaults?.startDay ?? ""}
                  disabled={isFetching}
                />
                <DateInput
                  type="month"
                  {...register("startDate.month")}
                  defaultValue={defaults?.startMonth ?? ""}
                  disabled={isFetching}
                />
                <DateInput
                  type="year"
                  {...register("startDate.year")}
                  defaultValue={defaults?.startYear ?? ""}
                  disabled={isFetching}
                />
              </div>
            </FormGroup>
          </Fieldset>
        ) : (
          <>
            <input type="hidden" {...register("startDate.day")} value={today.day} />
            <input type="hidden" {...register("startDate.month")} value={today.month} />
            <input type="hidden" {...register("startDate.year")} value={today.year} />
          </>
        ))}
    </>
  );
};

export { ManageTeamMemberInputs };
