import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fieldset, Label, TextInput, SubmitButton, FormGroup, Form, Hint, P } from "@ui/rhf-components";
import { apiClient } from "@ui/apiClient";
import { IAppError, PartnerStatus, PostcodeTaskStatus, ProjectRole } from "@framework/types";
import { Page, Projects, BackLink } from "@ui/components";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";
import { usePartnerDetailsEditQuery } from "./partnerDetailsEdit.logic";
import { IApiClient } from "@server/apis";
import { isApiError, useValidationErrors } from "@framework/util/errorHelpers";
import { partnerDetailsEditSchema, postcodeSetupSchema, emptySchema } from "./partnerDetailsEdit.zod";
import { useState } from "react";

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

type FormValues = {
  "new-postcode": string;
  partnerStatus: PartnerStatus;
};

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
  const navigate = useNavigate();
  const { getContent } = useContent();
  const [apiError, setApiError] = useState<IAppError | null>(null);

  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      "new-postcode": partner.postcode ?? "",
      partnerStatus: partner.partnerStatus,
    },
    resolver: zodResolver(getZodResolver(isSetup, partner.postcodeStatus)),
  });

  const onUpdate = async (data: FormValues) => {
    try {
      await (apiClient as unknown as IApiClient).partners.updatePartner({
        partnerId,
        partnerDto: { ...partner, ...data, postcode: data["new-postcode"], id: partnerId, projectId },
      });
      navigate(navigateTo);
    } catch (e: unknown) {
      if (isApiError(e)) {
        setApiError(e);
      }
    }
  };

  const errors = useValidationErrors<FormValues>(formState.errors);

  return (
    <Page
      backLink={backLink}
      pageTitle={<Projects.Title projectNumber={project.projectNumber} title={project.title} />}
      validator={errors}
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
