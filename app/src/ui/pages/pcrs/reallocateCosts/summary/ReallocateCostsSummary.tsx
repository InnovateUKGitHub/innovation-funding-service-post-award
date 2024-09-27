import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Currency } from "@ui/components/atoms/Currency/currency";
import { Checkbox, CheckboxList } from "@ui/components/atoms/form/Checkbox/Checkbox";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atoms/table/tableComponents";
import { FormTypes } from "@ui/zod/FormTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { PcrPage } from "../../pcrPage";
import { useGrantMessage } from "./ReallocateCostsSummary.logic";
import {
  ReallocateCostsSummaryValidatorSchema,
  reallocateCostsSummaryErrorMap,
  getReallocateCostsSummaryValidator,
} from "./ReallocateCostsSummary.zod";
import { Section } from "@ui/components/molecules/Section/section";
import { useContent } from "@ui/hooks/content.hook";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Link } from "@ui/components/atoms/Links/links";
import { EmailContent } from "@ui/components/atoms/EmailContent/emailContent";
import { Content } from "@ui/components/molecules/Content/content";
import { useRoutes } from "@ui/context/routesProvider";
import { useMapFinancialVirements } from "../../utils/useMapFinancialVirements";
import { Button } from "@ui/components/atoms/Button/Button";
import { ValidationMessage } from "@ui/components/molecules/validation/ValidationMessage/ValidationMessage";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import { FinancialVirementsViewTable } from "./ReallocateCostsViewTable";
import { usePcrReallocateCostsData } from "../PcrReallocateCosts.logic";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { parseCurrency } from "@framework/util/numberHelper";

export const FinancialVirementSummary = () => {
  const { getContent } = useContent();
  const routes = useRoutes();

  const { projectId, pcrId, itemId, onSave, isFetching, mode, fetchKey } = usePcrWorkflowContext();
  const { project, partners, pcrItem, financialVirementsForCosts, financialVirementsForParticipants } =
    usePcrReallocateCostsData({ projectId, pcrId, itemId, fetchKey });

  const { virementData, virementMeta, isSummaryValid } = useMapFinancialVirements({
    financialVirementsForCosts,
    financialVirementsForParticipants,
    partners,
    pcrItemId: itemId,
  });
  const defaults = useServerInput<z.output<ReallocateCostsSummaryValidatorSchema>>();

  const { register, formState, handleSubmit, setError, getFieldState } = useForm<
    z.output<ReallocateCostsSummaryValidatorSchema>
  >({
    resolver: zodResolver(
      getReallocateCostsSummaryValidator({
        mapFinancialVirementProps: {
          financialVirementsForCosts,
          financialVirementsForParticipants,
          partners,
          pcrItemId: itemId,
        },
      }),
      { errorMap: reallocateCostsSummaryErrorMap },
    ),
  });
  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors<z.output<ReallocateCostsSummaryValidatorSchema>>(setError, formState.errors);

  const colClass = "acc-table__cell-right-border";

  const onSubmitUpdate = (dto: z.output<ReallocateCostsSummaryValidatorSchema>) => {
    onSave({
      data: {
        id: itemId,
        grantMovingOverFinancialYear: dto?.grantMovingOverFinancialYear
          ? parseCurrency(dto.grantMovingOverFinancialYear)
          : undefined,
        status: dto?.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
      },
      context: {
        link: routes.pcrPrepare.getLink({ projectId, pcrId }),
      },
    });
  };

  const grantMessage = useGrantMessage(virementMeta);
  const displayHighlight = !!grantMessage && (isSummaryValid ? "positive-hightlight" : "negative-hightlight");

  return (
    <PcrPage validationErrors={allErrors}>
      {grantMessage && (
        <ValidationMessage
          markdown
          message={grantMessage}
          messageType={virementMeta.hasAvailableGrant ? "info" : "error"}
        />
      )}

      {mode === "prepare" ? (
        <Table>
          <THead>
            <TR>
              <TH className={colClass}>{getContent(x => x.reallocateCostsLabels.partnerName)}</TH>
              <TH numeric>{getContent(x => x.reallocateCostsLabels.partnerOriginalEligibleCosts)}</TH>
              <TH numeric>{getContent(x => x.reallocateCostsLabels.partnerOriginalRemainingCosts)}</TH>
              <TH className={colClass} numeric>
                {getContent(x => x.reallocateCostsLabels.partnerOriginalRemainingGrant)}
              </TH>
              <TH numeric>{getContent(x => x.reallocateCostsLabels.partnerNewEligibleCosts)}</TH>
              <TH numeric>{getContent(x => x.reallocateCostsLabels.partnerNewRemainingCosts)}</TH>
              <TH numeric>{getContent(x => x.reallocateCostsLabels.partnerNewRemainingGrant)}</TH>
            </TR>
          </THead>
          <TBody>
            {virementData.partners.map(x => (
              <TR
                id={x.partnerId}
                key={x.virementParticipantId}
                hasError={!!allErrors?.partner && x.partnerId in allErrors.partner}
              >
                <TD className={colClass}>
                  <Link
                    route={routes.pcrReallocateCostsEditCostCategoryLevel.getLink({
                      projectId,
                      partnerId: x.partnerId,
                      itemId,
                      pcrId,
                    })}
                    disabled={isFetching}
                  >
                    {x.isLead ? getContent(y => y.partnerLabels.leadPartner({ name: x.name })) : x.name}
                  </Link>
                </TD>
                <TD numeric>
                  <Currency value={x.originalEligibleCosts} />
                </TD>
                <TD numeric>
                  <Currency value={x.originalRemainingCosts} />
                </TD>
                <TD className={colClass} numeric>
                  <Currency value={x.originalRemainingGrant} />
                </TD>
                <TD numeric>
                  <Currency value={x.newEligibleCosts} />
                </TD>
                <TD numeric>
                  <Currency value={x.newRemainingCosts} />
                </TD>
                <TD numeric>
                  <Currency value={x.newRemainingGrant} />
                </TD>
              </TR>
            ))}
          </TBody>
          <TFoot>
            <TR>
              <TH className={colClass}>{getContent(x => x.reallocateCostsLabels.projectTotals)}</TH>
              <TH numeric>
                <Currency value={virementData.originalEligibleCosts} />
              </TH>
              <TH numeric>
                <Currency value={virementData.originalRemainingCosts} />
              </TH>
              <TH className={colClass} numeric>
                <Currency
                  className={displayHighlight === "positive-hightlight" && "highlight--info"}
                  value={virementData.originalRemainingGrant}
                />
              </TH>
              <TH numeric>
                <Currency value={virementData.newEligibleCosts} />
              </TH>
              <TH numeric>
                <Currency value={virementData.newRemainingCosts} />
              </TH>
              <TH numeric>
                <Currency
                  className={displayHighlight === "negative-hightlight" && "highlight--error"}
                  value={virementData.newRemainingGrant}
                />
              </TH>
            </TR>
          </TFoot>
        </Table>
      ) : (
        <FinancialVirementsViewTable
          virementData={virementData}
          projectId={projectId}
          pcrId={pcrId}
          itemId={itemId}
          mode={mode}
        />
      )}

      {mode === "prepare" && (
        <>
          {partners.length > 1 && project.isNonFec ? (
            <P>
              <Content
                components={[
                  <EmailContent key="email" value={x => x.pages.reallocateCostsSummary.nonFecGrantAdviceChangeEmail} />,
                ]}
                value={x => x.pages.reallocateCostsSummary.nonFecGrantAdvice}
              />
            </P>
          ) : (
            <>
              <P>{getContent(x => x.pages.reallocateCostsSummary.grantAdvice)}</P>

              <Section qa="edit-partner-level">
                <Link
                  styling="SecondaryButton"
                  route={routes.pcrReallocateCostsEditPartnerLevel.getLink({
                    projectId,
                    pcrId,
                    itemId,
                  })}
                  disabled={isFetching}
                >
                  <Content value={x => x.pages.reallocateCostsSummary.linkChangeGrant} />
                </Link>
              </Section>
            </>
          )}
          <Form onSubmit={handleSubmit(onSubmitUpdate)} aria-disabled={isFetching}>
            <input type="hidden" value={FormTypes.PcrReallocateCostsSummary} {...register("form")} />
            <input type="hidden" value={projectId} {...register("projectId")} />
            <input type="hidden" value={pcrId} {...register("pcrId")} />
            <input type="hidden" value={itemId} {...register("pcrItemId")} />

            <Fieldset>
              <Legend>{getContent(x => x.reallocateCostsLabels.grantMovingOverYear)}</Legend>
              <Hint id="hint-for-grantMovingOverFinancialYear">
                {getContent(x => x.pages.pcrWorkflowSummary.reallocateGrantHint)}
              </Hint>
              <FormGroup hasError={!!getFieldState("grantMovingOverFinancialYear").error}>
                <ValidationError error={getFieldState("grantMovingOverFinancialYear").error} />
                <TextInput
                  {...register("grantMovingOverFinancialYear")}
                  defaultValue={
                    defaults?.grantMovingOverFinancialYear ?? pcrItem?.grantMovingOverFinancialYear ?? undefined
                  }
                  id="grantMovingOverFinancialYear"
                  inputWidth={10}
                  disabled={isFetching}
                  numeric
                  prefix={getContent(x => x.forms.prefix.gbp)}
                />
              </FormGroup>
            </Fieldset>

            <Fieldset>
              <Legend>{getContent(x => x.pages.pcrWorkflowSummary.markAsCompleteLabel)}</Legend>
              <FormGroup>
                <CheckboxList name="markedAsComplete" register={register}>
                  <Checkbox
                    defaultChecked={defaults?.markedAsComplete ?? pcrItem?.status === PCRItemStatus.Complete}
                    label={getContent(x => x.pages.pcrWorkflowSummary.agreeToChangeLabel)}
                    id="submit"
                    disabled={isFetching}
                  />
                </CheckboxList>
              </FormGroup>
            </Fieldset>

            <Fieldset>
              <Button styling="Primary" type="submit" disabled={isFetching}>
                {getContent(x => x.pages.pcrWorkflowSummary.buttonSaveAndReturn)}
              </Button>
            </Fieldset>
          </Form>
        </>
      )}

      {mode !== "prepare" && (
        <Section>
          <SummaryList qa="pcr_financial-virement">
            <SummaryListItem
              qa="grantValueYearEnd"
              label={x => x.pages.reallocateCostsSummary.headingYearEndGrantValue}
              content={<Currency value={pcrItem?.grantMovingOverFinancialYear} />}
            />
          </SummaryList>
        </Section>
      )}
    </PcrPage>
  );
};
