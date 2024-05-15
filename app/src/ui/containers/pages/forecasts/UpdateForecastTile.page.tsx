import { useOnForecastSubmit } from "@framework/api-helpers/onForecastSubmit";
import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { ProjectRole } from "@framework/constants/project";
import { getAuthRoles } from "@framework/types/authorisation";
import { useRefreshQuery } from "@gql/hooks/useRefreshQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { FullDateTime } from "@ui/components/atomicDesign/atoms/Date";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { ForecastAgreedCostWarning } from "@ui/components/atomicDesign/molecules/forecasts/ForecastAgreedCostWarning/ForecastAgreedCostWarning";
import { NewForecastTable } from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/NewForecastTable";
import {
  useMapToForecastTableDto,
  useNewForecastTableData,
} from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/NewForecastTable.logic";
import {
  ClaimStatusGroup,
  getClaimStatusGroup,
} from "@ui/components/atomicDesign/organisms/forecasts/ForecastTable/getForecastHeaderContent";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { useFormRevalidate } from "@ui/hooks/useFormRevalidate";
import { useRoutes } from "@ui/redux/routesProvider";
import { FormTypes } from "@ui/zod/FormTypes";
import { ForecastTableSchemaType, getForecastTableValidation } from "@ui/zod/forecastTableValidation.zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateForecastData } from "./ForecastTile.logic";
import { forecastTileQuery } from "./ForecastTile.query";
import { FinalClaimMessage } from "./components/FinalClaimMessage";
import { ForecastClaimAdvice } from "./components/ForecastClaimAdvice";

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
  const fragmentData = useNewForecastTableData({ fragmentRef: data.fragmentRef, isProjectSetup: false });

  const defaults = useServerInput<z.output<ForecastTableSchemaType>>();
  const { isPm, isFc } = getAuthRoles(fragmentData.project.roles);

  const { errorMap, schema } = getForecastTableValidation(fragmentData);
  const { register, handleSubmit, watch, control, formState, getFieldState, setError, trigger } = useForm<
    z.output<ForecastTableSchemaType>
  >({
    resolver: zodResolver(schema, {
      errorMap,
    }),
    defaultValues: defaults ?? undefined,
  });
  const routes = useRoutes();
  const { getContent } = useContent();

  const tableData = useMapToForecastTableDto({ ...fragmentData, clientProfiles: watch("profile") });

  const { onUpdate, isProcessing, apiError } = useOnForecastSubmit({
    isPm,
    async refresh() {
      await refresh();
    },
  });

  useFormRevalidate(watch, trigger);

  const finalClaimStatusGroup = tableData.finalClaim ? getClaimStatusGroup(tableData.finalClaim.status) : null;

  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const validationErrors = useZodErrors<z.output<ForecastTableSchemaType>>(setError, formState.errors);

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
      <ForecastClaimAdvice isFc={isFc} />
      <FinalClaimMessage
        isFc={isFc}
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
        <input {...register("projectId")} value={projectId} type="hidden" />
        <input {...register("partnerId")} value={partnerId} type="hidden" />
        <input {...register("submit")} value="false" type="hidden" />

        <Section title={data.partner.name} qa="partner-forecast">
          <ForecastAgreedCostWarning
            isFc={isFc}
            costCategories={tableData.costCategories
              .filter(x => x.greaterThanAllocatedCosts)
              .map(x => x.costCategoryName)}
          />
          {fragmentData.partner.overheadRate !== null && (
            <P>
              {getContent(x => x.pages.claimForecast.overheadsCosts({ percentage: fragmentData.partner.overheadRate }))}
            </P>
          )}
          <NewForecastTable
            tableData={tableData}
            control={control}
            getFieldState={getFieldState}
            disabled={isProcessing}
            trigger={trigger}
            isProjectSetup={false}
          />
          <P>
            {getContent(x => x.components.claimLastModified.message)}
            {": "}
            <FullDateTime
              value={fragmentData.partner.forecastLastModifiedDate}
              nullDisplay={getContent(x => x.components.claimLastModified.never)}
            />
          </P>
          <Fieldset>
            <Button
              type="submit"
              styling="Primary"
              disabled={
                isProcessing ||
                finalClaimStatusGroup === ClaimStatusGroup.EDITABLE_CLAIMING ||
                finalClaimStatusGroup === ClaimStatusGroup.SUBMITTED_CLAIMING ||
                finalClaimStatusGroup === ClaimStatusGroup.CLAIMED
              }
            >
              {getContent(x => x.pages.forecastsUpdate.buttonSubmit)}
            </Button>
          </Fieldset>
        </Section>
      </Form>
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
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
