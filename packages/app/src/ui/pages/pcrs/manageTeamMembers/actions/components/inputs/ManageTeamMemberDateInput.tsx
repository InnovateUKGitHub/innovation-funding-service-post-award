import { DateInput } from "@ui/components/atoms/DateInputs/DateInput";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { useContent } from "@ui/hooks/content.hook";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useManageTeamMemberActionContext } from "../../ManageTeamMemberCrud";

const ManageTeamMemberDateInput = ({
  type,
  visible = false,
  bold = false,
}: {
  type: "startDate" | "endDate";
  visible?: boolean;
  bold?: boolean;
}) => {
  const { defaults, isFetching, memberToManage } = useManageTeamMemberActionContext();
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

  if (!visible) {
    return (
      <>
        <input type="hidden" {...register(`${type}.day`)} value={today.day} />
        <input type="hidden" {...register(`${type}.month`)} value={today.month} />
        <input type="hidden" {...register(`${type}.year`)} value={today.year} />
      </>
    );
  }

  return (
    <Fieldset>
      <FormGroup hasError={!!getFieldState(type).error}>
        <Legend notBold={!bold} isSubQuestion id={`legend-for-${type}`}>
          {type === "startDate"
            ? getContent(x => x.pages.manageTeamMembers.modify.labels.startDate)
            : memberToManage?.pcl.endDate
              ? getContent(x => x.pages.manageTeamMembers.modify.labels.newEndDate)
              : getContent(x => x.pages.manageTeamMembers.modify.labels.endDate)}
        </Legend>
        <ValidationError error={getFieldState(type).error} />
        <div className="govuk-date-input" id={type}>
          <DateInput
            type="day"
            {...register(`${type}.day`)}
            defaultValue={defaults?.[type]?.day ?? ""}
            disabled={isFetching}
          />
          <DateInput
            type="month"
            {...register(`${type}.month`)}
            defaultValue={defaults?.[type]?.month ?? ""}
            disabled={isFetching}
          />
          <DateInput
            type="year"
            {...register(`${type}.year`)}
            defaultValue={defaults?.[type]?.year ?? ""}
            disabled={isFetching}
          />
        </div>
      </FormGroup>
    </Fieldset>
  );
};

export { ManageTeamMemberDateInput };
