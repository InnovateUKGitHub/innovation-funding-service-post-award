import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/atoms/Button/Button";
import { FullDateTime } from "@ui/components/atoms/Date";
import { BackLink } from "@ui/components/atoms/Links/links";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { ForecastAgreedCostWarning } from "@ui/components/molecules/validation/AgreedCostWarning/AgreedCostWarning";
import { NewForecastTable } from "@ui/components/organisms/forecasts/ForecastTable/NewForecastTable";
import {
  useMapToForecastTableDto,
  useNewForecastTableData,
} from "@ui/components/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import {
  ClaimStatusGroup,
  getClaimStatusGroup,
} from "@ui/components/organisms/forecasts/ForecastTable/getForecastHeaderContent";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { useRoutes } from "@ui/context/routesProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOnUpdateForecast, useUpdateForecastData } from "./ForecastTile.logic";
import { forecastTileQuery } from "./ForecastTile.query";
import { FinalClaimMessage } from "./components/FinalClaimMessage";
import { ForecastClaimAdvice } from "./components/ForecastClaimAdvice";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { PartnerStatus } from "@framework/constants/partner";
import { forecastPageSchema, errorMap, ForecastPageSchema } from "./forecastPage.zod";
import { useEffect, useMemo } from "react";
import { ForecastTableUploadButton } from "@ui/components/organisms/forecasts/ForecastTable/ForecastTableUploadButton";

export interface UpdateForecastParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const UpdateForecastPage = ({ projectId, partnerId }: UpdateForecastParams & BaseProps) => {
  const [refreshedQueryOptions, refresh] = useRefreshQuery(forecastTileQuery, {
    projectId,
    partnerId,
  });
  const data = useUpdateForecastData({ projectId, partnerId, refreshedQueryOptions });
  const fragmentData = useNewForecastTableData({ fragmentRef: data.fragmentRef, isProjectSetup: false, partnerId });

  const defaults = useServerInput<z.output<ForecastPageSchema>>();

  const { isFc: isPartnerFc } = getAuthRoles(fragmentData.partner.roles);

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

  const { register, handleSubmit, watch, control, formState, getFieldState, setError, trigger, setValue, reset } =
    useForm<z.output<ForecastPageSchema>>({
      resolver: zodResolver(forecastPageSchema, {
        errorMap,
      }),
      defaultValues: {
        ...defaults,
        finalClaim,
        total: 0,
        totalGolCost: 0,
        form: FormTypes.ForecastTileForecast,
        initialProfile,
      },
    });
  const routes = useRoutes();
  const { getContent } = useContent();

  const tableData = useMapToForecastTableDto({ ...fragmentData, clientProfiles: watch("profile") });

  const totalRow = tableData.totalRow;

  const { onUpdate, isProcessing, apiError } = useOnUpdateForecast({
    projectId,
    partnerId,
    refresh,
  });

  useEffect(() => {
    setValue("total", totalRow.total);
    setValue("totalGolCost", totalRow.golCost);
  }, [totalRow.total, totalRow.golCost, setValue]);

  useFormRevalidate(watch, trigger);

  const finalClaimStatusGroup = tableData.finalClaim ? getClaimStatusGroup(tableData.finalClaim.status) : null;

  const showUpdateSection =
    data.project.isActive &&
    isPartnerFc &&
    !data.partner.isWithdrawn &&
    data.partner.partnerStatus !== PartnerStatus.OnHold;

  const disableUpdateSection =
    isProcessing ||
    finalClaimStatusGroup === ClaimStatusGroup.EDITABLE_CLAIMING ||
    finalClaimStatusGroup === ClaimStatusGroup.SUBMITTED_CLAIMING ||
    finalClaimStatusGroup === ClaimStatusGroup.CLAIMED;

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const validationErrors = useZodErrors<z.output<ForecastPageSchema>>(setError, formState.errors);

  return (
    <Page
      validationErrors={validationErrors}
      backLink={
        <BackLink route={routes.viewForecast.getLink({ projectId, partnerId })}>
          <Content value={x => x.pages.forecastsUpdate.backLink} />
        </BackLink>
      }
      apiError={apiError}
      fragmentRef={data.fragmentRef}
    >
      <ForecastClaimAdvice isFc={isPartnerFc} />
      <FinalClaimMessage
        isFc={isPartnerFc}
        projectId={projectId}
        partnerId={partnerId}
        finalClaim={tableData.finalClaim}
        finalClaimStatusGroup={finalClaimStatusGroup}
      />

      <Form
        onSubmit={handleSubmit(data =>
          onUpdate({
            data,
          }),
        )}
      >
        <input {...register("form")} value={FormTypes.ForecastTileForecast} type="hidden" />

        <Section title={data.partner.name} qa="partner-forecast">
          <ForecastAgreedCostWarning
            isFc={isPartnerFc}
            costCategories={tableData.costCategories
              .filter(x => x.greaterThanAllocatedCosts)
              .map(x => x.costCategoryName)}
          />
          {isPartnerFc && data.partner.newForecastNeeded && (
            <ValidationMessage
              qa="period-change-warning"
              messageType="info"
              message={x => x.forecastsMessages.warningPeriodChange}
            />
          )}
          {fragmentData.partner.overheadRate !== null && (
            <P>
              {getContent(x => x.pages.claimForecast.overheadsCosts({ percentage: fragmentData.partner.overheadRate }))}
            </P>
          )}
          <NewForecastTable<"update-forecast">
            tableData={tableData}
            control={control}
            getFieldState={getFieldState}
            disabled={isProcessing}
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
          {showUpdateSection && (
            <Fieldset>
              <Button type="submit" styling="Primary" disabled={disableUpdateSection}>
                {getContent(x => x.pages.forecastsUpdate.buttonSubmit)}
              </Button>
            </Fieldset>
          )}
        </Section>
      </Form>
      <ForecastTableUploadButton tableData={tableData} setValue={setValue} />
    </Page>
  );
};

export const UpdateForecastRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "updateForecast",
  routePath: "/projects/:projectId/claims/:partnerId/updateForecast",
  container: UpdateForecastPage,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.forecastsUpdate.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRolePermissionBits.FinancialContact),
});
