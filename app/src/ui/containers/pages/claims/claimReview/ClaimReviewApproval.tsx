import { ClaimStatus } from "@framework/constants/claimStatus";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { SubmitButton } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { TextAreaField } from "@ui/components/atomicDesign/molecules/form/TextFieldArea/TextAreaField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOnUpdateClaimReview, useReviewContent } from "./claimReview.logic";
import { claimReviewErrorMap, claimReviewSchema } from "./claimReview.zod";
import { useMemo } from "react";

const validSubmittedClaimStatus = [ClaimStatus.MO_QUERIED, ClaimStatus.AWAITING_IAR, ClaimStatus.AWAITING_IUK_APPROVAL];

interface ClaimReviewApprovalProps {
  onUpdate: ReturnType<typeof useOnUpdateClaimReview>["onUpdate"];
  disabled: boolean;
}

const ClaimReviewApproval = ({ disabled, onUpdate }: ClaimReviewApprovalProps) => {
  const content = useReviewContent();
  const { isClient } = useMounted();

  const claimReviewForm = useForm<z.output<typeof claimReviewSchema>>({
    defaultValues: {
      status: undefined,
      comments: "",
    },
    resolver: zodResolver(claimReviewSchema, { errorMap: claimReviewErrorMap }),
  });

  const validatorErrors = useRhfErrors<z.output<typeof claimReviewSchema>>(claimReviewForm.formState.errors);

  const watched = claimReviewForm.watch();

  const { displayAdditionalInformationForm, submitLabel } = useMemo(() => {
    const isValidStatus = validSubmittedClaimStatus.includes(watched.status);
    const isInteractive = isClient && !watched.status;
    const displayAdditionalInformationForm = isValidStatus || !isInteractive;
    const submitLabel = watched.status === ClaimStatus.MO_QUERIED ? content.buttonSendQuery : content.buttonSubmit;

    return { displayAdditionalInformationForm, submitLabel };
  }, [watched, content, isClient]);

  return (
    <Form onSubmit={claimReviewForm.handleSubmit(data => onUpdate({ data }))} data-qa="review-form">
      <Fieldset>
        <Legend>{content.sectionTitleHowToProceed}</Legend>
        <FormGroup>
          <RadioList inline name="status" register={claimReviewForm.register}>
            <Radio
              data-qa={`status_${ClaimStatus.MO_QUERIED}`}
              id="MO_Queried"
              value={ClaimStatus.MO_QUERIED}
              label={content.optionQueryClaim}
              disabled={disabled}
            />
            <Radio
              data-qa={`status_${ClaimStatus.AWAITING_IUK_APPROVAL}`}
              id="Awaiting_IUK_Approval"
              value={ClaimStatus.AWAITING_IUK_APPROVAL}
              label={content.optionSubmitClaim}
              disabled={disabled}
            />
          </RadioList>
        </FormGroup>
      </Fieldset>

      {displayAdditionalInformationForm && (
        <>
          <Fieldset>
            <Legend data-qa="additional-information-title">{content.sectionTitleAdditionalInfo}</Legend>
            <TextAreaField
              {...claimReviewForm.register("comments")}
              hint={content.additionalInfoHint}
              id="comments"
              disabled={disabled}
              error={validatorErrors?.comments as RhfError}
              characterCount={watched.comments?.length ?? 0}
              data-qa="comments"
            />
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
