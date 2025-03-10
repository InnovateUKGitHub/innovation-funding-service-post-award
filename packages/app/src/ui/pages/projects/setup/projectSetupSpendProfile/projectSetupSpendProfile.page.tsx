import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { BackLink } from "@ui/components/atoms/Links/links";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { SubmitButton } from "@ui/components/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { NewForecastTableWithFragment } from "@ui/components/organisms/forecasts/ForecastTable/NewForecastTable.withFragment";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/context/routesProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOnInitialForecastUpdate, useProjectSetupSpendProfileData } from "./projectSetupSpendProfile.logic";
import { Checkbox, CheckboxList } from "@ui/components/atoms/form/Checkbox/Checkbox";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { SpendProfileStatus } from "@framework/constants/partner";
import {
  useMapToForecastTableDto,
  useNewForecastTableData,
} from "@ui/components/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import { setupSpendProfileSchema, errorMap, SetupSpendProfileSchemaType } from "./projectSetupSpendProfile.zod";
import { useMemo } from "react";

export interface ProjectSetupSpendProfileParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const ProjectSetupSpendProfilePage = ({ projectId, partnerId }: BaseProps & ProjectSetupSpendProfileParams) => {
  const { fragmentRef, partnerPage } = useProjectSetupSpendProfileData({
    projectId,
    partnerId,
  });

  const data = useNewForecastTableData({ fragmentRef, isProjectSetup: true, partnerId });
  const { partner } = data;

  const defaults = useServerInput<z.output<SetupSpendProfileSchemaType>>();

  const mappedData = useMapToForecastTableDto(data);

  const initialProfile = useMemo(() => {
    return mappedData.costCategories.reduce((acc, cur) => {
      const profile = cur.profiles.reduce((acc2, cur2) => {
        return {
          ...acc2,
          [cur2.profileId]: String(cur2.value),
        };
      }, {});
      return { ...acc, ...profile };
    }, {});
  }, []);

  const costCategoryProfiles = mappedData.costCategories;

  const { register, handleSubmit, control, formState, getFieldState, setError, trigger, watch } = useForm<
    z.output<SetupSpendProfileSchemaType>
  >({
    resolver: zodResolver(setupSpendProfileSchema, {
      errorMap,
    }),
    defaultValues: { ...defaults, costCategoryProfiles, initialProfile },
  });
  const routes = useRoutes();
  const { getContent } = useContent();

  const { onUpdate, isFetching, apiError } = useOnInitialForecastUpdate({ projectId, partnerId });

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors<z.output<SetupSpendProfileSchemaType>>(setError, formState.errors);

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
      apiError={apiError}
    >
      <Form onSubmit={handleSubmit(data => onUpdate({ data }))}>
        <input {...register("form")} value={FormTypes.ProjectSetupForecast} type="hidden" />
        <Section>
          <P data-qa="guidance">{getContent(x => x.pages.projectSetupSpendProfile.guidanceMessage)}</P>
          {partner.overheadRate !== null && (
            <>
              <ValidationMessage messageType="info" message={getContent(x => x.pages.claimForecast.overheadsLocked)} />
              <P>{getContent(x => x.pages.claimForecast.overheadsCosts({ percentage: partner.overheadRate }))}</P>
            </>
          )}
          <NewForecastTableWithFragment<"project-setup-profile">
            control={control}
            trigger={trigger}
            getFieldState={getFieldState}
            disabled={isFetching}
            clientProfiles={watch("profile")}
            isProjectSetup
            partnerId={partnerId}
            caption={getContent(x => x.pages.projectSetupSpendProfile.caption)}
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
                defaultChecked={partnerPage?.spendProfileStatus === SpendProfileStatus.Complete}
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
    auth.forPartner(projectId, partnerId).hasRole(ProjectRolePermissionBits.FinancialContact),
});
