import { useOnForecastSubmit } from "@framework/api-helpers/onForecastSubmit";
import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ProjectRole } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { zodResolver } from "@hookform/resolvers/zod";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { SubmitButton } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { NewForecastTableWithFragment } from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/NewForecastTable.withFragment";
import { useForecastTableFragment } from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/useForecastTableFragment";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/context/routesProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { ForecastTableSchemaType, getForecastTableValidation } from "@ui/zod/forecastTableValidation.zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useProjectSetupSpendProfileData } from "./projectSetupSpendProfile.logic";
import { Checkbox, CheckboxList } from "@ui/components/atomicDesign/atoms/form/Checkbox/Checkbox";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";

export interface ProjectSetupSpendProfileParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const ProjectSetupSpendProfilePage = ({ projectId, partnerId }: BaseProps & ProjectSetupSpendProfileParams) => {
  const { fragmentRef } = useProjectSetupSpendProfileData({
    projectId,
    partnerId,
  });
  const data = useForecastTableFragment({ fragmentRef, isProjectSetup: true });
  const { project, partner } = data;

  const defaults = useServerInput<z.output<ForecastTableSchemaType>>();
  const { isPm } = getAuthRoles(project.roles);

  const { errorMap, schema } = getForecastTableValidation(data);
  const { register, handleSubmit, control, formState, getFieldState, setError, trigger, watch } = useForm<
    z.output<ForecastTableSchemaType>
  >({
    resolver: zodResolver(schema, {
      errorMap,
    }),
    defaultValues: defaults ?? undefined,
  });
  const routes = useRoutes();
  const { getContent } = useContent();

  const { onUpdate, isFetching } = useOnForecastSubmit({ isPm });

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
      backLink={
        <BackLink
          route={routes.projectSetup.getLink({
            projectId,
            partnerId,
          })}
        >
          {getContent(x => x.pages.projectSetupSpendProfile.backLink)}
        </BackLink>
      }
      fragmentRef={fragmentRef}
    >
      <Form onSubmit={handleSubmit(onSubmitUpdate)}>
        <input {...register("form")} value={FormTypes.ProjectSetupForecast} type="hidden" />
        <input {...register("projectId")} value={projectId} type="hidden" />
        <input {...register("partnerId")} value={partnerId} type="hidden" />

        <Section>
          <P data-qa="guidance">{getContent(x => x.pages.projectSetupSpendProfile.guidanceMessage)}</P>
          {partner.overheadRate !== null && (
            <>
              <ValidationMessage messageType="info" message={getContent(x => x.pages.claimForecast.overheadsLocked)} />
              <P>{getContent(x => x.pages.claimForecast.overheadsCosts({ percentage: partner.overheadRate }))}</P>
            </>
          )}
          <NewForecastTableWithFragment
            control={control}
            trigger={trigger}
            getFieldState={getFieldState}
            disabled={isFetching}
            clientProfiles={watch("profile")}
            isProjectSetup
            partnerId={partnerId}
          />
        </Section>
        <Section>
          <Fieldset>
            <Legend>{getContent(x => x.pages.projectSetupSpendProfile.markAsComplete)}</Legend>
            <CheckboxList name="submit" register={register}>
              <Checkbox
                id="submit"
                disabled={isFetching}
                label={getContent(x => x.pages.projectSetupSpendProfile.readyToSubmitMessage)}
              />
            </CheckboxList>
          </Fieldset>
        </Section>
        <Section>
          <Fieldset>
            <SubmitButton disabled={isFetching}>
              {getContent(x => x.pages.projectSetupSpendProfile.submitButton)}
            </SubmitButton>
          </Fieldset>
        </Section>
      </Form>
    </Page>
  );
};

export const ProjectSetupSpendProfileRoute = defineRoute({
  routeName: "projectSetupSpendProfile",
  routePath: "/projects/:projectId/setup/:partnerId/projectSetupSpendProfile",
  container: ProjectSetupSpendProfilePage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectSetupSpendProfile.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
