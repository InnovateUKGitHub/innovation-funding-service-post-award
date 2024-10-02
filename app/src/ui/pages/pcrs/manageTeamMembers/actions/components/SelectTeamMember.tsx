import { Button } from "@ui/components/atoms/Button/Button";
import { DropdownSelect } from "@ui/components/atoms/form/Dropdown/Dropdown";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { ManageTeamMembersSingleContactTable } from "../../ManageTeamMembersSingleContactTable";
import { useFormContext } from "react-hook-form";
import { useManageTeamMemberActionContext } from "../BaseManageTeamMember";
import { useMounted } from "@ui/context/Mounted";
import { useNavigate } from "react-router-dom";
import { useContent } from "@ui/hooks/content.hook";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { useRoutes } from "@ui/context/routesProvider";
import { Link } from "@ui/components/atoms/Links/links";
import { ManageTeamMemberMethod } from "@framework/constants/pcrConstants";

const SelectTeamMember = () => {
  const { register, getFieldState } = useFormContext();
  const { projectId, pclId, memberToManage, categories, role, method, defaults, hideBottomSection, backRoute } =
    useManageTeamMemberActionContext();
  const { getContent } = useContent();
  const navigate = useNavigate();
  const routes = useRoutes();
  const { isClient, isServer } = useMounted();

  // A user may select a different team member if...
  // - When JS is disabled, a member is not selected
  // - When JS is enabled, there are more than 1 member to select in the category
  const canSelect = isServer ? !memberToManage : categories[role].length > 1;

  // Show stub buttons when bottom section is NOT shown
  const showStubButtons = hideBottomSection;

  if (method !== ManageTeamMemberMethod.DELETE && method !== ManageTeamMemberMethod.REPLACE) {
    throw new Error("SelectTeamMember component can only be used when replacing or deleting a team member.");
  }

  return (
    <form method="GET">
      {canSelect ? (
        <>
          <Fieldset>
            <FormGroup hasError={!!getFieldState("pclId").error}>
              <Label htmlFor="pclId">
                {getContent(x => x.projectLabels[role]({ count: categories[role].length }))}
              </Label>
              <ValidationError error={getFieldState("pclId").error} />
              <DropdownSelect
                options={[
                  {
                    id: "undefined",
                    value: getContent(
                      x => x.pages.manageTeamMembers.modify.messages[method][role].pclSelectPlaceholder,
                    ),
                  },
                  ...categories[role].map(x => ({ id: x.pclId, value: x.pcl.name })),
                ]}
                defaultValue={defaults?.pclId}
                {...register("pclId", {
                  setValueAs(newPclId: ProjectContactLinkId) {
                    if (isClient && String(pclId) !== newPclId) {
                      // When the member has been switched between, change the address in the address bar
                      // to match the PCL that has been selected

                      switch (method) {
                        case ManageTeamMemberMethod.REPLACE:
                          navigate(
                            routes.manageTeamMembersReplaceRoute.getLink({
                              projectId,
                              pclId: newPclId,
                              role,
                            }).path,
                            {
                              replace: true,
                            },
                          );
                          break;
                        case ManageTeamMemberMethod.DELETE:
                          navigate(
                            routes.manageTeamMembersDeleteRoute.getLink({
                              projectId,
                              pclId: newPclId,
                              role,
                            }).path,
                            {
                              replace: true,
                            },
                          );
                          break;
                      }
                    }

                    return newPclId;
                  },
                })}
              />
            </FormGroup>
          </Fieldset>
          <Fieldset>
            {showStubButtons && (
              <div className="govuk-button-group">
                {isClient ? (
                  <Button
                    type="submit"
                    styling={
                      method === ManageTeamMemberMethod.DELETE || method === ManageTeamMemberMethod.REPLACE
                        ? "Warning"
                        : "Primary"
                    }
                    disabled
                  >
                    {getContent(x => x.pages.manageTeamMembers.modify.messages[method][role].apply)}
                  </Button>
                ) : (
                  <Button type="submit" styling="Secondary" name="submit" value="true">
                    {getContent(x => x.pages.manageTeamMembers.modify.labels.saveAndContinue)}
                  </Button>
                )}
                <Link styling="Link" route={backRoute}>
                  {getContent(x => x.pages.manageTeamMembers.modify.labels.cancel)}
                </Link>
              </div>
            )}
          </Fieldset>
        </>
      ) : (
        <>
          <ManageTeamMembersSingleContactTable tableData={memberToManage} />
          <input type="hidden" defaultValue={pclId} {...register("pclId")} />
          <input type="hidden" defaultValue={memberToManage?.role} />
        </>
      )}
    </form>
  );
};

export { SelectTeamMember };
