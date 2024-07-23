import { useServerInput, useZodErrors } from "@framework/api-helpers/useZodErrors";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Checkbox, CheckboxList } from "@ui/components/atomicDesign/atoms/form/Checkbox/Checkbox";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { FormTypes } from "@ui/zod/FormTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { PcrPage } from "../../pcrPage";
import { useGrantMessage } from "./FinancialVirementsSummary.logic";
import {
  FinancialVirementsSummaryValidatorSchema,
  financialVirementsSummaryErrorMap,
  getFinancialVirementsSummaryValidator,
} from "./FinancialVirementsSummary.zod";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { useContent } from "@ui/hooks/content.hook";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { EmailContent } from "@ui/components/atomicDesign/atoms/EmailContent/emailContent";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { useRoutes } from "@ui/context/routesProvider";
import { useMapFinancialVirements } from "../../utils/useMapFinancialVirements";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { FinancialVirementsViewTable } from "./FinancialVirementsViewTable";
import { usePcrFinancialVirementData } from "../PcrFinancialVirement.logic";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { parseCurrency } from "@framework/util/numberHelper";

export const FinancialVirementSummary = () => {
  const { getContent } = useContent();
  const routes = useRoutes();

  const { projectId, pcrId, itemId, onSave, isFetching, mode, fetchKey } = usePcrWorkflowContext();
  const { project, partners, pcrItem, financialVirementsForCosts, financialVirementsForParticipants } =
    usePcrFinancialVirementData({ projectId, pcrId, itemId, fetchKey });

  const { virementData, virementMeta, isSummaryValid } = useMapFinancialVirements({
    financialVirementsForCosts,
    financialVirementsForParticipants,
    partners,
    pcrItemId: itemId,
  });
  const defaults = useServerInput<z.output<FinancialVirementsSummaryValidatorSchema>>();

  const { register, formState, handleSubmit, setError, getFieldState } = useForm<
    z.output<FinancialVirementsSummaryValidatorSchema>
  >({
    resolver: zodResolver(
      getFinancialVirementsSummaryValidator({
        mapFinancialVirementProps: {
          financialVirementsForCosts,
          financialVirementsForParticipants,
          partners,
          pcrItemId: itemId,
        },
      }),
      { errorMap: financialVirementsSummaryErrorMap },
    ),
  });
  // Use server-side errors if they exist, or use client-side errors if JavaScript is enabled.
  const allErrors = useZodErrors<z.output<FinancialVirementsSummaryValidatorSchema>>(setError, formState.errors);

  const colClass = "acc-table__cell-right-border";

  const onSubmitUpdate = (dto: z.output<FinancialVirementsSummaryValidatorSchema>) => {
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
              <TH className={colClass}>{getContent(x => x.financialVirementLabels.partnerName)}</TH>
              <TH numeric>{getContent(x => x.financialVirementLabels.partnerOriginalEligibleCosts)}</TH>
              <TH numeric>{getContent(x => x.financialVirementLabels.partnerOriginalRemainingCosts)}</TH>
              <TH className={colClass} numeric>
                {getContent(x => x.financialVirementLabels.partnerOriginalRemainingGrant)}
              </TH>
              <TH numeric>{getContent(x => x.financialVirementLabels.partnerNewEligibleCosts)}</TH>
              <TH numeric>{getContent(x => x.financialVirementLabels.partnerNewRemainingCosts)}</TH>
              <TH numeric>{getContent(x => x.financialVirementLabels.partnerNewRemainingGrant)}</TH>
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
                    route={routes.pcrFinancialVirementEditCostCategoryLevel.getLink({
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
              <TH className={colClass}>{getContent(x => x.financialVirementLabels.projectTotals)}</TH>
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
                  <EmailContent
                    key="email"
                    value={x => x.pages.financialVirementSummary.nonFecGrantAdviceChangeEmail}
                  />,
                ]}
                value={x => x.pages.financialVirementSummary.nonFecGrantAdvice}
              />
            </P>
          ) : (
            <>
              <P>{getContent(x => x.pages.financialVirementSummary.grantAdvice)}</P>

              <Section qa="edit-partner-level">
                <Link
                  styling="SecondaryButton"
                  route={routes.pcrFinancialVirementEditPartnerLevel.getLink({
                    projectId,
                    pcrId,
                    itemId,
                  })}
                  disabled={isFetching}
                >
                  <Content value={x => x.pages.financialVirementSummary.linkChangeGrant} />
                </Link>
              </Section>
            </>
          )}
          <Form onSubmit={handleSubmit(onSubmitUpdate)} aria-disabled={isFetching}>
            <input type="hidden" value={FormTypes.PcrFinancialVirementsSummary} {...register("form")} />
            <input type="hidden" value={projectId} {...register("projectId")} />
            <input type="hidden" value={pcrId} {...register("pcrId")} />
            <input type="hidden" value={itemId} {...register("pcrItemId")} />

            <Fieldset>
              <Legend>{getContent(x => x.financialVirementLabels.grantMovingOverYear)}</Legend>
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
              label={x => x.pages.financialVirementSummary.headingYearEndGrantValue}
              content={<Currency value={pcrItem?.grantMovingOverFinancialYear} />}
            />
          </SummaryList>
        </Section>
      )}
    </PcrPage>
  );
};
