import { useNavigate } from "react-router-dom";
import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { IEditorStore, useStores } from "@ui/redux";
import { FinancialVirementDtoValidator } from "@ui/validators";
import { FinancialVirementDto, PartnerDto, ProjectDto } from "@framework/dtos";
import { useContent } from "@ui/hooks";
import { IRoutes } from "@ui/routing";
import { EditorStatus } from "@ui/constants/enums";

export function useEditPartnerLevelContent() {
  const { getContent } = useContent();

  return {
    saveButton: getContent(x => x.financialVirementEditPartnerLevel.saveButton),

    remainingGrantInfoIntro: getContent(x => x.financialVirementEditPartnerLevel.remainingGrantInfo.intro),
    remainingGrantInfoCheckRules: getContent(x => x.financialVirementEditPartnerLevel.remainingGrantInfo.checkRules),
    remainingGrantInfoRemainingGrant: getContent(
      x => x.financialVirementEditPartnerLevel.remainingGrantInfo.remainingGrant,
    ),
    remainingGrantInfoFundingLevel: getContent(
      x => x.financialVirementEditPartnerLevel.remainingGrantInfo.fundingLevel,
    ),

    partnerName: getContent(x => x.financialVirementEditPartnerLevel.labels.partnerName),
    partnerOriginalRemainingCosts: getContent(
      x => x.financialVirementEditPartnerLevel.labels.partnerOriginalRemainingCosts,
    ),
    partnerOriginalRemainingGrant: getContent(
      x => x.financialVirementEditPartnerLevel.labels.partnerOriginalRemainingGrant,
    ),
    originalFundingLevel: getContent(x => x.financialVirementEditPartnerLevel.labels.originalFundingLevel),
    partnerNewRemainingCosts: getContent(x => x.financialVirementEditPartnerLevel.labels.partnerNewRemainingCosts),
    partnerNewRemainingGrant: getContent(x => x.financialVirementEditPartnerLevel.labels.partnerNewRemainingGrant),
    newFundingLevel: getContent(x => x.financialVirementEditPartnerLevel.labels.newFundingLevel),
    projectTotals: getContent(x => x.financialVirementEditPartnerLevel.labels.projectTotals),
    backToSummary: getContent(x => x.financialVirementEditPartnerLevel.labels.backToSummary),
  };
}

export interface FinancialVirementParams {
  projectId: string;
  pcrId: string;
  itemId: string;
}

interface EditPartnerLevelProps {
  project: Pending<ProjectDto>;
  partners: Pending<PartnerDto[]>;
  editor: Pending<IEditorStore<FinancialVirementDto, FinancialVirementDtoValidator>>;
  content: Record<string, string>;
  routes: IRoutes;
  onChange: (saving: boolean, dto: FinancialVirementDto) => void;
}

function EditPartnerLevelComponent(props: EditPartnerLevelProps & FinancialVirementParams) {
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
    <ACC.PageLoader
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

        const VirementForm = ACC.TypedForm<FinancialVirementDto>();
        const VirementTable = ACC.TypedTable<typeof data[0]>();

        const backLink = (
          <ACC.BackLink
            route={props.routes.pcrPrepareItem.getLink({
              projectId: props.projectId,
              pcrId: props.pcrId,
              itemId: props.itemId,
            })}
          >
            {props.content.backToSummary}
          </ACC.BackLink>
        );
        return (
          <ACC.Page
            backLink={backLink}
            pageTitle={<ACC.Projects.Title {...project} />}
            error={editor.error}
            validator={editor.validator}
          >
            <ACC.Section>
              <ACC.Renderers.SimpleString>{props.content.remainingGrantInfoIntro}</ACC.Renderers.SimpleString>
              <ACC.Renderers.SimpleString>{props.content.remainingGrantInfoCheckRules}</ACC.Renderers.SimpleString>
              <ACC.Renderers.SimpleString>{props.content.remainingGrantInfoRemainingGrant}</ACC.Renderers.SimpleString>
              <ACC.Renderers.SimpleString>{props.content.remainingGrantInfoFundingLevel}</ACC.Renderers.SimpleString>
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
                      footer={<ACC.Renderers.Currency value={editor.data.originalRemainingCosts} />}
                    />

                    <VirementTable.Currency
                      qa="remainingGrant"
                      header={props.content.partnerOriginalRemainingGrant}
                      value={x => x.virement.originalRemainingGrant}
                      footer={<ACC.Renderers.Currency value={editor.data.originalRemainingGrant} />}
                    />

                    <VirementTable.Percentage
                      qa="fundingLevel"
                      header={props.content.originalFundingLevel}
                      value={x => x.virement.originalFundingLevel}
                      footer={<ACC.Renderers.Percentage value={editor.data.originalFundingLevel} />}
                      isDivider="normal"
                    />

                    <VirementTable.Currency
                      qa="newCosts"
                      header={props.content.partnerNewRemainingCosts}
                      value={x => x.virement.newRemainingCosts}
                      footer={<ACC.Renderers.Currency value={editor.data.newRemainingCosts} />}
                    />

                    <VirementTable.Custom
                      qa="newGrant"
                      header={props.content.partnerNewRemainingGrant}
                      value={x => (
                        <>
                          <ACC.ValidationError
                            overrideMessage={`Invalid grant for ${x.partner.name}`}
                            error={x.validator && x.validator.newRemainingGrant}
                          />
                          <ACC.Inputs.NumberInput
                            name={x.virement.partnerId}
                            value={x.virement.newRemainingGrant}
                            onChange={val => updateValue(x.partner, val)}
                            width="full"
                            ariaLabel={x.partner.name}
                            disabled={editor.status === EditorStatus.Saving}
                          />
                        </>
                      )}
                      footer={
                        <>
                          <ACC.ValidationError error={editor.validator.newRemainingGrant} />
                          <ACC.Renderers.Currency value={editor.data.newRemainingGrant} />
                        </>
                      }
                      classSuffix="numeric"
                    />
                    <VirementTable.Percentage
                      qa="newLevel"
                      header={props.content.newFundingLevel}
                      value={x => x.virement.newFundingLevel}
                      footer={<ACC.Renderers.Percentage value={editor.data.newFundingLevel} />}
                    />
                  </VirementTable.Table>
                </VirementForm.Fieldset>
                <VirementForm.Fieldset>
                  <VirementForm.Submit>{props.content.saveButton}</VirementForm.Submit>
                </VirementForm.Fieldset>
              </VirementForm.Form>
            </ACC.Section>
          </ACC.Page>
        );
      }}
    />
  );
}

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
    projectId: route.params.projectId,
    pcrId: route.params.pcrId,
    itemId: route.params.itemId,
  }),
  getTitle: ({ content }) => content.financialVirementEditPartnerLevel.title(),
});
