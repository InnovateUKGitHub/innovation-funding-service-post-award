import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { postcodeErrorMap, PostcodeSchema, postcodeSchema } from "./partnerDetailsEdit.zod";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { BackLink } from "@ui/components/atoms/Links/links";
import { useContent } from "@ui/hooks/content.hook";
import { P } from "@ui/components/atoms/Paragraph/Paragraph";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { Hint } from "@ui/components/atoms/form/Hint/Hint";
import { Label } from "@ui/components/atoms/form/Label/Label";
import { SubmitButton } from "@ui/components/atoms/form/SubmitButton/SubmitButton";
import { TextInput } from "@ui/components/atoms/form/TextInput/TextInput";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { usePartnerDetailsEditQuery, useOnUpdatePartnerDetails } from "./partnerDetailsEdit.logic";
import { useRhfErrors } from "@framework/util/errorHelpers";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";

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
  const { partner, fragmentRef } = usePartnerDetailsEditQuery(projectId, partnerId);
  const { getContent } = useContent();

  type SchemaType = z.infer<PostcodeSchema>;

  const { register, handleSubmit, formState } = useForm<SchemaType>({
    defaultValues: {
      form: isSetup ? FormTypes.ProjectSetupPostcode : FormTypes.PartnerDetailsEdit,
      postcode: partner.postcode ?? "",
      partnerStatus: partner.partnerStatus,
      postcodeStatus: partner.postcodeStatus,
      isSetup,
    },
    resolver: zodResolver(postcodeSchema, { errorMap: postcodeErrorMap }),
  });

  const { onUpdate, apiError, isFetching } = useOnUpdatePartnerDetails(partnerId, projectId, navigateTo, partner);

  const validatorErrors = useRhfErrors<SchemaType>(formState.errors);

  const postcodeError = validatorErrors?.postcode as RhfErrors;

  console.log("partner", partner);
  return (
    <Page
      fragmentRef={fragmentRef}
      backLink={backLink}
      validationErrors={validatorErrors as RhfErrors}
      apiError={apiError}
      partnerId={partnerId}
    >
      <Form onSubmit={handleSubmit(data => onUpdate({ data: { ...data, postcode: data.postcode ?? "" } }))}>
        <input
          type="hidden"
          name="form"
          value={isSetup ? FormTypes.ProjectSetupPostcode : FormTypes.PartnerDetailsEdit}
        />
        <input type="hidden" name="postcodeStatus" value={partner.postcodeStatus} />
        <input type="hidden" name="partnerStatus" value={partner.partnerStatus} />
        <input type="hidden" name="isSetup" value={String(isSetup)} />
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
            <Hint id="hint-for-postcode" className="govuk-hint">
              {getContent(x => x.pages.partnerDetailsEdit.hintNewPostcode)}
            </Hint>
            <ValidationError error={postcodeError as RhfErrors} />
            <TextInput
              defaultValue={partner.postcode ?? ""}
              inputWidth="one-quarter"
              id="postcode"
              hasError={!!postcodeError}
              aria-describedby="hint-for-postcode"
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
    auth
      .forPartner(projectId, partnerId)
      .hasAnyRoles(ProjectRolePermissionBits.FinancialContact, ProjectRolePermissionBits.ProjectManager),
});
