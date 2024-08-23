import { BaseProps } from "@ui/containers/containerBase";
import {
  BaseManageTeamMemberData,
  BaseManageTeamMemberProps,
  ManageTeamMemberMethod,
  ManageTeamMemberMethods,
  ManageTeamMemberRoles,
  useManageTeamMembersDefault,
  useOnBaseManageTeamMemberSubmit,
} from "./BaseManageTeamMember.logic";
import { useManageTeamMembersQuery } from "./ManageTeamMember.logic";
import { ManageTeamMembersSingleContactTable } from "./ManageTeamMembersSingleContactTable";
import { BackLink, Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page.withFragment";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/context/routesProvider";
import { useForm } from "react-hook-form";
import {
  baseManageTeamMemberErrorMap,
  baseManageTeamMemberValidator,
  BaseManageTeamMemberValidatorSchema,
} from "./BaseManageTeamMember.zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { DropdownSelect } from "@ui/components/atomicDesign/atoms/form/Dropdown/Dropdown";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { useNavigate } from "react-router-dom";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";

const BaseManageTeamMember = ({
  projectId,
  pclId: defaultPclId,
  role,
  method,
}: BaseProps & BaseManageTeamMemberProps & BaseManageTeamMemberData) => {
  const { getContent } = useContent();
  const routes = useRoutes();
  const navigate = useNavigate();
  const { isClient, isServer } = useMounted();
  const backRoute = routes.projectManageTeamMembersDashboard.getLink({ projectId });

  const { collated, categories, fragmentRef, partners } = useManageTeamMembersQuery({ projectId });

  const { register, setError, formState, getFieldState, watch, handleSubmit } = useForm<
    z.output<BaseManageTeamMemberValidatorSchema>
  >({
    resolver: zodResolver(baseManageTeamMemberValidator, { errorMap: baseManageTeamMemberErrorMap }),
    defaultValues: {
      pclId: defaultPclId,
    },
  });
  const { onUpdate } = useOnBaseManageTeamMemberSubmit();
  const validationErrors = useZodErrors<z.output<BaseManageTeamMemberValidatorSchema>>(setError, formState.errors);
  const pclId = watch("pclId");
  const { memberToManage, defaults, hideBottomSection } = useManageTeamMembersDefault({ pclId, collated, method });

  const validPage =
    ManageTeamMemberMethods.includes(method) &&
    ManageTeamMemberRoles.includes(role) &&
    // If we are NOT in create, check the PCL matches the role we are changing
    (method === ManageTeamMemberMethod.CREATE || (memberToManage ? memberToManage.role === role : true));

  return (
    <Page
      heading={
        validPage
          ? getContent(x => x.pages.manageTeamMembers.modify.messages[method][role].title)
          : getContent(x => x.pages.manageTeamMembers.modify.messages.invalid.title)
      }
      backLink={<BackLink route={backRoute}>{getContent(x => x.pages.manageTeamMembers.modify.backLink)}</BackLink>}
      fragmentRef={fragmentRef}
      validationErrors={validationErrors}
    >
      <P>
        {validPage ? (
          getContent(x => x.pages.manageTeamMembers.modify.messages[method][role].subtitle)
        ) : (
          <Content
            value={x => x.pages.manageTeamMembers.modify.messages.invalid.subtitle}
            components={[
              <Link key="0" styling="Link" route={backRoute}>
                {" "}
              </Link>,
            ]}
          />
        )}
      </P>

      {validPage && (
        <>
          <form method="GET">
            {(method === ManageTeamMemberMethod.REPLACE || method === ManageTeamMemberMethod.DELETE) &&
              ((memberToManage && categories[role].length === 1) || (!hideBottomSection && isServer) ? (
                <>
                  <ManageTeamMembersSingleContactTable tableData={memberToManage} />
                  <input type="hidden" defaultValue={pclId} {...register("pclId")} />
                </>
              ) : (
                <>
                  <Fieldset>
                    <FormGroup hasError={!!getFieldState("pclId").error}>
                      <Label htmlFor="pclId">
                        {getContent(x => x.projectLabels[role]({ count: categories[role].length }))}
                      </Label>
                      <ValidationError error={getFieldState("pclId").error} />
                      <DropdownSelect
                        options={categories[role].map(x => ({ id: x.pclId, value: x.pcl.name }))}
                        defaultValue={defaults?.pclId}
                        hasEmptyOption
                        placeholder={getContent(
                          x => x.pages.manageTeamMembers.modify.messages[method][role].pclSelectPlaceholder,
                        )}
                        {...register("pclId", {
                          setValueAs(newPclId: ProjectContactLinkId) {
                            // When the member has been switched between, change the address in the address bar
                            // to match the PCL that has been selected
                            switch (method) {
                              case ManageTeamMemberMethod.REPLACE:
                                navigate(
                                  routes.manageTeamMembersReplaceRoute.getLink({ projectId, pclId: newPclId, role })
                                    .path,
                                  {
                                    replace: true,
                                  },
                                );
                                break;
                              case ManageTeamMemberMethod.DELETE:
                                navigate(
                                  routes.manageTeamMembersDeleteRoute.getLink({ projectId, pclId: newPclId, role })
                                    .path,
                                  {
                                    replace: true,
                                  },
                                );
                                break;
                            }

                            return newPclId;
                          },
                        })}
                      />
                    </FormGroup>
                  </Fieldset>
                  <Fieldset>
                    {hideBottomSection && (
                      <div className="govuk-button-group">
                        {isClient ? (
                          <Button type="submit" styling="Primary" disabled>
                            {getContent(x => x.pages.manageTeamMembers.modify.messages[method][role].apply)}
                          </Button>
                        ) : (
                          <Button type="submit" styling="Secondary">
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
              ))}
          </form>

          {!hideBottomSection && (
            <Form onSubmit={handleSubmit(x => onUpdate({ data: x }))}>
              <input type="hidden" value={method} {...register("form")} />
              <input type="hidden" value={projectId} {...register("projectId")} />
              <input type="hidden" name="pclId" value={pclId} />
              {method !== ManageTeamMemberMethod.DELETE && (
                <Section
                  title={
                    method === ManageTeamMemberMethod.REPLACE
                      ? getContent(x => x.pages.manageTeamMembers.modify.messages[method][role].heading)
                      : undefined
                  }
                  subtitle={
                    method === ManageTeamMemberMethod.REPLACE
                      ? getContent(x => x.pages.manageTeamMembers.modify.messages[method][role].subheading)
                      : undefined
                  }
                >
                  <Fieldset>
                    <FormGroup hasError={!!getFieldState("firstName").error}>
                      <Label htmlFor="firstName">
                        {getContent(x => x.pages.manageTeamMembers.modify.labels.firstName)}
                      </Label>
                      <ValidationError error={getFieldState("firstName").error} />
                      <TextInput inputWidth="one-third" defaultValue={defaults?.firstName} {...register("firstName")} />
                    </FormGroup>
                  </Fieldset>

                  <Fieldset>
                    <FormGroup hasError={!!getFieldState("lastName").error}>
                      <Label htmlFor="lastName">
                        {getContent(x => x.pages.manageTeamMembers.modify.labels.lastName)}
                      </Label>
                      <ValidationError error={getFieldState("lastName").error} />
                      <TextInput inputWidth="one-third" defaultValue={defaults.lastName} {...register("lastName")} />
                    </FormGroup>
                  </Fieldset>

                  <Fieldset>
                    <FormGroup hasError={!!getFieldState("partnerId").error}>
                      <Label htmlFor="partnerId">
                        {getContent(x => x.pages.manageTeamMembers.modify.labels.organisation)}
                      </Label>
                      <ValidationError error={getFieldState("partnerId").error} />
                      {method === ManageTeamMemberMethod.CREATE ? (
                        <DropdownSelect
                          options={partners.map(x => ({ id: x.id, value: x.name }))}
                          {...register("partnerId")}
                        />
                      ) : (
                        <Hint id="hint-for-partnerId">
                          {memberToManage?.partner.name ||
                            getContent(x => x.pages.manageTeamMembers.modify.labels.noneProvided)}
                        </Hint>
                      )}
                    </FormGroup>
                  </Fieldset>

                  <Fieldset>
                    <FormGroup hasError={!!getFieldState("email").error}>
                      <Label htmlFor="email">{getContent(x => x.pages.manageTeamMembers.modify.labels.email)}</Label>
                      <ValidationError error={getFieldState("email").error} />
                      {method === ManageTeamMemberMethod.CREATE || method === ManageTeamMemberMethod.REPLACE ? (
                        <TextInput inputWidth="one-half" defaultValue={defaults?.email} {...register("email")} />
                      ) : (
                        <Hint id="hint-for-email">
                          {memberToManage?.pcl?.email ||
                            getContent(x => x.pages.manageTeamMembers.modify.labels.noneProvided)}
                        </Hint>
                      )}
                    </FormGroup>

                    {!(method === ManageTeamMemberMethod.CREATE || method === ManageTeamMemberMethod.REPLACE) && (
                      <div className="govuk-!-padding-bottom-9">
                        <Content markdown value={x => x.pages.manageTeamMembers.modify.labels.changeEmail} />
                      </div>
                    )}
                  </Fieldset>
                </Section>
              )}

              <Fieldset>
                <div className="govuk-button-group">
                  <Button type="submit" styling={method !== ManageTeamMemberMethod.DELETE ? "Primary" : "Warning"}>
                    {getContent(x => x.pages.manageTeamMembers.modify.messages[method][role].apply)}
                  </Button>
                  <Link styling="Link" route={backRoute}>
                    {getContent(x => x.pages.manageTeamMembers.modify.labels.cancel)}
                  </Link>
                </div>
              </Fieldset>
            </Form>
          )}
        </>
      )}
    </Page>
  );
};

export { BaseManageTeamMember };
