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
import { useRoutes } from "@ui/redux/routesProvider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useClaimReviewPageData, useOnUpdateClaimReview, useReviewContent } from "./claimReview.logic";
import { claimReviewErrorMap, claimReviewSchema } from "./claimReview.zod";
import { IAppError } from "@framework/types/IAppError";
import { Results } from "@ui/validation/results";
import { Dispatch, SetStateAction, useEffect } from "react";

interface ClaimReviewFormProps {
  projectId: ProjectId;
  partnerId: PartnerId;
  periodId: PeriodId;
  data: ReturnType<typeof useClaimReviewPageData>;
  content: ReturnType<typeof useReviewContent>;
  setApiError: Dispatch<SetStateAction<IAppError<Results<ResultBase>> | null | undefined>>;
  setValidatorErrors: Dispatch<SetStateAction<RhfErrors>>;
}

const validSubmittedClaimStatus = [ClaimStatus.MO_QUERIED, ClaimStatus.AWAITING_IAR, ClaimStatus.AWAITING_IUK_APPROVAL];

const ClaimReviewForm = ({
  projectId,
  partnerId,
  periodId,
  data,
  content,
  setApiError,
  setValidatorErrors,
}: ClaimReviewFormProps) => {
  const { isClient } = useMounted();
  const routes = useRoutes();
  const { register, formState, handleSubmit, watch } = useForm<z.output<typeof claimReviewSchema>>({
    defaultValues: {
      status: undefined,
      comments: "",
    },
    resolver: zodResolver(claimReviewSchema, { errorMap: claimReviewErrorMap }),
  });

  const { onUpdate, apiError, isFetching } = useOnUpdateClaimReview(
    partnerId,
    projectId,
    periodId,
    routes.allClaimsDashboard.getLink({ projectId }).path,
    data.claim,
  );

  const validatorErrors = useRhfErrors<z.output<typeof claimReviewSchema>>(formState.errors);

  const watchedStatus = watch("status");
  const watchedComments = watch("comments");

  const isValidStatus = validSubmittedClaimStatus.includes(watchedStatus);
  const isInteractive = isClient && !watchedStatus;
  const displayAdditionalInformationForm = isValidStatus || !isInteractive;
  const submitLabel = watchedStatus === ClaimStatus.MO_QUERIED ? content.buttonSendQuery : content.buttonSubmit;

  useEffect(() => {
    setApiError(apiError);
  }, [apiError, setApiError]);
  useEffect(() => {
    setValidatorErrors(validatorErrors);
  }, [validatorErrors, setValidatorErrors]);

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
