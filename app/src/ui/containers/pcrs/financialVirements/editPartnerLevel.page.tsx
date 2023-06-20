import { useNavigate } from "react-router-dom";
import { Pending } from "@shared/pending";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks/content.hook";
import { IRoutes } from "@ui/routing/routeConfig";
import { EditorStatus } from "@ui/constants/enums";
import { FinancialVirementDto, PartnerVirementsDto } from "@framework/dtos/financialVirementDto";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { AwardRateOverridesMessage } from "@ui/components/claims/AwardRateOverridesMessage";
import { createTypedForm } from "@ui/components/form";
import { Page } from "@ui/components/layout/page";
import { Section } from "@ui/components/layout/section";
import { BackLink } from "@ui/components/links";
import { PageLoader } from "@ui/components/loading";
import { Title } from "@ui/components/projects/title";
import { Currency } from "@ui/components/renderers/currency";
import { Percentage } from "@ui/components/renderers/percentage";
import { SimpleString } from "@ui/components/renderers/simpleString";
import { createTypedTable } from "@ui/components/table";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import {
  FinancialVirementDtoValidator,
  PartnerVirementsDtoValidator,
} from "@ui/validators/financialVirementDtoValidator";
import { ValidationError } from "@ui/components/validationError";
import { NumberInput } from "@ui/components/inputs/numberInput";

const VirementForm = createTypedForm<FinancialVirementDto>();

/**
 * Hook returns content for edit partner view
 */
export function useEditPartnerLevelContent() {
  const { getContent } = useContent();

  return {
    saveButton: getContent(x => x.pages.financialVirementEditPartnerLevel.saveButton),

    remainingGrantInfoIntro: getContent(x => x.pages.financialVirementEditPartnerLevel.remainingGrantInfo.intro),
    remainingGrantInfoCheckRules: getContent(
      x => x.pages.financialVirementEditPartnerLevel.remainingGrantInfo.checkRules,
    ),
    remainingGrantInfoRemainingGrant: getContent(
      x => x.pages.financialVirementEditPartnerLevel.remainingGrantInfo.remainingGrant,
    ),
    remainingGrantInfoFundingLevel: getContent(
      x => x.pages.financialVirementEditPartnerLevel.remainingGrantInfo.fundingLevel,
    ),

    partnerName: getContent(x => x.financialVirementLabels.partnerName),
    partnerOriginalRemainingCosts: getContent(x => x.financialVirementLabels.partnerOriginalRemainingCosts),
    partnerOriginalRemainingGrant: getContent(x => x.financialVirementLabels.partnerOriginalRemainingGrant),
    originalFundingLevel: getContent(x => x.financialVirementLabels.originalFundingLevel),
    partnerNewRemainingCosts: getContent(x => x.financialVirementLabels.partnerNewRemainingCosts),
    partnerNewRemainingGrant: getContent(x => x.financialVirementLabels.partnerNewRemainingGrant),
    newFundingLevel: getContent(x => x.financialVirementLabels.newFundingLevel),
    projectTotals: getContent(x => x.financialVirementLabels.projectTotals),
    backToSummary: getContent(x => x.financialVirementLabels.backToSummary),
  };
}

export interface FinancialVirementParams {
  projectId: ProjectId;
  pcrId: PcrId;
  itemId: PcrItemId;
}

interface EditPartnerLevelProps {
  project: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  editor: Pending<IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>>;
  content: Record<string, string>;
  routes: IRoutes;
  onChange: (saving: boolean, dto: FinancialVirementDto) => void;
}

interface VirementTableData {
  partner: PartnerDto;
  virement: PartnerVirementsDto;
  validator: PartnerVirementsDtoValidator | undefined;
}
const VirementTable = createTypedTable<VirementTableData>();

const EditPartnerLevelComponent = (props: EditPartnerLevelProps & FinancialVirementParams) => {
  const combined = Pending.combine({
    project: props.project,
    partners: props.partners,
    editor: props.editor,
  });

  const updateValue = (partner: PartnerDto, val: number | null): void => {
    const dto = props.editor.data?.data;

    if (!dto) throw new Error("cannot find dto");

    const item = dto.partners.find(x => x.partnerId === partner.id);
    if (!item) {
      return;
    }
    item.newRemainingGrant = val ?? 0;
    item.newFundingLevel = (100 * (val || 0)) / item.newRemainingCosts;

    dto.newRemainingGrant = dto.partners.reduce((total, current) => total + (current.newRemainingGrant || 0), 0);
    dto.newFundingLevel = (100 * dto.newRemainingGrant) / dto.newRemainingCosts;

    props.onChange(false, dto);
  };

  return (
    <PageLoader
      pending={combined}
      render={({ project, partners, editor }) => {
        const data = partners
          .map(partner => {
            const virement = editor.data.partners.find(x => x.partnerId === partner.id);
            if (!virement) throw new Error(`Cannot find virement matching partnerId ${partner.id}`);
            return {
              partner,
              virement,
              validator: editor.validator.partners.results.find(x => x.model.partnerId === partner.id),
            };
          })
          .filter(x => !!x.virement);

        const backLink = (
          <BackLink
            route={props.routes.pcrPrepareItem.getLink({
              projectId: props.projectId,
              pcrId: props.pcrId,
              itemId: props.itemId,
            })}
          >
            {props.content.backToSummary}
          </BackLink>
        );
        return (
          <Page
            backLink={backLink}
            pageTitle={<Title {...project} />}
            error={editor.error}
            validator={editor.validator}
          >
            <Section>
              <AwardRateOverridesMessage isNonFec={project.isNonFec} />
              <SimpleString>{props.content.remainingGrantInfoIntro}</SimpleString>
              <SimpleString>{props.content.remainingGrantInfoCheckRules}</SimpleString>
              <SimpleString>{props.content.remainingGrantInfoRemainingGrant}</SimpleString>
              <SimpleString>{props.content.remainingGrantInfoFundingLevel}</SimpleString>
              <VirementForm.Form
                editor={editor}
                onChange={dto => props.onChange(false, dto)}
                onSubmit={() => props.onChange(true, editor.data)}
                qa="partner_level_form"
              >
                <VirementForm.Fieldset>
                  <VirementTable.Table qa="partnerVirements" data={data} validationResult={data.map(x => x.validator)}>
                    <VirementTable.String
                      qa="partner"
                      header={props.content.partnerName}
                      value={x => x.partner.name}
                      footer={props.content.projectTotals}
                      isDivider="normal"
                    />

                    <VirementTable.Currency
                      qa="remainingCosts"
                      header={props.content.partnerOriginalRemainingCosts}
                      value={x => x.virement.originalRemainingCosts}
                      footer={<Currency value={editor.data.originalRemainingCosts} />}
                    />

                    <VirementTable.Currency
                      qa="remainingGrant"
                      header={props.content.partnerOriginalRemainingGrant}
                      value={x => x.virement.originalRemainingGrant}
                      footer={<Currency value={editor.data.originalRemainingGrant} />}
                    />

                    <VirementTable.Percentage
                      qa="fundingLevel"
                      header={props.content.originalFundingLevel}
                      value={x => x.virement.originalFundingLevel}
                      footer={<Percentage value={editor.data.originalFundingLevel} defaultIfInfinite={0} />}
                      defaultIfInfinite={0}
                      isDivider="normal"
                    />

                    <VirementTable.Currency
                      qa="newCosts"
                      header={props.content.partnerNewRemainingCosts}
                      value={x => x.virement.newRemainingCosts}
                      footer={<Currency value={editor.data.newRemainingCosts} />}
                    />

                    <VirementTable.Custom
                      qa="newGrant"
                      header={props.content.partnerNewRemainingGrant}
                      value={x => (
                        <>
                          <ValidationError
                            overrideMessage={`Invalid grant for ${x.partner.name}`}
                            error={x.validator && x.validator.newRemainingGrant}
                          />
                          <NumberInput
                            name={x.virement.partnerId}
                            value={x.virement.newRemainingGrant}
                            onChange={val => updateValue(x.partner, val)}
                            width="full"
                            ariaLabel={x.partner.name}
                            disabled={editor.status === EditorStatus.Saving}
                            enforceValidInput
                          />
                        </>
                      )}
                      footer={
                        <>
                          <ValidationError error={editor.validator.newRemainingGrant} />
                          <Currency value={editor.data.newRemainingGrant} />
                        </>
                      }
                      classSuffix="numeric"
                    />
                    <VirementTable.Percentage
                      qa="newLevel"
                      header={props.content.newFundingLevel}
                      value={x => x.virement.newFundingLevel}
                      defaultIfInfinite={0}
                      footer={<Percentage value={editor.data.newFundingLevel} defaultIfInfinite={0} />}
                    />
                  </VirementTable.Table>
                </VirementForm.Fieldset>
                <VirementForm.Fieldset>
                  <VirementForm.Submit>{props.content.saveButton}</VirementForm.Submit>
                </VirementForm.Fieldset>
              </VirementForm.Form>
            </Section>
          </Page>
        );
      }}
    />
  );
};

const Container = (props: FinancialVirementParams & BaseProps) => {
  const { projects, partners, financialVirements } = useStores();
  const editPartnerLevelContent = useEditPartnerLevelContent();
  const navigate = useNavigate();
  return (
    <EditPartnerLevelComponent
      content={editPartnerLevelContent}
      project={projects.getById(props.projectId)}
      partners={partners.getPartnersForProject(props.projectId)}
      editor={financialVirements.getFinancialVirementEditor(props.projectId, props.pcrId, props.itemId)}
      onChange={(saving, dto) =>
        financialVirements.updateFinancialVirementEditor(
          saving,
          props.projectId,
          props.pcrId,
          props.itemId,
          dto,
          true,
          () =>
            navigate(
              props.routes.pcrPrepareItem.getLink({
                projectId: props.projectId,
                pcrId: props.pcrId,
                itemId: props.itemId,
              }).path,
            ),
        )
      }
      {...props}
    />
  );
};

export const FinancialVirementEditPartnerLevelRoute = defineRoute({
  routeName: "financial-virement-edit-partner-level",
  routePath: "/projects/:projectId/pcrs/:pcrId/prepare/item/:itemId/partner",
  container: Container,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    pcrId: route.params.pcrId as PcrId,
    itemId: route.params.itemId as PcrItemId,
  }),
  getTitle: ({ content }) => content.getTitleCopy(x => x.pages.financialVirementEditPartnerLevel.title),
});
