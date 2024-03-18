import { ClaimStatus } from "@framework/constants/claimStatus";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { SubmitButton } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Legend } from "@ui/components/atomicDesign/atoms/form/Legend/Legend";
import { Radio, RadioList } from "@ui/components/atomicDesign/atoms/form/Radio/Radio";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { TextAreaField } from "@ui/components/atomicDesign/molecules/form/TextFieldArea/TextAreaField";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { useClaimReviewPageData, useOnUpdateClaimReview, useReviewContent } from "./claimReview.logic";
import { claimReviewSchema } from "./claimReview.zod";

interface ClaimReviewFormProps {
  data: ReturnType<typeof useClaimReviewPageData>;
  content: ReturnType<typeof useReviewContent>;
  validatorErrors: RhfErrors;
  isFetching: boolean;
  form: UseFormReturn<z.output<typeof claimReviewSchema>>;
  onUpdate: ReturnType<typeof useOnUpdateClaimReview>["onUpdate"];
}

const validSubmittedClaimStatus = [ClaimStatus.MO_QUERIED, ClaimStatus.AWAITING_IAR, ClaimStatus.AWAITING_IUK_APPROVAL];

const ClaimReviewForm = ({
  data,
  content,
  validatorErrors,
  isFetching,
  form: { watch, handleSubmit, register },
  onUpdate,
}: ClaimReviewFormProps) => {
  const { isClient } = useMounted();

  const watchedStatus = watch("status");
  const watchedComments = watch("comments");

  const isValidStatus = validSubmittedClaimStatus.includes(watchedStatus);
  const isInteractive = isClient && !watchedStatus;
  const displayAdditionalInformationForm = isValidStatus || !isInteractive;
  const submitLabel = watchedStatus === ClaimStatus.MO_QUERIED ? content.buttonSendQuery : content.buttonSubmit;

  return (
    <Form onSubmit={handleSubmit(data => onUpdate({ data }))} data-qa="review-form">
      <Fieldset>
        <Legend>{content.sectionTitleHowToProceed}</Legend>
        <FormGroup>
          <RadioList inline name="status" register={register}>
            <Radio
              data-qa={`status_${ClaimStatus.MO_QUERIED}`}
              id="MO_Queried"
              value={ClaimStatus.MO_QUERIED}
              label={content.optionQueryClaim}
              disabled={isFetching}
            />
            <Radio
              data-qa={`status_${ClaimStatus.AWAITING_IUK_APPROVAL}`}
              id="Awaiting_IUK_Approval"
              value={ClaimStatus.AWAITING_IUK_APPROVAL}
              label={content.optionSubmitClaim}
              disabled={isFetching}
            />
          </RadioList>
        </FormGroup>
      </Fieldset>

      {displayAdditionalInformationForm && (
        <>
          <Fieldset>
            <Legend data-qa="additional-information-title">{content.sectionTitleAdditionalInfo}</Legend>
            <TextAreaField
              {...register("comments")}
              hint={content.additionalInfoHint}
              id="comments"
              disabled={isFetching}
              error={validatorErrors?.comments as RhfError}
              characterCount={watchedComments?.length ?? 0}
              data-qa="comments"
            />
          </Fieldset>

          <P>{content.claimReviewDeclaration}</P>

          <P data-qa={`${data.project.competitionType.toLowerCase()}-reminder`}>{content.monitoringReportReminder}</P>

          <SubmitButton data-qa="claim-form-submit" disabled={isFetching}>
            {submitLabel}
          </SubmitButton>
        </>
      )}
    </Form>
  );
};

export { ClaimReviewForm };
