import * as ACC from "@ui/components";
import { Pending } from "@shared/pending";
import { ClaimDetailsDto, ClaimLineItemDto, ForecastDetailsDTO, ProjectDto, ProjectRole } from "@framework/types";
import { EditorStatus, IEditorStore, StoresConsumer } from "@ui/redux";
import { BaseProps, ContainerBaseWithState, ContainerProps, defineRoute } from "@ui/containers/containerBase";
import { UL } from "@ui/components";
import { ClaimDetailsValidator, ClaimLineItemDtoValidator } from "@ui/validators/claimDetailsValidator";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { range } from "@shared/range";
import { projectCompetition } from "@ui/hooks";
import { Content } from "@content/content";
import { CostCategoryName } from "@framework/entities";
import { diffAsPercentage } from "@framework/util/numberHelper";

export interface EditClaimDetailsParams {
  projectId: string;
  partnerId: string;
  costCategoryId: string;
  periodId: number;
}

export interface EditClaimLineItemsData {
  project: Pending<ProjectDto>;
  claimDetails: Pending<ClaimDetailsDto>;
  costCategories: Pending<CostCategoryDto[]>;
  editor: Pending<IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>>;
  forecastDetail: Pending<ForecastDetailsDTO>;
  documents: Pending<DocumentSummaryDto[]>;
}

interface CombinedData {
  project: ProjectDto;
  claimDetails: ClaimDetailsDto;
  costCategories: CostCategoryDto[];
  forecastDetail: ForecastDetailsDTO;
  documents: DocumentSummaryDto[];
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>;
}

export interface EditClaimLineItemsCallbacks {
  onUpdate: (saving: boolean, dto: ClaimDetailsDto, goToUpdload?: boolean) =>  void;
}

export class EditClaimLineItemsComponent extends ContainerBaseWithState<EditClaimDetailsParams, EditClaimLineItemsData, EditClaimLineItemsCallbacks, { showAddRemove: boolean }> {
  constructor(props: ContainerProps<EditClaimDetailsParams, EditClaimLineItemsData, EditClaimLineItemsCallbacks>) {
    super(props);
    this.state = { showAddRemove: false };
  }

  componentDidMount() {
    this.setState({ showAddRemove: true });
  }

  public render() {
    const combined = Pending.combine({
      project: this.props.project,
      claimDetails: this.props.claimDetails,
      costCategories: this.props.costCategories,
      forecastDetail: this.props.forecastDetail,
      documents: this.props.documents,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={(data) => this.renderContents(data)} />;
  }

  private renderContents({ project, costCategories, documents, forecastDetail, claimDetails, editor }: CombinedData) {
    const back = this.props.routes.prepareClaim.getLink({ projectId: project.id, partnerId: this.props.partnerId, periodId: this.props.periodId });
    const costCategory = costCategories.find(x => x.id === this.props.costCategoryId)! || {};

    const { isKTP, isCombinationOfSBRI } = projectCompetition(project.competitionType);
    const editClaimLineItemGuidance = <ACC.Content value={(x) => x.claimDocuments.messages.editClaimLineItemGuidance} />;

    const editClaimLineItemVat = (
      <>
        <ACC.Renderers.SimpleString qa="vat-registered">
          <ACC.Content value={x => x.claimDocuments.messages.editClaimLineItemVatRegistered} />
        </ACC.Renderers.SimpleString>
        <ACC.Renderers.SimpleString qa="vat-contact-mo">
          <ACC.Content value={x => x.claimDocuments.messages.editClaimLineItemContactMo} />
        </ACC.Renderers.SimpleString>
      </>
    );

    const isOtherCosts = costCategory.name === CostCategoryName.Other_Costs;
    const isVAT = costCategory.name === CostCategoryName.VAT;

    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={back}>
            <ACC.Content value={x => x.editClaimLineItems.backLink} />
          </ACC.BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title {...project} />}
      >
        {this.renderNegativeClaimWarning(editor.data)}

        <>
          {isCombinationOfSBRI ? (
            <>
              {isOtherCosts && (
                <>
                  <ACC.Renderers.SimpleString qa="other-costs-guidance-message">
                    <ACC.Content value={x => x.claimDocuments.messages.editClaimLineItemOtherCostsTotal} />
                  </ACC.Renderers.SimpleString>
                  {editClaimLineItemVat}
                </>
              )}
              {isVAT && editClaimLineItemVat}
            </>
          ) : (
            !isKTP && (
              <ACC.Renderers.SimpleString qa="guidance-message">{editClaimLineItemGuidance}</ACC.Renderers.SimpleString>
            )
          )}
          <ACC.Renderers.SimpleString qa="guidance-currency-message">
            <ACC.Content value={x => x.claimDocuments.messages.editClaimLineItemCurrencyGbp} />
          </ACC.Renderers.SimpleString>
        </>

        <ACC.Section>
          {costCategory.hintText && <ACC.TextHint>{costCategory.hintText}</ACC.TextHint>}
          {costCategory.isCalculated
            ? this.renderCalculated(
                costCategory,
                claimDetails,
                forecastDetail,
                documents,
                editor,
                project.competitionType,
              )
            : this.renderTable(editor, forecastDetail, documents, project.competitionType)}
        </ACC.Section>
      </ACC.Page>
    );
  }

  private renderCalculated(costCategory: CostCategoryDto, claimDetails: ClaimDetailsDto, forecastDetail: ForecastDetailsDTO, documents: DocumentSummaryDto[], editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>, competitionType: string ) {
    const mockItems: ClaimLineItemDto[] = [{
      costCategoryId: costCategory.id,
      description: costCategory.name,
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      id: "",
      value: claimDetails.value,
      lastModifiedDate: new Date()
    }];

    const LineItemForm = ACC.TypedForm<ClaimDetailsDto>();
    const LineItemTable = ACC.TypedTable<ClaimLineItemDto>();
    const supportingDocumentContent = this.getCompetitionRenderCalculatedDocumentSection(competitionType, documents, editor);

    return (
      <LineItemForm.Form
        editor={editor}
        onSubmit={() => this.props.onUpdate(true, editor.data, false)}
        qa="current-claim-summary-form"
      >
        <LineItemForm.Fieldset>
          <LineItemTable.Table
            data={mockItems}
            footers={this.renderFooters(mockItems, forecastDetail, false, editor)}
            qa="current-claim-summary-table"
          >
            <LineItemTable.String headerContent={x => x.editClaimLineItems.descriptionHeader} qa="cost-description" value={(x, i) => x.description} />
            <LineItemTable.ShortDate headerContent={x => x.editClaimLineItems.lastUpdatedHeader} qa="cost-last-updated" value={(x, i) => x.lastModifiedDate} />
            <LineItemTable.Currency headerContent={x => x.editClaimLineItems.costHeader} qa="cost-value" value={(x, i) => x.value} width={30} />
          </LineItemTable.Table>
        </LineItemForm.Fieldset>
        {supportingDocumentContent}
        <LineItemForm.Submit><ACC.Content value={x => x.editClaimLineItems.saveAndReturnButton}/></LineItemForm.Submit>
      </LineItemForm.Form>
    );

  }

  private renderTable(editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>, forecastDetail: ForecastDetailsDTO, documents: DocumentSummaryDto[], competitionType: string ) {
    const LineItemForm = ACC.TypedForm<ClaimDetailsDto>();
    const LineItemTable = ACC.TypedTable<ClaimLineItemDto>();
    const validationResults = editor.validator.items.results;

    const documentSection = this.getCompetitionRenderTableDocumentContent(competitionType, documents, editor);

    return (
      <LineItemForm.Form
        editor={editor}
        onSubmit={() => this.props.onUpdate(true, editor.data, false)}
        qa="current-claim-summary-form"
      >
        <LineItemForm.Hidden name="itemCount" value={x => x.lineItems.length} />
        <LineItemForm.Fieldset>
          <LineItemTable.Table
            data={editor.data.lineItems}
            validationResult={validationResults}
            footers={this.renderFooters(editor.data.lineItems, forecastDetail, this.state.showAddRemove, editor)}
            qa="current-claim-summary-table"
          >
            <LineItemTable.Custom headerContent={x => x.editClaimLineItems.descriptionHeader} qa="cost-description" value={(x, i) => this.renderDescription(x, i, validationResults[i.row], editor)} />
            <LineItemTable.Custom headerContent={x => x.editClaimLineItems.costHeader} qa="cost-value" classSuffix="numeric" value={(x, i) => this.renderCost(x, i, validationResults[i.row], editor)} width={30} />
            <LineItemTable.ShortDate headerContent={x => x.editClaimLineItems.lastUpdatedHeader} qa="cost-last-updated" value={x => x.lastModifiedDate} />
            {this.state.showAddRemove ?
              <LineItemTable.Custom headerContent={x => x.editClaimLineItems.actionHeader} hideHeader qa="remove" value={(x, i) => <a href="" className="govuk-link" role="button" onClick={e => this.removeItem(x, i, e, editor)}><ACC.Content value={y => y.editClaimLineItems.removeButton}/></a>} width={1}/>
              : null}
          </LineItemTable.Table>
        </LineItemForm.Fieldset>
        {documentSection}
        <LineItemForm.Submit><ACC.Content value={x => x.editClaimLineItems.saveAndReturnButton}/></LineItemForm.Submit>
      </LineItemForm.Form>
    );
  }

  private getCompetitionRenderCalculatedDocumentSection(competitionType: string, documents: DocumentSummaryDto[], editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>) {
    const { isKTP, isCombinationOfSBRI } = projectCompetition(competitionType);

    const LineItemForm = ACC.TypedForm<ClaimDetailsDto>();

    return !isKTP && (
      <>
        <LineItemForm.Fieldset>{this.renderDocuments(documents, isCombinationOfSBRI)}</LineItemForm.Fieldset>
        <LineItemForm.Fieldset>
          <LineItemForm.Button name="upload" onClick={() => this.props.onUpdate(true, editor.data, true)}>
            <ACC.Content value={x => x.editClaimLineItems.uploadAndRemoveDocumentsButton} />
          </LineItemForm.Button>
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset
          headingContent={x => x.editClaimLineItems.additionalInformationHeading}
          qa="additional-info-form"
          headingQa="additional-info-heading"
        >
          <LineItemForm.MultilineString
            label={<ACC.Content value={x => x.editClaimLineItems.additionalInfo} />}
            hintContent={this.getHintContent(isKTP, isCombinationOfSBRI)}
            labelHidden
            name="comments"
            value={() => editor.data.comments}
            update={(dto, v) => (dto.comments = v)}
            qa="info-text-area"
          />
        </LineItemForm.Fieldset>
      </>
    );
  }

  private getCompetitionRenderTableDocumentContent(
    competitionType: string,
    documents: DocumentSummaryDto[],
    editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  ) {
    const LineItemForm = ACC.TypedForm<ClaimDetailsDto>();
    const { isKTP, isCombinationOfSBRI } = projectCompetition(competitionType);

    return !isKTP && (
      <>
        <LineItemForm.Fieldset>{this.renderDocuments(documents, isCombinationOfSBRI)}</LineItemForm.Fieldset>
        <LineItemForm.Fieldset>
          <LineItemForm.Button name="upload" onClick={() => this.props.onUpdate(true, editor.data, true)}>
            <ACC.Content value={x => x.editClaimLineItems.uploadAndRemoveDocumentsButton} />
          </LineItemForm.Button>
        </LineItemForm.Fieldset>
        <LineItemForm.Fieldset
          headingContent={x => x.editClaimLineItems.additionalInformationHeading}
          qa="additional-info-form"
          headingQa="additional-info-heading"
        >
          <LineItemForm.MultilineString
            label={<ACC.Content value={x => x.editClaimLineItems.additionalInfo} />}
            hintContent={this.getHintContent(isKTP, isCombinationOfSBRI)}
            labelHidden
            name="comments"
            value={() => editor.data.comments}
            update={(data, v) => (editor.data.comments = v)}
            qa="info-text-area"
          />
        </LineItemForm.Fieldset>
      </>
    );
  }

  private getHintContent(isKTP: boolean, isCombinationOfSBRI: boolean) {
    if (!isKTP && !isCombinationOfSBRI) {
      return (x: Content) => x.editClaimLineItems.additionalInformationHint;
    } else if (isCombinationOfSBRI) {
      return (x: Content) => x.editClaimLineItems.sbriAdditionalInformationHint;
    } else {
      return undefined;
    }
  }

  private renderDocuments(documents: DocumentSummaryDto[], isCombinationOfSBRI: boolean) {
    return (
      <ACC.Section titleContent={x => x.editClaimLineItems.supportingDocumentsHeader} qa="supporting-documents-section">
        {isCombinationOfSBRI ? (
          <>
            <ACC.Renderers.SimpleString>
              <ACC.Content value={x => x.editClaimLineItems.messages.editClaimLineItemUploadEvidence} />
            </ACC.Renderers.SimpleString>
            <ACC.Renderers.SimpleString>
              <ACC.Content value={x => x.editClaimLineItems.messages.editClaimLineItemClaimDocuments} />
            </ACC.Renderers.SimpleString>
            <ACC.Renderers.SimpleString>
              <ACC.Content value={x => x.editClaimLineItems.messages.editClaimLineItemContactMo} />
            </ACC.Renderers.SimpleString>
          </>
        ) : (
          <ACC.Renderers.SimpleString>
            <ACC.Content value={x => x.editClaimLineItems.messages.editClaimLineItemDocumentGuidance} />
          </ACC.Renderers.SimpleString>
        )}

        {!!documents.length && (
          <ACC.Renderers.SimpleString>
            <ACC.Content value={x => x.editClaimLineItems.documentMessages.newWindow} />
          </ACC.Renderers.SimpleString>
        )}

        <ACC.DocumentView documents={documents} />
      </ACC.Section>
    );
  }

  renderCost(item: ClaimLineItemDto, index: { column: number; row: number }, validation: ClaimLineItemDtoValidator, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>) {
    return (
      <span>
        <ACC.ValidationError error={validation.cost} />
        <ACC.Inputs.NumberInput
          name={`value${index.row}`}
          value={item.value}
          disabled={editor.status === EditorStatus.Saving}
          onChange={val => this.updateItem(index, editor, dto => dto.value = val!)}
          ariaLabel={`value of claim line item ${index.row + 1}`}
        />
      </span>
    );
  }

  private renderNegativeClaimWarning(editor: ClaimDetailsDto) {
    const errorItems = editor.lineItems.reduce<string[]>((acc, i) => (i.value < 0 ? [...acc, i.description] : acc), []);

    if (!errorItems.length) return null;

    const errorItemsList = errorItems.map(costCategory => <li key={costCategory}>{costCategory}</li>);
    const markup = (
      <>
        <ACC.Renderers.SimpleString>
          <ACC.Content value={content => content.editClaimLineItems.messages.negativeClaimWarning} />
        </ACC.Renderers.SimpleString>

        <UL>{errorItemsList}</UL>
      </>
    );

    return <ACC.ValidationMessage messageType="info" qa="claim-warning" message={markup} />;
  }

  renderDescription(item: ClaimLineItemDto, index: { column: number; row: number }, validation: ClaimLineItemDtoValidator, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>) {
    return (
      <span>
        <ACC.ValidationError error={validation.description} />
        <input type="hidden" name={`id${index.row}`} value={item.id} />
        <ACC.Inputs.TextInput
          name={`description${index.row}`}
          value={item.description}
          disabled={editor.status === EditorStatus.Saving}
          onChange={val => this.updateItem(index, editor, dto => dto.description = val!)}
          ariaLabel={`description of claim line item ${index.row + 1}`}
        />
      </span>
    );
  }

  removeItem(item: ClaimLineItemDto, i: { column: number; row: number }, e: React.SyntheticEvent<HTMLAnchorElement>, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>) {
    e.preventDefault();
    const dto = editor.data;
    dto.lineItems.splice(i.row, 1);
    this.props.onUpdate(false, dto);
  }

  addItem(e: React.SyntheticEvent<HTMLAnchorElement>, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>) {
    e.preventDefault();
    const dto = editor.data;
    dto.lineItems.push({
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId
    } as ClaimLineItemDto);
    this.props.onUpdate(false, dto);
  }

  updateItem(i: { column: number; row: number }, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>, update: (item: ClaimLineItemDto) => void) {
    const dto = editor.data;
    update(dto.lineItems[i.row]);
    this.props.onUpdate(false, dto);
  }

  private renderFooters(data: ClaimLineItemDto[], forecastDetail: ForecastDetailsDTO, showAddRemove: boolean, editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>) {
    const total = data.reduce((t, item) => t + (item.value || 0), 0);
    // @TODO remove multiply by 100
    const forecast = forecastDetail.value;
    const diff = diffAsPercentage(forecast, total);

    const footers: JSX.Element[] = [];

    if (showAddRemove) {
      footers.push(
        <tr key={1} className="govuk-table__row">
          <td className="govuk-table__cell" colSpan={4}><a href="" className="govuk-link" role="button" onClick={(e) => this.addItem(e, editor)} data-qa="add-cost"><ACC.Content value={x => x.editClaimLineItems.addCost}/></a></td>
        </tr>
      );
    }

    footers.push(
      <tr key={2} className="govuk-table__row">
        <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"><ACC.Content value={x => x.editClaimLineItems.totalCosts}/></td>
        <td className="govuk-table__cell govuk-table__cell--numeric"><ACC.Renderers.Currency value={total} /></td>
        <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText><ACC.Content value={x => x.editClaimLineItems.noData}/></ACC.Renderers.AccessibilityText></td>
        {showAddRemove ? <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText><ACC.Content value={x => x.editClaimLineItems.noData}/></ACC.Renderers.AccessibilityText></td> : null}
      </tr>
    );

    footers.push(
      <tr key={3} className="govuk-table__row">
        <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"><ACC.Content value={x => x.editClaimLineItems.forecastCosts}/></td>
        <td className="govuk-table__cell govuk-table__cell--numeric"><ACC.Renderers.Currency value={forecast} /></td>
        <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText><ACC.Content value={x => x.editClaimLineItems.noData}/></ACC.Renderers.AccessibilityText></td>
        {showAddRemove ? <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText><ACC.Content value={x => x.editClaimLineItems.noData}/></ACC.Renderers.AccessibilityText></td> : null}
      </tr>
    );

    if (forecast > 0) {
      footers.push(
        <tr key={4} className="govuk-table__row">
          <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold"><ACC.Content value={x => x.editClaimLineItems.difference}/></td>
          <td className="govuk-table__cell govuk-table__cell--numeric"><ACC.Renderers.Percentage value={diff} /></td>
          <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText><ACC.Content value={x => x.editClaimLineItems.noData}/></ACC.Renderers.AccessibilityText></td>
          {showAddRemove ? <td className="govuk-table__cell"><ACC.Renderers.AccessibilityText><ACC.Content value={x => x.editClaimLineItems.noData}/></ACC.Renderers.AccessibilityText></td> : null}
        </tr>
      );
    }

    return footers;
  }

}

const getDestination = (props: EditClaimDetailsParams & BaseProps, goToUpload: boolean|undefined) => {
  if(goToUpload) {
    return props.routes.claimDetailDocuments.getLink({projectId: props.projectId, partnerId: props.partnerId, periodId: props.periodId, costCategoryId: props.costCategoryId});
  } else {
    return props.routes.prepareClaim.getLink({projectId: props.projectId, partnerId: props.partnerId, periodId: props.periodId});
  }
};

const EditClaimLineItemsContainer = (props: EditClaimDetailsParams & BaseProps) => (
  <StoresConsumer>
    {
      stores => (
        <EditClaimLineItemsComponent
          project={stores.projects.getById(props.projectId)}
          claimDetails={stores.claimDetails.get(props.projectId, props.partnerId, props.periodId, props.costCategoryId)}
          costCategories={stores.costCategories.getAllFiltered(props.partnerId)}
          forecastDetail={stores.forecastDetails.get(props.partnerId, props.periodId, props.costCategoryId)}
          documents={stores.claimDetailDocuments.getClaimDetailDocuments(props.projectId, props.partnerId, props.periodId, props.costCategoryId)}
          editor={stores.claimDetails.getClaimDetailsEditor(props.projectId, props.partnerId, props.periodId, props.costCategoryId, (dto: ClaimDetailsDto) => {
            if (props.isClient) return;
            const itemsNumber = dto.lineItems.length;
            // Add extra rows. If existing items are less than 7 then add up to ten rows in total otherwise add extra 3.
            const extraRows = itemsNumber <= 7 ? 10 - itemsNumber : 3;
            const extraLineItems: ClaimLineItemDto[] = range(extraRows).map(() => ({
              costCategoryId: props.costCategoryId,
              partnerId: props.partnerId,
              periodId: props.periodId,
              id: "",
              description: "",
              value: null as any,
              lastModifiedDate: null as any
            }));
            dto.lineItems.push(...extraLineItems);
          })}
          onUpdate={(saving, dto, goToUpload) => stores.claimDetails.updateClaimDetailsEditor(saving, props.projectId, props.partnerId, props.periodId, props.costCategoryId, dto, () => stores.navigation.navigateTo(getDestination(props, goToUpload)))}
          {...props}
        />
      )
    }
  </StoresConsumer>
);

export const EditClaimLineItemsRoute = defineRoute({
  routeName: "claimLineItemEdit",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/costs/:costCategoryId",
  container: EditClaimLineItemsContainer,
  getParams: (route) => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    costCategoryId: route.params.costCategoryId,
    periodId: parseInt(route.params.periodId, 10)
  }),
  accessControl: (auth, params) => auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ params, stores }) => {
    const costCatName =  stores.costCategories.get(params.costCategoryId).then(x => x.name).data;
    return {
      htmlTitle: costCatName ? `Add costs for ${costCatName}` : "Add costs",
      displayTitle: costCatName || "Costs"
    };
  },
});
