import { ProjectRole } from "@framework/constants/project";
import { ProjectContactDto } from "@framework/dtos/projectContactDto";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { getDay, getMonth, getYear } from "@ui/components/atomicDesign/atoms/Date";
import { DateInput } from "@ui/components/atomicDesign/atoms/DateInputs/DateInput";
import { DateInputGroup } from "@ui/components/atomicDesign/atoms/DateInputs/DateInputGroup";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { TBody, TD, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useMemo } from "react";
import { UseFormRegister, useForm } from "react-hook-form";
import { z } from "zod";
import {
  ContactSetupAssociateParams,
  useContactSetupAssociatePageData,
  useOnContactSetupAssociateSubmit,
} from "./ContactSetupAssociate.logic";
import {
  ContactSetupAssociateSchemaType,
  contactSetupAssociateErrorMap,
  contactSetupAssociateSchema,
} from "./ContactSetupAssociate.zod";

const ContactDateInput = ({
  contact,
  register,
  disabled,
}: {
  contact: Pick<ProjectContactDto, "id" | "startDate">;
  register: UseFormRegister<z.input<ContactSetupAssociateSchemaType>>;
  disabled?: boolean;
}) => {
  const { defaultDay, defaultMonth, defaultYear } = useMemo(() => {
    return {
      defaultDay: getDay(contact.startDate),
      defaultMonth: getMonth(contact.startDate),
      defaultYear: getYear(contact.startDate),
    };
  }, [contact.startDate]);

  return (
    <DateInputGroup>
      <DateInput
        type="day"
        defaultValue={defaultDay}
        disabled={disabled}
        {...register(`contacts.${contact.id}.startDate.day`)}
      />
      <DateInput
        type="month"
        defaultValue={defaultMonth}
        disabled={disabled}
        {...register(`contacts.${contact.id}.startDate.month`)}
      />
      <DateInput
        type="year"
        defaultValue={defaultYear}
        disabled={disabled}
        {...register(`contacts.${contact.id}.startDate.year`)}
      />
    </DateInputGroup>
  );
};

const ContactSetupAssociatePage = (props: BaseProps & ContactSetupAssociateParams) => {
  const { project, contacts } = useContactSetupAssociatePageData({ projectId: props.projectId });

  const { register, handleSubmit } = useForm<z.input<ContactSetupAssociateSchemaType>>({
    resolver: zodResolver(contactSetupAssociateSchema, {
      errorMap: contactSetupAssociateErrorMap,
    }),
  });

  const { isProcessing, apiError, onUpdate } = useOnContactSetupAssociateSubmit({ projectId: props.projectId });

  return (
    <Page
      pageTitle={<Title heading="Associate start date" title={project.title} projectNumber={project.projectNumber} />}
      apiError={apiError}
    >
      <P>You need to provide an associate start date so we can complete this section of the project setup.</P>

      <Form
        onSubmit={handleSubmit(data => {
          onUpdate({ data: data as unknown as z.output<ContactSetupAssociateSchemaType> });
        })}
      >
        {contacts.length === 0 && <P>You have no contacts that require a start date to be setup with</P>}
        {contacts.length === 1 && (
          <>
            <SummaryList>
              <SummaryListItem label="Name" content={contacts[0].name} />
              <SummaryListItem label="Role" content="Associate" />
              <SummaryListItem label="Email address" content={contacts[0].email} />
            </SummaryList>
            <Fieldset>
              <FormGroup>
                <Label htmlFor="date" bold>
                  Start date
                </Label>
                <ContactDateInput disabled={isProcessing} contact={contacts[0]} register={register} />
              </FormGroup>
            </Fieldset>
          </>
        )}
        {contacts.length >= 2 && (
          <Table>
            <THead>
              <TR>
                <TH>Name</TH>
                <TH>Role</TH>
                <TH>Email address</TH>
                <TH>Start date</TH>
              </TR>
            </THead>
            <TBody>
              {contacts.map(contact => (
                <TR key={contact.id}>
                  <TD>{contact.name}</TD>
                  <TD>Associate</TD>
                  <TD>{contact.email}</TD>
                  <TD>
                    <ContactDateInput contact={contact} register={register} />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
        <Button type="submit" styling="Primary">
          Save and return to dashboard
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
  getTitle: () => ({ displayTitle: "stubtitle", htmlTitle: "stubtitle" }),
  accessControl: (auth, { projectId }) => auth.forProject(projectId).hasRole(ProjectRole.ProjectManager),
});

export { ContactSetupAssociatePage, ContactSetupAssociateParams, ContactSetupAssociateRoute };
