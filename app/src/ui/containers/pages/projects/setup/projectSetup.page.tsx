import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { PartnerStatus, BankDetailsTaskStatus, BankCheckStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { UL } from "@ui/components/atomicDesign/atoms/List/list";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { TaskListSection, Task, TaskStatus } from "@ui/components/atomicDesign/molecules/TaskList/TaskList";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { useOnUpdateProjectSetup, useProjectSetupQuery } from "./projectSetup.logic";
import { useZodFormatValidationErrors } from "@framework/util/errorHelpers";
import { Result } from "@ui/validation/result";
import { useMemo } from "react";
import { projectSetupSchema } from "./projectSetup.zod";

export interface ProjectSetupParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

type ProjectSetupPartnerDto = Pick<
  PartnerDto,
  | "id"
  | "partnerStatus"
  | "bankDetailsTaskStatus"
  | "bankCheckStatus"
  | "spendProfileStatusLabel"
  | "bankDetailsTaskStatusLabel"
  | "postcode"
>;

const Form = createTypedForm<ProjectSetupPartnerDto>();

const isPostcodeComplete = (postcode: string | null): TaskStatus => (postcode ? "Complete" : "To do");

const ProjectSetupPage = (props: ProjectSetupParams & BaseProps) => {
  const { project, partner } = useProjectSetupQuery(props.projectId, props.partnerId);

  const [validatorErrors, setValidatorZodErrors] = useZodFormatValidationErrors();

  const { onUpdate, apiError } = useOnUpdateProjectSetup(
    props.projectId,
    props.partnerId,
    partner,
    props.routes.projectDashboard.getLink({}).path,
  );

  const getBankDetailsLink = (partner: ProjectSetupPartnerDto) => {
    if (partner.bankDetailsTaskStatus === BankDetailsTaskStatus.Complete) {
      return null;
    }
    switch (partner.bankCheckStatus) {
      case BankCheckStatus.NotValidated: {
        return props.routes.projectSetupBankDetails.getLink({
          partnerId: props.partnerId,
          projectId: props.projectId,
        });
      }
      case BankCheckStatus.ValidationFailed:
      case BankCheckStatus.VerificationFailed: {
        return props.routes.projectSetupBankStatement.getLink({
          partnerId: props.partnerId,
          projectId: props.projectId,
        });
      }
      case BankCheckStatus.ValidationPassed: {
        return props.routes.projectSetupBankDetailsVerify.getLink({
          partnerId: props.partnerId,
          projectId: props.projectId,
        });
      }
      case BankCheckStatus.VerificationPassed: {
        return null;
      }
      default:
        return null;
    }
  };

  // this mapping is just for making it easier to pass into the Task items
  const mappedErrors: {
    postcode?: Result[] | undefined;
    spendProfileStatus?: Result[] | undefined;
    bankDetailsTaskStatus?: Result[] | undefined;
  } = useMemo(() => {
    if (validatorErrors && !validatorErrors?.isValid && validatorErrors?.results?.length) {
      return validatorErrors?.results.reduce((acc, cur) => ({ ...acc, [String(cur.keyId)]: [cur] }), {});
    }
    return { postcode: undefined, spendProfileStatus: undefined, bankDetailsTaskStatus: undefined };
  }, [validatorErrors]);

  return (
    <Page
      backLink={
        <BackLink route={props.routes.projectDashboard.getLink({})}>
          <Content value={x => x.pages.projectSetup.backLink} />
        </BackLink>
      }
      pageTitle={<Title title={project.title} projectNumber={project.projectNumber} />}
      error={apiError}
      validator={validatorErrors}
      projectStatus={project.status}
      partnerStatus={partner.partnerStatus}
    >
      <Section qa="guidance">
        <P>
          <Content value={x => x.projectMessages.setupGuidance} />
        </P>
      </Section>

      <UL qa="taskList">
        <TaskListSection title={x => x.taskList.giveUsInfoSectionTitle} qa="WhatDoYouWantToDo">
          <Task
            name={x => x.pages.projectSetup.setSpendProfile}
            status={partner.spendProfileStatusLabel as TaskStatus}
            route={props.routes.projectSetupSpendProfile.getLink({
              partnerId: partner.id,
              projectId: project.id,
            })}
            validation={mappedErrors?.spendProfileStatus}
          />

          <Task
            name={x => x.pages.projectSetup.provideBankDetails}
            status={partner.bankDetailsTaskStatusLabel as TaskStatus}
            route={getBankDetailsLink(partner)}
            validation={mappedErrors?.bankDetailsTaskStatus}
          />

          <Task
            name={x => x.pages.projectSetup.provideProjectLocation}
            status={isPostcodeComplete(partner.postcode)}
            route={props.routes.projectSetupPostcode.getLink({
              projectId: props.projectId,
              partnerId: props.partnerId,
            })}
            validation={mappedErrors?.postcode}
          />
        </TaskListSection>
      </UL>

      <Form.Form
        data={partner}
        onSubmit={() => {
          /*
           * First validate the partial partner dto to see if the necessary work has been completed
           */
          const result = projectSetupSchema.safeParse({
            postcode: partner.postcode,
            bankDetailsTaskStatus: String(partner.bankDetailsTaskStatus),
            spendProfileStatus: String(partner.spendProfileStatus),
          });

          /*
           * if validation is failed then convert from zod format to Results format and set in the state
           */
          if (!result?.success) {
            setValidatorZodErrors(result.error);
          } else {
            /*
             * if validation passed, proceed to update and move on
             */
            onUpdate({ data: { partnerStatus: PartnerStatus.Active } });
          }
        }}
        qa="projectSetupForm"
      >
        <Form.Fieldset>
          <Form.Submit>
            <Content value={x => x.pages.projectSetup.complete} />
          </Form.Submit>
        </Form.Fieldset>
      </Form.Form>
    </Page>
  );
};

export const ProjectSetupRoute = defineRoute<ProjectSetupParams>({
  routeName: "projectSetup",
  routePath: "/projects/:projectId/setup/:partnerId",
  getParams: r => ({ projectId: r.params.projectId as ProjectId, partnerId: r.params.partnerId as PartnerId }),
  container: ProjectSetupPage,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectSetup.title),
});
