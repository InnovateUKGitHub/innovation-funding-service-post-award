import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { PartnerStatus, BankDetailsTaskStatus, BankCheckStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { Content } from "@ui/components/molecules/Content/content";
import { List } from "@ui/components/atoms/List/list";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atoms/Links/links";
import { TaskListSection, Task, TaskStatus } from "@ui/components/molecules/TaskList/TaskList";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { useOnUpdateProjectSetup, useProjectSetupQuery } from "./projectSetup.logic";
import { useZodFormatToRhfErrors } from "@framework/util/errorHelpers";
import { projectSetupErrorMap, projectSetupSchema } from "./projectSetup.zod";
import { useContent } from "@ui/hooks/content.hook";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atoms/form/Button/Button";

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

const isPostcodeComplete = (postcode: string | null): TaskStatus => (postcode ? "Complete" : "To do");

const ProjectSetupPage = (props: ProjectSetupParams & BaseProps) => {
  const { getContent } = useContent();
  const { project, partner, fragmentRef } = useProjectSetupQuery(props.projectId, props.partnerId);

  const [validatorErrors, setValidatorZodErrors] = useZodFormatToRhfErrors();

  const { onUpdate, apiError, isFetching } = useOnUpdateProjectSetup(
    props.projectId,
    props.partnerId,
    partner,
    props.routes.projectDashboard.getLink({}).path,
  );

  return (
    <Page
      backLink={
        <BackLink route={props.routes.projectDashboard.getLink({})}>
          <Content value={x => x.pages.projectSetup.backLink} />
        </BackLink>
      }
      apiError={apiError}
      validationErrors={validatorErrors}
      fragmentRef={fragmentRef}
    >
      <Section qa="guidance">
        <P>{getContent(x => x.projectMessages.setupGuidance)}</P>
      </Section>

      <List qa="taskList">
        <TaskListSection title={x => x.taskList.giveUsInfoSectionTitle} qa="WhatDoYouWantToDo">
          <Task
            name={x => x.pages.projectSetup.setSpendProfile}
            status={partner.spendProfileStatusLabel as TaskStatus}
            route={props.routes.projectSetupSpendProfile.getLink({
              partnerId: props.partnerId,
              projectId: props.projectId,
            })}
            rhfError={validatorErrors?.spendProfileStatus as RhfError}
            disabled={isFetching}
          />

          <Task
            name={x => x.pages.projectSetup.provideBankDetails}
            status={partner.bankDetailsTaskStatusLabel as TaskStatus}
            route={getBankDetailsLink(partner, props.routes, props.projectId, props.partnerId)}
            rhfError={validatorErrors?.bankDetailsTaskStatus as RhfError}
            disabled={isFetching}
          />

          <Task
            name={x => x.pages.projectSetup.provideProjectLocation}
            status={isPostcodeComplete(partner.postcode)}
            route={props.routes.projectSetupPostcode.getLink({
              projectId: props.projectId,
              partnerId: props.partnerId,
            })}
            rhfError={validatorErrors?.postcode as RhfError}
            disabled={isFetching}
          />
        </TaskListSection>
      </List>

      <form
        data-qa="projectSetupForm"
        method="POST"
        onSubmit={e => {
          e.preventDefault();

          /*
           * First validate the partial partner dto to see if the necessary work has been completed
           */
          const result = projectSetupSchema.safeParse(
            {
              postcode: partner.postcode,
              bankDetailsTaskStatus: String(partner.bankDetailsTaskStatus),
              spendProfileStatus: String(partner.spendProfileStatus),
            },
            {
              errorMap: projectSetupErrorMap,
            },
          );

          /*
           * if validation is failed then convert from zod format to Rhf format and set in the state
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
      >
        <Fieldset>
          {project.projectSource === "Manual" ? (
            <Link route={props.routes.projectDashboard.getLink({})} styling="SecondaryButton" disabled={isFetching}>
              {getContent(x => x.pages.projectSetup.manualComplete)}
            </Link>
          ) : (
            <Button type="submit" disabled={isFetching}>
              {getContent(x => x.pages.projectSetup.complete)}
            </Button>
          )}
        </Fieldset>
      </form>
    </Page>
  );
};

const getBankDetailsLink = (
  partner: ProjectSetupPartnerDto,
  routes: BaseProps["routes"],
  projectId: ProjectId,
  partnerId: PartnerId,
) => {
  if (partner.bankDetailsTaskStatus === BankDetailsTaskStatus.Complete) {
    return null;
  }
  switch (partner.bankCheckStatus) {
    case BankCheckStatus.NotValidated: {
      return routes.projectSetupBankDetails.getLink({
        partnerId,
        projectId,
      });
    }
    case BankCheckStatus.ValidationFailed:
    case BankCheckStatus.VerificationFailed: {
      return routes.projectSetupBankStatement.getLink({
        partnerId,
        projectId,
      });
    }
    case BankCheckStatus.ValidationPassed: {
      return routes.projectSetupBankDetailsVerify.getLink({
        partnerId,
        projectId,
      });
    }
    case BankCheckStatus.VerificationPassed: {
      return null;
    }
    default:
      return null;
  }
};

export const ProjectSetupRoute = defineRoute<ProjectSetupParams>({
  routeName: "projectSetup",
  routePath: "/projects/:projectId/setup/:partnerId",
  getParams: r => ({ projectId: r.params.projectId as ProjectId, partnerId: r.params.partnerId as PartnerId }),
  container: ProjectSetupPage,
  accessControl: (auth, params) => auth.forProject(params.projectId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectSetup.title),
});
