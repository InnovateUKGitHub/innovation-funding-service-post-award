import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FullDateTime } from "@ui/components/atoms/Date";
import { BackLink } from "@ui/components/atoms/Links/links";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { SubmitButton } from "@ui/components/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { ForecastAgreedCostWarning } from "@ui/components/molecules/validation/AgreedCostWarning/AgreedCostWarning";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { NewForecastTable } from "@ui/components/organisms/forecasts/ForecastTable/NewForecastTable";
import {
  useMapToForecastTableDto,
  useNewForecastTableData,
} from "@ui/components/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { useRoutes } from "@ui/context/routesProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useClaimForecastData, useOnClaimForecastUpdate } from "./ClaimForecast.logic";
import { errorMap, claimForecastSchema, ClaimForecastSchemaType } from "./ClaimForecast.zod";
import {
  ClaimStatusGroup,
  getClaimStatusGroup,
} from "@ui/components/organisms/forecasts/ForecastTable/getForecastHeaderContent";
import { useEffect, useMemo } from "react";

export interface ClaimForecastParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
}

const ClaimForecastPage = ({ projectId, partnerId, periodId }: BaseProps & ClaimForecastParams) => {
  const { fragmentRef } = useClaimForecastData({
    projectId,
    partnerId,
  });
  const fragmentData = useNewForecastTableData({ fragmentRef, isProjectSetup: false, partnerId });
  const { project, partner } = fragmentData;

  const defaults = useServerInput<z.output<ClaimForecastSchemaType>>();
  const { isPm, isFc } = getAuthRoles(project.roles);

  const nonForecastClaims = fragmentData.claimTotalProjectPeriods.filter(
    x => getClaimStatusGroup(x.status) !== ClaimStatusGroup.FORECAST,
  );

  const initialProfile = useMemo(
    () =>
      fragmentData.profileDetails.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.id]: String(cur.value),
        }),
        {},
      ),
    [],
  );

  const finalClaim = nonForecastClaims.find(claim => claim.isFinalClaim);

  const { register, handleSubmit, watch, control, formState, getFieldState, setValue, setError, trigger } = useForm<
    z.output<ClaimForecastSchemaType>
  >({
    resolver: zodResolver(claimForecastSchema, {
      errorMap,
    }),
    defaultValues: {
      ...defaults,
      finalClaim,
      total: 0,
      totalGolCost: 0,
      form: FormTypes.ClaimForecastSaveAndContinue,
      initialProfile,
    },
  });
  const routes = useRoutes();
  const { getContent } = useContent();

  const tableData = useMapToForecastTableDto({ ...fragmentData, clientProfiles: watch("profile") });
  const totalRow = tableData.totalRow;

  useEffect(() => {
    setValue("total", totalRow.total);
    setValue("totalGolCost", totalRow.golCost);
  }, [totalRow.total, totalRow.golCost, setValue]);

  const { onUpdate, isFetching, apiError } = useOnClaimForecastUpdate({ projectId, partnerId, periodId, isPm });

  useFormRevalidate(watch, trigger);

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors<z.output<ClaimForecastSchemaType>>(setError, formState.errors);

  return (
    <Page
      validationErrors={allErrors}
      backLink={
        <BackLink route={routes.claimDocuments.getLink({ projectId, partnerId, periodId })}>
          {getContent(x => x.pages.claimForecast.backLink)}
        </BackLink>
      }
      fragmentRef={fragmentRef}
      apiError={apiError}
    >
      <Form onSubmit={handleSubmit(data => onUpdate({ data }))}>
        <input {...register("submit")} value="false" type="hidden" />

        <Section>
          {periodId + 1 < project.numberOfPeriods && (
            <ValidationMessage
              messageType="info"
              message={getContent(x => x.claimsMessages.lastChanceToChangeForecast({ periodId: periodId + 1 }))}
            />
          )}
          <ForecastAgreedCostWarning
            isFc={isFc}
            costCategories={tableData.costCategories
              .filter(x => x.greaterThanAllocatedCosts)
              .map(x => x.costCategoryName)}
          />
          {partner.overheadRate !== null && (
            <P>{getContent(x => x.pages.claimForecast.overheadsCosts({ percentage: partner.overheadRate }))}</P>
          )}
          <NewForecastTable<"update-claim-forecast">
            tableData={tableData}
            control={control}
            getFieldState={getFieldState}
            disabled={isFetching}
            trigger={trigger}
            isProjectSetup={false}
            caption={getContent(x => x.components.forecastTable.caption)}
          />
          <P>
            {getContent(x => x.components.claimLastModified.message)}
            {": "}
            <FullDateTime
              value={fragmentData.partner.forecastLastModifiedDate}
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
            {getContent(x => x.pages.claimForecast.buttonContinueToSummary)}
          </SubmitButton>
          <SubmitButton
            onClick={() => setValue("form", FormTypes.ClaimForecastSaveAndQuit)}
            secondary
            name="form"
            value={FormTypes.ClaimForecastSaveAndQuit}
            disabled={isFetching}
          >
            {getContent(x => x.pages.claimForecast.buttonSaveAndReturn)}
          </SubmitButton>
        </Fieldset>
      </Form>
    </Page>
  );
};

export const ClaimForecastRoute = defineRoute({
  allowUnauthenticatedAccess: false,
  routeName: "claimForecast",
  routePath: "/projects/:projectId/claims/:partnerId/forecast/:periodId",
  container: ClaimForecastPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    periodId: parseInt(route.params.periodId, 10) as PeriodId,
  }),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRolePermissionBits.FinancialContact),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.claimForecast.title),
});
