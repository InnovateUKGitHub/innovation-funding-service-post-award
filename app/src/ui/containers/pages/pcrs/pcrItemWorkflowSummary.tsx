import WithScrollToTopOnPropChange from "@ui/features/scroll-to-top-on-prop-change";
import { usePcrWorkflowContext } from "./pcrItemWorkflowMigrated";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { NavigationArrowsForPCRs } from "./navigationArrows.withFragment";
import { Link } from "@ui/components/atomicDesign/atoms/Links/links";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { Checkbox, CheckboxList } from "@ui/components/atomicDesign/atoms/form/Checkbox/Checkbox";
import { Button } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { PCRItemStatus, PCRItemType, PCRStepId } from "@framework/constants/pcrConstants";
import { PcrWorkflow } from "./pcrWorkflow";
import { FullPCRItemDto } from "@framework/dtos/pcrDtos";
import { BaseProps } from "@ui/containers/containerBase";
import { SummaryFormValues } from "./pcrItemWorkflowTypes";
import { useForm } from "react-hook-form";
import { useContent } from "@ui/hooks/content.hook";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";

export const SummarySection = () => {
  const { mode, workflow, routes, pcrItem } = usePcrWorkflowContext();
  const isPrepareMode = mode === "prepare";
  const isReviewing = mode === "review";
  const displayNavigationArrows = mode === "review" || mode === "view";
  const displayCompleteForm = isPrepareMode;
  const allowSubmit = true;

  /**
   * Will need to handle various features previously handled by PCRSummaryContext.
   * preferably the data for these should be obtained by the relevant Workflow Summary page rather than at
   * the global PCR summary stage
   *
   * features that may be relevant are `displayCompleteForm` and `allowSubmit`
   * @see `usePcrSummary` hook
   */

  return (
    <WithScrollToTopOnPropChange propToScrollOn={workflow?.getCurrentStepName()}>
      <Section qa="item-save-and-return">
        <Summary />
        {displayCompleteForm && <WorkflowItemForm allowSubmit={allowSubmit} />}

        {displayNavigationArrows && (
          <NavigationArrowsForPCRs currentItem={pcrItem} isReviewing={isReviewing} routes={routes} />
        )}
      </Section>
    </WithScrollToTopOnPropChange>
  );
};

const Summary = () => {
  const { pcrItem, itemId, workflow, projectId, pcrId, routes } = usePcrWorkflowContext();
  if (!pcrItem) throw new Error(`Cannot find pcrItem matching itemId ${itemId}`);

  const workflowSummary = workflow?.getMigratedSummary();

  if (!workflowSummary) return null;

  if (!workflowSummary.migratedSummaryRender) {
    throw new Error(`pcr item workflow for ${workflow.getCurrentStepName()} is missing a migratedStepRender method`);
  }
  return workflowSummary.migratedSummaryRender({
    getStepLink: stepName => getStepLink(workflow, stepName, routes, projectId, pcrId, itemId),
    getEditLink: stepName => <EditLink stepName={stepName} />,
    getViewLink: stepName => <ViewLink stepName={stepName} />,
  });
};

const ViewLink = ({ stepName }: { stepName: PCRStepId }) => {
  const { mode, workflow, routes, projectId, pcrId, itemId } = usePcrWorkflowContext();
  if (mode !== "review") return null;

  return (
    <Link replace route={getStepReviewLink(workflow, stepName, routes, projectId, pcrId, itemId)}>
      View
    </Link>
  );
};

const EditLink = ({ stepName }: { stepName: PCRStepId }) => {
  const { mode, workflow, routes, projectId, pcrId, itemId } = usePcrWorkflowContext();

  if (mode !== "prepare") return null;

  return (
    <Link replace route={getStepLink(workflow, stepName, routes, projectId, pcrId, itemId)}>
      Edit
    </Link>
  );
};

const getStepLink = (
  workflow: Pick<PcrWorkflow<Partial<FullPCRItemDto>, null>, "findStepNumberByName">,
  stepName: string,
  routes: BaseProps["routes"],
  projectId: ProjectId,
  pcrId: PcrId,
  itemId: PcrItemId,
) => {
  return routes.pcrPrepareItem.getLink({
    projectId,
    pcrId,
    itemId,
    step: workflow && workflow.findStepNumberByName(stepName),
  });
};

const getStepReviewLink = (
  workflow: Pick<PcrWorkflow<Partial<FullPCRItemDto>, null>, "findStepNumberByName">,
  stepName: string,
  routes: BaseProps["routes"],
  projectId: ProjectId,
  pcrId: PcrId,
  itemId: PcrItemId,
) => {
  return routes.pcrReviewItem.getLink({
    projectId,
    pcrId,
    itemId,
    step: workflow && workflow.findStepNumberByName(stepName),
  });
};

const WorkflowItemForm = ({ allowSubmit }: { allowSubmit: boolean }) => {
  const { itemId, onSave, pcrItem, isFetching, routes, projectId, pcrId } = usePcrWorkflowContext();
  if (!pcrItem) throw new Error(`Cannot find pcrItem matching itemId ${itemId}`);

  const { getContent } = useContent();

  const { register, handleSubmit } = useForm<SummaryFormValues>({
    defaultValues: {
      itemStatus: "",
      grantMovingOverFinancialYear: undefined,
    },
  });

  const canReallocatePcr = pcrItem.type === PCRItemType.MultiplePartnerFinancialVirement;

  return (
    <Form
      onSubmit={handleSubmit(data =>
        onSave({
          data: {
            status:
              data.itemStatus === "marked-as-complete"
                ? PCRItemStatus.Complete
                : pcrItem.status === PCRItemStatus.ToDo
                ? PCRItemStatus.Incomplete
                : pcrItem.status,
          },
          context: {
            link: routes.pcrPrepare.getLink({
              projectId,
              pcrId,
            }),
          },
        }),
      )}
    >
      {canReallocatePcr && (
        <Fieldset>
          <Hint id="hint-for-grantMovingOverFinancialYear">
            {getContent(x => x.pages.pcrWorkflowSummary.reallocateGrantHint)}
          </Hint>
          <NumberInput id="grantMovingOverFinancialYear" name="grantMovingOverFinancialYear" width={10} />
        </Fieldset>
      )}

      <Fieldset>
        <Legend>{getContent(x => x.pages.pcrWorkflowSummary.markAsCompleteLabel)}</Legend>
        <FormGroup>
          <CheckboxList name="itemStatus" register={register} disabled={isFetching}>
            <Checkbox id="marked-as-complete" label={getContent(x => x.pages.pcrWorkflowSummary.agreeToChangeLabel)} />
          </CheckboxList>
        </FormGroup>

        {allowSubmit && (
          <FormGroup>
            <Button type="submit" disabled={isFetching}>
              {getContent(x => x.pages.pcrWorkflowSummary.buttonSaveAndReturn)}
            </Button>
          </FormGroup>
        )}
      </Fieldset>
    </Form>
  );
};
