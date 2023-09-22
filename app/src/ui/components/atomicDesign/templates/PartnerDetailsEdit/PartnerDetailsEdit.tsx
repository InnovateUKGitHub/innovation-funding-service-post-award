import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import {
  partnerDetailsEditSchema,
  postcodeSetupSchema,
  emptySchema,
  partnerDetailsEditErrorMap,
} from "./partnerDetailsEdit.zod";
import { PostcodeTaskStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { useContent } from "@ui/hooks/content.hook";
import { P } from "@ui/components/atomicDesign/atoms/Paragraph/Paragraph";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { Fieldset } from "@ui/components/atomicDesign/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atomicDesign/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atomicDesign/atoms/form/Hint/Hint";
import { Label } from "@ui/components/atomicDesign/atoms/form/Label/Label";
import { SubmitButton } from "@ui/components/atomicDesign/atoms/form/SubmitButton/SubmitButton";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";
import { usePartnerDetailsEditQuery, FormValues, useOnUpdatePartnerDetails } from "./partnerDetailsEdit.logic";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { Page } from "@ui/components/atomicDesign/molecules/Page/Page";

export interface PartnerDetailsParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

interface PartnerDetailsEditComponentProps extends PartnerDetailsParams {
  backLink: React.ReactElement;
  saveButtonContent: string;
  displayCurrentPostcode?: boolean;
  navigateTo: string;
  isSetup?: boolean;
}

const getZodResolver = (isSetupPage: boolean, postcodeStatus: PostcodeTaskStatus) => {
  if (isSetupPage) {
    return postcodeSetupSchema;
  } else {
    return postcodeStatus !== PostcodeTaskStatus.ToDo ? partnerDetailsEditSchema : emptySchema;
  }
};

/**
 * ### PartnerDetailsEditComponent
 *
 * React component to edit partner details
 */
export function PartnerDetailsEditComponent({
  projectId,
  partnerId,
  backLink,
  saveButtonContent,
  navigateTo,
  isSetup = false,
}: BaseProps & PartnerDetailsEditComponentProps) {
  const { project, partner } = usePartnerDetailsEditQuery(projectId, partnerId);
  const { getContent } = useContent();

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      postcode: partner.postcode ?? "",
      partnerStatus: partner.partnerStatus,
    },
    resolver: zodResolver(getZodResolver(isSetup, partner.postcodeStatus), { errorMap: partnerDetailsEditErrorMap }),
  });

  const { onUpdate, apiError, isFetching } = useOnUpdatePartnerDetails(partnerId, projectId, navigateTo, partner);

  const validatorErrors = useRhfErrors<FormValues>(formState.errors);

  const postcodeError = validatorErrors?.postcode as RhfErrors;
  return (
    <Page
      backLink={backLink}
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      validationErrors={validatorErrors as RhfErrors}
      apiError={apiError}
      projectStatus={project.status}
      partnerStatus={partner.partnerStatus}
    >
      <Form onSubmit={handleSubmit(data => onUpdate({ data }))}>
        <Fieldset>
          {!isSetup && (
            <FormGroup>
              <Label htmlFor="current-postcode">
                {getContent(x => x.pages.partnerDetailsEdit.labelCurrentPostcode)}
              </Label>
              <P id="current-postcode">{partner.postcode}</P>
            </FormGroup>
          )}
          <FormGroup hasError={!!postcodeError}>
            <Label htmlFor="postcode">{getContent(x => x.pages.partnerDetailsEdit.labelNewPostcode)}</Label>
            <Hint id="hint-for-new-postcode" className="govuk-hint">
              {getContent(x => x.pages.partnerDetailsEdit.hintNewPostcode)}
            </Hint>
            <ValidationError error={postcodeError as RhfErrors} />
            <TextInput
              defaultValue={partner.postcode ?? ""}
              inputWidth="one-quarter"
              id="postcode"
              hasError={!!postcodeError}
              aria-describedby="hint-for-new-postcode"
              {...register("postcode")}
            ></TextInput>
          </FormGroup>
        </Fieldset>
        <Fieldset>
          <SubmitButton disabled={isFetching}>
            {typeof saveButtonContent === "string" ? saveButtonContent : getContent(saveButtonContent)}
          </SubmitButton>
        </Fieldset>
      </Form>
    </Page>
  );
}

const PartnerDetailsEditContainer = (props: PartnerDetailsParams & BaseProps) => {
  const { getContent } = useContent();
  const url = props.routes.partnerDetails.getLink({ projectId: props.projectId, partnerId: props.partnerId });

  return (
    <PartnerDetailsEditComponent
      backLink={<BackLink route={url}>{getContent(x => x.pages.partnerDetailsEdit.backToPartnerInfo)}</BackLink>}
      saveButtonContent={getContent(x => x.pages.partnerDetailsEdit.saveAndReturnPartnerDetailsButton)}
      navigateTo={url.path}
      {...props}
    />
  );
};

export const PartnerDetailsEditRoute = defineRoute<PartnerDetailsParams>({
  routeName: "partnerDetailsEdit",
  routePath: "/projects/:projectId/setup/:partnerId/project-location",
  container: PartnerDetailsEditContainer,
  getParams: r => ({
    projectId: r.params.projectId as ProjectId,
    partnerId: r.params.partnerId as PartnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.partnerDetailsEdit.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasAnyRoles(ProjectRole.FinancialContact, ProjectRole.ProjectManager),
});
