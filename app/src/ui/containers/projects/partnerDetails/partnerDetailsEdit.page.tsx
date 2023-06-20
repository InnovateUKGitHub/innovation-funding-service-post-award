import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { usePartnerDetailsEditQuery, FormValues, useOnUpdatePartnerDetails } from "./partnerDetailsEdit.logic";
import { useValidationErrors } from "@framework/util/errorHelpers";
import {
  partnerDetailsEditSchema,
  postcodeSetupSchema,
  emptySchema,
  partnerDetailsEditErrorMap,
} from "./partnerDetailsEdit.zod";
import { PostcodeTaskStatus } from "@framework/constants/partner";
import { ProjectRole } from "@framework/constants/project";
import { Page } from "@ui/components/layout/page";
import { BackLink } from "@ui/components/links";
import { useContent } from "@ui/hooks/content.hook";
import { Fieldset } from "@ui/rhf-components/Fieldset";
import { FormGroup } from "@ui/rhf-components/FormGroup";
import { Hint } from "@ui/rhf-components/Hint";
import { Label } from "@ui/rhf-components/Label";
import { SubmitButton } from "@ui/rhf-components/SubmitButton";
import { TextInput } from "@ui/rhf-components/TextInput";
import { P } from "@ui/rhf-components/Typography";
import { Title } from "@ui/components/projects/title";
import { Form } from "@ui/rhf-components/Form";

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
      "new-postcode": partner.postcode ?? "",
      partnerStatus: partner.partnerStatus,
    },
    resolver: zodResolver(getZodResolver(isSetup, partner.postcodeStatus), { errorMap: partnerDetailsEditErrorMap }),
  });

  const { onUpdate, apiError } = useOnUpdatePartnerDetails(partnerId, projectId, navigateTo, partner);

  const validatorErrors = useValidationErrors<FormValues>(formState.errors);

  return (
    <Page
      backLink={backLink}
      pageTitle={<Title projectNumber={project.projectNumber} title={project.title} />}
      validator={validatorErrors}
      error={apiError}
      projectStatus={project.status}
      partnerStatus={partner.partnerStatus}
    >
      <Form onSubmit={handleSubmit(onUpdate)}>
        <Fieldset>
          {!isSetup && (
            <FormGroup>
              <Label htmlFor="current-postcode">
                {getContent(x => x.pages.partnerDetailsEdit.labelCurrentPostcode)}
              </Label>
              <P id="current-postcode">{partner.postcode}</P>
            </FormGroup>
          )}
          <FormGroup>
            <Label htmlFor="new-postcode">{getContent(x => x.pages.partnerDetailsEdit.labelNewPostcode)}</Label>
            <Hint id="hint-for-new-postcode" className="govuk-hint">
              {getContent(x => x.pages.partnerDetailsEdit.hintNewPostcode)}
            </Hint>
            <TextInput
              defaultValue={partner.postcode ?? ""}
              inputWidth="one-quarter"
              id="new-postcode"
              hasError={!!formState.errors?.["new-postcode"]}
              aria-describedby="hint-for-new-postcode"
              {...register("new-postcode")}
            ></TextInput>
          </FormGroup>
        </Fieldset>
        <Fieldset>
          <SubmitButton>
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
