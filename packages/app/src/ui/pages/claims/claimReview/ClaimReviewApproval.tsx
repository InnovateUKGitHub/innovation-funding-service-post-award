import { useServerInput } from "@framework/api-helpers/useZodErrors";
import { ClaimStatus } from "@framework/constants/claimStatus";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { SubmitButton } from "@ui/components/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Legend } from "@ui/components/atoms/form/Legend/Legend";
import { Radio, RadioList } from "@ui/components/atoms/form/Radio/Radio";
import { Textarea } from "@ui/components/atoms/form/TextArea/Textarea";
import { useMounted } from "@ui/context/Mounted";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { CharacterCount } from "@ui/components/atoms/CharacterCount/CharacterCount";
import { FormTypes } from "@ui/zod/FormTypes";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useOnUpdateClaimReview, useReviewContent, validSubmittedClaimStatus } from "./claimReview.logic";
import { ReviewClaimParams } from "./claimReview.page";
import { ClaimReviewSchemaType, claimReviewSchemaCommentsMax } from "./claimReview.zod";
import { useMessages } from "@framework/api-helpers/useMessages";

interface ClaimReviewApprovalProps extends ReviewClaimParams {
  claimId: string;
  claimReviewForm: UseFormReturn<z.output<ClaimReviewSchemaType>>;
  onUpdate: ReturnType<typeof useOnUpdateClaimReview>["onUpdate"];
  disabled: boolean;
}

const ClaimReviewApproval = ({
  claimReviewForm,
  projectId,
  partnerId,
  periodId,
  claimId,
  disabled,
  onUpdate,
}: ClaimReviewApprovalProps) => {
  const content = useReviewContent();
  const { isClient } = useMounted();
  const defaults = useServerInput<z.output<ClaimReviewSchemaType>>();
  const { clearMessages } = useMessages();

  const watched = claimReviewForm.watch();

  const { displayAdditionalInformationForm, submitLabel } = useMemo(() => {
    const isValidStatus = validSubmittedClaimStatus.includes(watched.status);
    const isInteractive = isClient && !watched.status;
    const displayAdditionalInformationForm = isValidStatus || !isInteractive;
    const submitLabel = watched.status === ClaimStatus.MO_QUERIED ? content.buttonSendQuery : content.buttonSubmit;

    return { displayAdditionalInformationForm, submitLabel };
  }, [watched, content, isClient]);

  return (
    <Form onSubmit={claimReviewForm.handleSubmit(data => onUpdate({ data }), clearMessages)} data-qa="review-form">
      <input type="hidden" value={FormTypes.ClaimReviewLevelSaveAndContinue} {...claimReviewForm.register("form")} />
      <input type="hidden" value={projectId} {...claimReviewForm.register("projectId")} />
      <input type="hidden" value={partnerId} {...claimReviewForm.register("partnerId")} />
      <input type="hidden" value={periodId} {...claimReviewForm.register("periodId")} />
      <input type="hidden" value={claimId} {...claimReviewForm.register("claimId")} />

      <Fieldset>
        <Legend>{content.sectionTitleHowToProceed}</Legend>
        <FormGroup hasError={!!claimReviewForm.getFieldState("status").error}>
          <ValidationError error={claimReviewForm.getFieldState("status").error} />
          <RadioList
            hasError={!!claimReviewForm.getFieldState("status").error}
            inline
            name="status"
            register={claimReviewForm.register}
          >
            <Radio
              data-qa={`status_${ClaimStatus.MO_QUERIED}`}
              id="MO_Queried"
              value={ClaimStatus.MO_QUERIED}
              label={content.optionQueryClaim}
              disabled={disabled}
              defaultChecked={defaults?.status === ClaimStatus.MO_QUERIED}
            />
            <Radio
              data-qa={`status_${ClaimStatus.AWAITING_IUK_APPROVAL}`}
              id="Awaiting_IUK_Approval"
              value={ClaimStatus.AWAITING_IUK_APPROVAL}
              label={content.optionSubmitClaim}
              disabled={disabled}
              defaultChecked={defaults?.status === ClaimStatus.AWAITING_IUK_APPROVAL}
            />
          </RadioList>
        </FormGroup>
      </Fieldset>

      {displayAdditionalInformationForm && (
        <>
          <Fieldset>
            <FormGroup hasError={!!claimReviewForm.getFieldState("comments").error}>
              <Legend data-qa="additional-information-title">{content.sectionTitleAdditionalInfo}</Legend>
              <Hint id="hint-for-comments" data-qa="hint-comments">
                {content.additionalInfoHint}
              </Hint>
              <ValidationError error={claimReviewForm.getFieldState("comments").error} />
              <CharacterCount
                count={watched.comments?.length ?? 0}
                type="descending"
                maxValue={claimReviewSchemaCommentsMax}
              >
                <Textarea
                  {...claimReviewForm.register("comments")}
                  id="comments"
                  data-qa="comments"
                  disabled={disabled}
                  hasError={!!claimReviewForm.getFieldState("comments").error}
                  defaultValue={defaults?.comments ?? ""}
                />
              </CharacterCount>
            </FormGroup>
          </Fieldset>

          <P>{content.claimReviewDeclaration}</P>

          <P data-qa="reminder">{content.monitoringReportReminder}</P>

          <SubmitButton data-qa="claim-form-submit" disabled={disabled}>
            {submitLabel}
          </SubmitButton>
        </>
      )}
    </Form>
  );
};

export { ClaimReviewApproval };
