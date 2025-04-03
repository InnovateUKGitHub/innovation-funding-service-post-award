import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/atoms/Button/Button";
import { getDay, getMonth, getYear } from "@ui/components/atoms/Date";
import { DateInput } from "@ui/components/atoms/DateInputs/DateInput";
import { DateInputGroup } from "@ui/components/atoms/DateInputs/DateInputGroup";
import { BackLink } from "@ui/components/atoms/Links/links";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { TBody, TCaption, TD, TH, THead, TR, Table } from "@ui/components/atoms/table/tableComponents";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/context/routesProvider";
import { contactSchemaErrorMap } from "@ui/zod/contactSchema.zod";
import { useMemo } from "react";
import { UseFormGetFieldState, UseFormRegister, useForm } from "react-hook-form";
import { z } from "zod";
import { useContactSetupAssociatePageData, useOnContactSetupAssociateSubmit } from "./ContactSetupAssociate.logic";
import type { ContactSetupAssociateParams } from "./ContactSetupAssociate.logic";
import { ContactSetupAssociateSchemaType, contactSetupAssociateSchema } from "./ContactSetupAssociate.zod";
import { FormTypes } from "@ui/zod/FormTypes";

const ContactDateInput = ({
  contact,
  getFieldState,
  register,
  index,
  disabled,
  id,
  field,
}: {
  contact: Pick<ProjectContactDto, "id" | "associateStartDate" | "associateEndDate">;
  register: UseFormRegister<z.input<ContactSetupAssociateSchemaType>>;
  getFieldState: UseFormGetFieldState<z.input<ContactSetupAssociateSchemaType>>;
  index: number;
  disabled?: boolean;
  id?: string;
  field: "associateStartDate" | "associateEndDate";
}) => {
  const defaults = useServerInput<z.input<ContactSetupAssociateSchemaType>>();

  const { defaultDay, defaultMonth, defaultYear } = useMemo(() => {
    const defaultDate = defaults?.contacts?.[index]?.[field];

    return {
      defaultDay: defaultDate && "day" in defaultDate ? defaultDate.day : getDay(contact[field]),
      defaultMonth: defaultDate && "month" in defaultDate ? defaultDate.month : getMonth(contact[field]),
      defaultYear: defaultDate && "year" in defaultDate ? defaultDate.year : getYear(contact[field]),
    };
  }, [defaults, index, contact, field]);

  return (
    <>
      <ValidationError error={getFieldState(`contacts.${index}.${field}`).error} />
      <DateInputGroup hasError={!!getFieldState(`contacts.${index}.${field}`).error} id={id}>
        <DateInput
          type="day"
          defaultValue={defaultDay}
          disabled={disabled}
          id={`contacts_${index}${field}`}
          {...register(`contacts.${index}.${field}.day`)}
        />
        <DateInput
          type="month"
          defaultValue={defaultMonth}
          disabled={disabled}
          id={`contacts_${index}${field}`}
          {...register(`contacts.${index}.${field}.month`)}
        />
        <DateInput
          type="year"
          defaultValue={defaultYear}
          disabled={disabled}
          id={`contacts_${index}${field}`}
          {...register(`contacts.${index}.${field}.year`)}
        />
      </DateInputGroup>
    </>
  );
};

const ContactSetupAssociatePage = (props: BaseProps & ContactSetupAssociateParams) => {
  const routes = useRoutes();
  const { getContent } = useContent();
  const { contacts, setFetchKey, fragmentRef } = useContactSetupAssociatePageData({
    projectId: props.projectId,
  });

  const { register, handleSubmit, setError, formState, getFieldState, watch, trigger } = useForm<
    z.input<ContactSetupAssociateSchemaType>
  >({
    resolver: zodResolver(contactSetupAssociateSchema, {
      errorMap: contactSchemaErrorMap,
    }),
  });

  const validationErrors = useZodErrors(setError, formState.errors);

  const { isProcessing, apiError, onUpdate } = useOnContactSetupAssociateSubmit({
    projectId: props.projectId,
    setFetchKey,
  });

  watch(() => {
    if (formState.isSubmitted) {
      trigger();
    }
  });

  return (
    <Page
      heading={getContent(x => x.pages.projectSetupAssociate.title)}
      apiError={apiError}
      backLink={
        <BackLink route={routes.projectDashboard.getLink({})}>
          {getContent(x => x.pages.projectsDashboard.backLink)}
        </BackLink>
      }
      validationErrors={validationErrors}
      fragmentRef={fragmentRef}
    >
      {contacts.length !== 0 && <P>{getContent(x => x.pages.projectSetupAssociate.guidanceMessage)}</P>}

      <Form
        onSubmit={handleSubmit(data => {
          onUpdate({ data: data as unknown as z.output<ContactSetupAssociateSchemaType> });
        })}
      >
        <input type="hidden" value={FormTypes.ProjectSetupContactAssociate} {...register("form")} />
        <input type="hidden" value={props.projectId} {...register("projectId")} />
        {contacts.length === 1 && (
          <>
            <input type="hidden" value={contacts[0].id} {...register(`contacts.0.id`)} />
            <SummaryList>
              <SummaryListItem label={getContent(x => x.pages.projectSetupAssociate.name)} content={contacts[0].name} />
              <SummaryListItem
                label={getContent(x => x.pages.projectSetupAssociate.role)}
                content={getContent(x => x.pages.projectSetupAssociate.associate)}
              />
              <SummaryListItem
                label={getContent(x => x.pages.projectSetupAssociate.email)}
                content={contacts[0].email}
              />
            </SummaryList>
            <Fieldset>
              <FormGroup hasError={!!getFieldState("contacts.0.associateStartDate").error}>
                <Label htmlFor="start_date" bold>
                  {getContent(x => x.pages.projectSetupAssociate.startDate)}
                </Label>
                <ContactDateInput
                  disabled={isProcessing}
                  contact={contacts[0]}
                  register={register}
                  getFieldState={getFieldState}
                  index={0}
                  field="associateStartDate"
                  id="start_date"
                />
              </FormGroup>
            </Fieldset>
            <Fieldset>
              <FormGroup hasError={!!getFieldState("contacts.0.associateEndDate").error}>
                <Label htmlFor="end_date" bold>
                  {getContent(x => x.pages.projectSetupAssociate.endDate)}
                </Label>
                <ContactDateInput
                  disabled={isProcessing}
                  contact={contacts[0]}
                  register={register}
                  getFieldState={getFieldState}
                  index={0}
                  field="associateEndDate"
                  id="end_date"
                />
              </FormGroup>
            </Fieldset>
          </>
        )}
        {contacts.length >= 2 && (
          <Table>
            <TCaption hidden>{getContent(x => x.pages.projectSetupAssociate.tableCaption)}</TCaption>
            <THead>
              <TR>
                <TH>{getContent(x => x.pages.projectSetupAssociate.name)}</TH>
                <TH>{getContent(x => x.pages.projectSetupAssociate.role)}</TH>
                <TH>{getContent(x => x.pages.projectSetupAssociate.email)}</TH>
                <TH>{getContent(x => x.pages.projectSetupAssociate.startDate)}</TH>
                <TH>{getContent(x => x.pages.projectSetupAssociate.endDate)}</TH>
              </TR>
            </THead>
            <TBody>
              {contacts.map((contact, i) => (
                <TR key={contact.id}>
                  <TD>{contact.name}</TD>
                  <TD>{getContent(x => x.pages.projectSetupAssociate.associate)}</TD>
                  <TD>{contact.email}</TD>
                  <TD>
                    <input type="hidden" value={contact.id} {...register(`contacts.${i}.id`)} />
                    <Fieldset>
                      <FormGroup hasError={!!getFieldState(`contacts.${i}.associateStartDate`).error} noMarginBottom>
                        <ContactDateInput
                          disabled={isProcessing}
                          contact={contact}
                          register={register}
                          getFieldState={getFieldState}
                          index={i}
                          field="associateStartDate"
                          aria-label={`enter start date for ${contact.name}`}
                        />
                      </FormGroup>
                    </Fieldset>
                  </TD>
                  <TD>
                    <Fieldset>
                      <FormGroup hasError={!!getFieldState(`contacts.${i}.associateEndDate`).error} noMarginBottom>
                        <ContactDateInput
                          disabled={isProcessing}
                          contact={contact}
                          register={register}
                          getFieldState={getFieldState}
                          index={i}
                          field="associateEndDate"
                          aria-label={`enter end date for ${contact.name}`}
                        />
                      </FormGroup>
                    </Fieldset>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
        <Button type="submit" styling="Primary" disabled={isProcessing}>
          {getContent(x => x.pages.projectSetupAssociate.saveAndReturn)}
        </Button>
      </Form>
    </Page>
  );
};

const ContactSetupAssociateRoute = defineRoute({
  routeName: "ContactSetupAssociate",
  routePath: "/projects/:projectId/setup/associate",
  container: ContactSetupAssociatePage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectSetupAssociate.title),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRolePermissionBits.ProjectManager),
});

export { ContactSetupAssociatePage, ContactSetupAssociateParams, ContactSetupAssociateRoute };
