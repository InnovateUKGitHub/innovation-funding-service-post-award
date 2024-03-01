import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ProjectRole } from "@framework/constants/project";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { getDay, getMonth, getYear } from "@ui/components/atomicDesign/atoms/Date";
import { DateInput } from "@ui/components/atomicDesign/atoms/DateInputs/DateInput";
import { DateInputGroup } from "@ui/components/atomicDesign/atoms/DateInputs/DateInputGroup";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { TBody, TD, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/redux/routesProvider";
import { contactSchemaErrorMap } from "@ui/zod/contactSchema.zod";
import { useMemo } from "react";
import { UseFormGetFieldState, UseFormRegister, useForm } from "react-hook-form";
import { z } from "zod";
import {
  ContactSetupAssociateParams,
  useContactSetupAssociatePageData,
  useOnContactSetupAssociateSubmit,
} from "./ContactSetupAssociate.logic";
import { ContactSetupAssociateSchemaType, contactSetupAssociateSchema } from "./ContactSetupAssociate.zod";
import { FormTypes } from "@ui/zod/FormTypes";

const ContactDateInput = ({
  contact,
  getFieldState,
  register,
  index,
  disabled,
}: {
  contact: Pick<ProjectContactDto, "id" | "startDate">;
  register: UseFormRegister<z.input<ContactSetupAssociateSchemaType>>;
  getFieldState: UseFormGetFieldState<z.input<ContactSetupAssociateSchemaType>>;
  index: number;
  disabled?: boolean;
}) => {
  const defaults = useServerInput<z.input<ContactSetupAssociateSchemaType>>();

  const { defaultDay, defaultMonth, defaultYear } = useMemo(() => {
    const defaultDate = defaults?.contacts?.[index]?.startDate;

    return {
      defaultDay: defaultDate && "day" in defaultDate ? defaultDate.day : getDay(contact.startDate),
      defaultMonth: defaultDate && "month" in defaultDate ? defaultDate.month : getMonth(contact.startDate),
      defaultYear: defaultDate && "year" in defaultDate ? defaultDate.year : getYear(contact.startDate),
    };
  }, [defaults, index, contact.startDate]);

  return (
    <>
      <ValidationError error={getFieldState(`contacts.${index}`).error} />
      <input type="hidden" value={FormTypes.ProjectSetupContactAssociate} {...register("form")} />
      <input type="hidden" value={contact.id} {...register(`contacts.${index}.id`)} />
      <DateInputGroup hasError={!!getFieldState(`contacts.${index}`).error}>
        <DateInput
          type="day"
          defaultValue={defaultDay}
          disabled={disabled}
          id={`contacts_${index}_startDate_day`}
          {...register(`contacts.${index}.startDate.day`)}
        />
        <DateInput
          type="month"
          defaultValue={defaultMonth}
          disabled={disabled}
          id={`contacts_${index}_startDate_month`}
          {...register(`contacts.${index}.startDate.month`)}
        />
        <DateInput
          type="year"
          defaultValue={defaultYear}
          disabled={disabled}
          id={`contacts_${index}_startDate_year`}
          {...register(`contacts.${index}.startDate.year`)}
        />
      </DateInputGroup>
    </>
  );
};

const ContactSetupAssociatePage = (props: BaseProps & ContactSetupAssociateParams) => {
  const routes = useRoutes();
  const { getContent } = useContent();
  const { project, contacts, setFetchKey } = useContactSetupAssociatePageData({ projectId: props.projectId });

  const { register, handleSubmit, setError, formState, getFieldState } = useForm<
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

  return (
    <Page
      pageTitle={
        <Title
          heading={getContent(x => x.pages.projectSetupAssociate.title)}
          title={project.title}
          projectNumber={project.projectNumber}
        />
      }
      apiError={apiError}
      backLink={
        <BackLink route={routes.projectDashboard.getLink({})}>
          {getContent(x => x.pages.projectsDashboard.backLink)}
        </BackLink>
      }
      validationErrors={validationErrors}
    >
      {contacts.length !== 0 && <P>{getContent(x => x.pages.projectSetupAssociate.guidanceMessage)}</P>}

      <Form
        onSubmit={handleSubmit(data => {
          onUpdate({ data: data as unknown as z.output<ContactSetupAssociateSchemaType> });
        })}
      >
        <input type="hidden" value={props.projectId} {...register("projectId")} />
        {contacts.length === 1 && (
          <>
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
              <FormGroup hasError={!!getFieldState("contacts.0").error}>
                <Label htmlFor="date" bold>
                  {getContent(x => x.pages.projectSetupAssociate.startDate)}
                </Label>
                <ContactDateInput
                  disabled={isProcessing}
                  contact={contacts[0]}
                  register={register}
                  getFieldState={getFieldState}
                  index={0}
                />
              </FormGroup>
            </Fieldset>
          </>
        )}
        {contacts.length >= 2 && (
          <Table>
            <THead>
              <TR>
                <TH>{getContent(x => x.pages.projectSetupAssociate.name)}</TH>
                <TH>{getContent(x => x.pages.projectSetupAssociate.role)}</TH>
                <TH>{getContent(x => x.pages.projectSetupAssociate.email)}</TH>
                <TH>{getContent(x => x.pages.projectSetupAssociate.startDate)}</TH>
              </TR>
            </THead>
            <TBody>
              {contacts.map((contact, i) => (
                <TR key={contact.id}>
                  <TD>{contact.name}</TD>
                  <TD>{getContent(x => x.pages.projectSetupAssociate.associate)}</TD>
                  <TD>{contact.email}</TD>
                  <TD>
                    <FormGroup hasError={!!getFieldState(`contacts.${i}`).error} noMarginBottom>
                      <ContactDateInput contact={contact} register={register} getFieldState={getFieldState} index={i} />
                    </FormGroup>
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
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

export { ContactSetupAssociatePage, ContactSetupAssociateParams, ContactSetupAssociateRoute };
