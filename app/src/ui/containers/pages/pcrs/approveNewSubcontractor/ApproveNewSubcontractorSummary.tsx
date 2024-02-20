import { useZodErrors } from "@framework/api-helpers/useZodErrors";
import { PCRItemStatus, PCRStepType } from "@framework/constants/pcrConstants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SummaryList, SummaryListItem } from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";
import { useContent } from "@ui/hooks/content.hook";
import { FormTypes } from "@ui/zod/FormTypes";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PcrItemSummaryForm } from "../pcrItemSummaryForm";
import { EditLink } from "../pcrItemSummaryLinks";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { PcrPage } from "../pcrPage";
import { useApproveNewSubcontractorQuery } from "./ApproveNewSubcontractor.logic";
import {
  ApproveNewSubcontractorSchemaType,
  approveNewSubcontractorErrorMap,
  approveNewSubcontractorSchema,
} from "./ApproveNewSubcontractor.zod";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Markdown } from "@ui/components/atomicDesign/atoms/Markdown/markdown";

const ApproveNewSubcontractorSummary = () => {
  const { projectId, pcrId, itemId, fetchKey, displayCompleteForm } = usePcrWorkflowContext();
  const { getContent } = useContent();

  const { pcrItem } = useApproveNewSubcontractorQuery({ projectId, itemId, fetchKey });

  const { register, handleSubmit, formState, watch, getFieldState, setError } = useForm<
    z.output<ApproveNewSubcontractorSchemaType>
  >({
    resolver: zodResolver(approveNewSubcontractorSchema, {
      errorMap: approveNewSubcontractorErrorMap,
    }),
    defaultValues: {
      projectId,
      pcrId,
      pcrItemId: itemId,
      form: FormTypes.PcrApproveNewSubcontractorSummary,
      markedAsComplete: pcrItem.status === PCRItemStatus.Complete,
      subcontractorName: pcrItem.subcontractorName ?? "",
      subcontractorRegistrationNumber: pcrItem.subcontractorRegistrationNumber ?? "",
      subcontractorRelationship: pcrItem.subcontractorRelationship ?? undefined,
      subcontractorRelationshipJustification: pcrItem.subcontractorRelationshipJustification ?? "",
      subcontractorLocation: pcrItem.subcontractorLocation ?? "",
      subcontractorDescription: pcrItem.subcontractorDescription ?? "",
      subcontractorCost: String(pcrItem.subcontractorCost ?? ""),
      subcontractorJustification: pcrItem.subcontractorJustification ?? "",
    },
  });

  const validationErrors = useZodErrors<z.output<ApproveNewSubcontractorSchemaType>>(setError, formState.errors);

  return (
    <PcrPage validationErrors={validationErrors}>
      <Section qa="approve-a-new-subcontractor-summary">
        <SummaryList qa="approve-a-new-subcontractor-list">
          <SummaryListItem
            label={x => x.pcrApproveNewSubcontractorLabels.subcontractorName}
            content={pcrItem.subcontractorName}
            qa="subcontractorName"
            id="subcontractorName"
            hasError={!!getFieldState("subcontractorName")?.error}
            action={<EditLink stepName={PCRStepType.approveNewContractorNameStep} />}
          />
          <SummaryListItem
            label={x => x.pcrApproveNewSubcontractorLabels.subcontractorRegistrationNumber}
            content={pcrItem.subcontractorRegistrationNumber}
            qa="subcontractorRegistrationNumber"
            id="subcontractorRegistrationNumber"
            hasError={!!getFieldState("subcontractorRegistrationNumber")?.error}
            action={<EditLink stepName={PCRStepType.approveNewContractorNameStep} />}
          />
          <SummaryListItem
            label={x => x.pcrApproveNewSubcontractorLabels.subcontractorRelationship}
            content={
              <>
                {pcrItem.subcontractorRelationship === true &&
                  getContent(x => x.pcrApproveNewSubcontractorLabels.subcontractorRelationshipYes)}
                {pcrItem.subcontractorRelationship === false &&
                  getContent(x => x.pcrApproveNewSubcontractorLabels.subcontractorRelationshipNo)}
              </>
            }
            qa="subcontractorRelationship"
            id="subcontractorRelationship"
            hasError={!!getFieldState("subcontractorRelationship")?.error}
            action={<EditLink stepName={PCRStepType.approveNewContractorNameStep} />}
          />
          {pcrItem.subcontractorRelationship && (
            <SummaryListItem
              label={x => x.pcrApproveNewSubcontractorLabels.subcontractorRelationshipJustification}
              content={<Markdown verticalScrollbar value={pcrItem.subcontractorRelationshipJustification ?? ""} />}
              qa="subcontractorRelationshipJustification"
              id="subcontractorRelationshipJustification"
              hasError={!!getFieldState("subcontractorRelationshipJustification")?.error}
              action={<EditLink stepName={PCRStepType.approveNewContractorNameStep} />}
            />
          )}
          <SummaryListItem
            label={x => x.pcrApproveNewSubcontractorLabels.subcontractorLocation}
            content={pcrItem.subcontractorLocation}
            qa="subcontractorLocation"
            id="subcontractorLocation"
            hasError={!!getFieldState("subcontractorLocation")?.error}
            action={<EditLink stepName={PCRStepType.approveNewContractorNameStep} />}
          />
          <SummaryListItem
            label={x => x.pcrApproveNewSubcontractorLabels.subcontractorDescription}
            content={<Markdown verticalScrollbar value={pcrItem.subcontractorDescription ?? ""} />}
            qa="subcontractorDescription"
            id="subcontractorDescription"
            hasError={!!getFieldState("subcontractorDescription")?.error}
            action={<EditLink stepName={PCRStepType.approveNewContractorNameStep} />}
          />
          <SummaryListItem
            label={x => x.pcrApproveNewSubcontractorLabels.subcontractorCost}
            content={<Currency value={pcrItem.subcontractorCost} />}
            qa="subcontractorCost"
            id="subcontractorCost"
            hasError={!!getFieldState("subcontractorCost")?.error}
            action={<EditLink stepName={PCRStepType.approveNewContractorNameStep} />}
          />
          <SummaryListItem
            label={x => x.pcrApproveNewSubcontractorLabels.subcontractorJustification}
            content={<Markdown verticalScrollbar value={pcrItem.subcontractorJustification ?? ""} />}
            qa="subcontractorJustification"
            id="subcontractorJustification"
            hasError={!!getFieldState("subcontractorJustification")?.error}
            action={<EditLink stepName={PCRStepType.approveNewContractorNameStep} />}
          />
        </SummaryList>
      </Section>

      {displayCompleteForm && (
        <PcrItemSummaryForm<z.output<ApproveNewSubcontractorSchemaType>>
          register={register}
          watch={watch}
          handleSubmit={handleSubmit}
          pcrItem={pcrItem}
        >
          <input type="hidden" value={FormTypes.PcrApproveNewSubcontractorSummary} {...register("form")} />
          <input type="hidden" value={projectId} {...register("projectId")} />
          <input type="hidden" value={pcrId} {...register("pcrId")} />
          <input type="hidden" value={itemId} {...register("pcrItemId")} />
        </PcrItemSummaryForm>
      )}
    </PcrPage>
  );
};

export { ApproveNewSubcontractorSummary };
