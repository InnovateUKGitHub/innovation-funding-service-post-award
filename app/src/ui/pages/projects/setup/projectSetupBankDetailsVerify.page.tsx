import { BaseProps, defineRoute } from "@ui/app/containerBase";
import { ProjectRole } from "@framework/constants/project";
import { Content } from "@ui/components/molecules/Content/content";
import { Page } from "@ui/components/molecules/Page/Page.withFragment";
import { Section } from "@ui/components/molecules/Section/section";
import { BackLink, Link } from "@ui/components/atoms/Links/links";
import { SummaryList, SummaryListItem } from "@ui/components/molecules/SummaryList/summaryList";
import {
  useOnUpdateSetupBankDetailsVerify,
  useSetupBankDetailsVerifyData,
} from "./projectSetupBankDetailsVerify.logic";
import { useForm } from "react-hook-form";
import { Form } from "@ui/components/atoms/form/Form/Form";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { Button } from "@ui/components/atoms/form/Button/Button";

export interface ProjectSetupBankDetailsVerifyParams {
  projectId: ProjectId;
  partnerId: PartnerId;
}

const ProjectSetupBankDetailsVerifyComponent = ({
  projectId,
  partnerId,
  ...props
}: BaseProps & ProjectSetupBankDetailsVerifyParams) => {
  const { partner, fragmentRef } = useSetupBankDetailsVerifyData(projectId, partnerId);
  const { bankDetails } = partner;

  const { handleSubmit } = useForm({
    defaultValues: {},
  });

  const { onUpdate, isFetching, apiError } = useOnUpdateSetupBankDetailsVerify(projectId, partnerId, partner);

  return (
    <Page
      backLink={
        <BackLink
          route={props.routes.projectSetup.getLink({
            projectId,
            partnerId,
          })}
        >
          <Content value={x => x.pages.projectSetupBankDetailsVerify.backLink} />
        </BackLink>
      }
      apiError={apiError}
      fragmentRef={fragmentRef}
    >
      <Section qa={"guidance"}>
        <Content markdown value={x => x.pages.projectSetupBankDetailsVerify.guidanceMessage} />
      </Section>

      <Section>
        <SummaryList qa="bank-details-summary">
          <SummaryListItem
            label={x => x.partnerLabels.organisationName}
            content={partner.name}
            qa={"organisationName"}
          />
          <SummaryListItem
            label={x => x.partnerLabels.companyNumber}
            content={bankDetails.companyNumber}
            qa={"companyNumber"}
          />
          <SummaryListItem label={x => x.partnerLabels.sortCode} content={bankDetails.sortCode} qa={"sortCode"} />
          <SummaryListItem
            label={x => x.partnerLabels.accountNumber}
            content={bankDetails.accountNumber}
            qa={"accountNumber"}
          />
          <SummaryListItem
            label={x => x.partnerLabels.accountBuilding}
            content={bankDetails.address.accountBuilding}
            qa={"accountBuilding"}
          />
          <SummaryListItem
            label={x => x.partnerLabels.accountStreet}
            content={bankDetails.address.accountStreet}
            qa={"accountStreet"}
          />
          <SummaryListItem
            label={x => x.partnerLabels.accountLocality}
            content={bankDetails.address.accountLocality}
            qa={"accountLocality"}
          />
          <SummaryListItem
            label={x => x.partnerLabels.accountTownOrCity}
            content={bankDetails.address.accountTownOrCity}
            qa={"accountTownOrCity"}
          />
          <SummaryListItem
            label={x => x.partnerLabels.accountPostcode}
            content={bankDetails.address.accountPostcode}
            qa={"accountPostcode"}
          />
        </SummaryList>
      </Section>
      <Section qa="bank-details-verify-section">
        <Form data-qa="bank-details-form" onSubmit={handleSubmit(data => onUpdate({ data }))}>
          <Fieldset>
            <Button disabled={isFetching} type="submit">
              <Content value={x => x.pages.projectSetupBankDetailsVerify.submitButton} />
            </Button>
            <Link
              styling="SecondaryButton"
              route={props.routes.projectSetupBankDetails.getLink({
                projectId,
                partnerId,
              })}
            >
              <Content value={x => x.pages.projectSetupBankDetailsVerify.changeButton} />
            </Link>
          </Fieldset>
        </Form>
      </Section>
    </Page>
  );
};

export const ProjectSetupBankDetailsVerifyRoute = defineRoute({
  routeName: "ProjectSetupBankDetailsVerify",
  routePath: "/projects/:projectId/setup/:partnerId/bank-details-verify",
  container: ProjectSetupBankDetailsVerifyComponent,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.projectSetupBankDetailsVerify.title),
  accessControl: (auth, { projectId, partnerId }) =>
    auth.forPartner(projectId, partnerId).hasRole(ProjectRole.FinancialContact),
});
