import { ProjectRole } from "@framework/constants/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { FullDateTime } from "@ui/components/atomicDesign/atoms/Date";
import { SubmitButton } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { ForecastTable } from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/ForecastTable";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/redux/routesProvider";
import { ForecastTableSchemaType, getForecastTableValidation } from "@ui/zod/forecastTableValidation.zod";
import { useForm } from "react-hook-form";
import { useClaimForecastData } from "./ClaimForecast.logic";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { useOnForecastSubmit } from "@framework/api-helpers/onForecastSubmit";
import { ForecastAgreedCostWarning } from "@ui/components/atomicDesign/molecules/forecasts/ForecastAgreedCostWarning/ForecastAgreedCostWarning";
import { useMapToForecastTableDto } from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/useMapToForecastTableDto";
import { useZodErrors, useServerInput } from "@framework/api-helpers/useZodErrors";

export interface ClaimForecastParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

const ClaimForecastContainer = ({ projectId, partnerId, periodId }: BaseProps & ClaimForecastParams) => {
  const data = useClaimForecastData({
    projectId,
    projectParticipantId: partnerId,
  });
  const { project } = data;

  const defaults = useServerInput<z.output<ForecastTableSchemaType>>();

  const { errorMap, schema } = getForecastTableValidation(data);
  const { register, handleSubmit, watch, control, formState, getFieldState, setValue, setError } = useForm<
    z.output<ForecastTableSchemaType>
  >({
    resolver: zodResolver(schema, {
      errorMap,
    }),
    defaultValues: defaults ?? undefined,
  });
  const routes = useRoutes();
  const { getContent } = useContent();

  const tableData = useMapToForecastTableDto({ ...data, clientProfiles: watch("profile") });

  const { onUpdate, isFetching } = useOnForecastSubmit({ periodId });

  const onSubmitUpdate = (dto: z.output<ForecastTableSchemaType>) => {
    onUpdate({
      data: dto,
    });
  };

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors<z.output<ForecastTableSchemaType>>(setError, formState.errors);

  return (
    <Page
      validationErrors={allErrors}
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      backLink={
        <BackLink route={routes.claimDocuments.getLink({ projectId, partnerId, periodId })}>
          {getContent(x => x.pages.claimForecast.backLink)}
        </BackLink>
      }
    >
      <Form onSubmit={handleSubmit(onSubmitUpdate)}>
        <input {...register("projectId")} value={projectId} type="hidden" />
        <input {...register("partnerId")} value={partnerId} type="hidden" />

        <Section>
          {periodId < project.numberOfPeriods && (
            <ValidationMessage
              messageType="info"
              message={getContent(x => x.claimsMessages.lastChanceToChangeForecast({ periodId }))}
            />
          )}
          <ForecastAgreedCostWarning
            isFc={project.roles.isFc}
            costCategories={tableData.costCategories.filter(x => x.difference > 0).map(x => x.costCategoryName)}
          />
          <ForecastTable tableData={tableData} control={control} getFieldState={getFieldState} disabled={isFetching} />
          <P>
            {getContent(x => x.components.claimLastModified.message)}
            {": "}
            <FullDateTime
              value={data.partner.forecastLastModifiedDate}
              nullDisplay={getContent(x => x.components.claimLastModified.never)}
            />
          </P>
        </Section>
        <Fieldset>
          <SubmitButton
            onClick={() => setValue("form", FormTypes.ClaimForecastSaveAndContinue)}
            name="form"
            value={FormTypes.ClaimForecastSaveAndContinue}
            disabled={isFetching}
          >
            Continue to summary
          </SubmitButton>
          <SubmitButton
            onClick={() => setValue("form", FormTypes.ClaimForecastSaveAndQuit)}
            secondary
            name="form"
            value={FormTypes.ClaimForecastSaveAndQuit}
            disabled={isFetching}
          >
            Save and return to claims
          </SubmitButton>
        </Fieldset>
      </Form>
    </Page>
  );
};

export const ClaimForecastRoute = defineRoute({
  routeName: "claimForecast",
  routePath: "/projects/:projectId/claims/:partnerId/forecast/:periodId",
  container: ClaimForecastContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId, 10) as PeriodId,
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: () => ({
    htmlTitle: "Update forecast",
    displayTitle: "Update forecast",
  }),
});
