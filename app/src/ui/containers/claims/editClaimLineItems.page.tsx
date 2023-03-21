/* eslint-disable jsx-a11y/anchor-is-valid */ // TODO: ACC-7889
import type { ContentSelector } from "@copy/type";
import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import {
  ClaimDetailsDto,
  ClaimLineItemDto,
  CostCategoryType,
  ForecastDetailsDTO,
  ProjectDto,
  ProjectRole,
} from "@framework/types";
import { diffAsPercentage, sumBy } from "@framework/util/numberHelper";
import { Pending } from "@shared/pending";
import { range } from "@shared/range";
import * as ACC from "@ui/components";
import { AwardRateOverridesMessage } from "@ui/components/claims/AwardRateOverridesMessage";
import { createTypedForm, createTypedTable, UL } from "@ui/components";
import { EditorStatus } from "@ui/constants/enums";
import { BaseProps, ContainerBaseWithState, ContainerProps, defineRoute } from "@ui/containers/containerBase";
import { MountedHoc, useMounted } from "@ui/features";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import { IEditorStore, useStores } from "@ui/redux";
import { ClaimDetailsValidator, ClaimLineItemDtoValidator } from "@ui/validators/claimDetailsValidator";
import { useNavigate } from "react-router-dom";
import { useClientOptionsQuery } from "@gql/hooks/useSiteOptionsQuery";

export interface EditClaimDetailsParams {
  projectId: string;
  partnerId: string;
  costCategoryId: string;
  periodId: number;
}

export interface EditClaimLineItemsData {
  project: Pending<ProjectDto>;
  claimDetails: Pending<ClaimDetailsDto>;
  claimOverrides: Pending<ClaimOverrideRateDto>;
  costCategories: Pending<CostCategoryDto[]>;
  editor: Pending<IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>>;
  forecastDetail: Pending<ForecastDetailsDTO>;
  documents: Pending<DocumentSummaryDto[]>;
  maxClaimLineItems: number;
}

interface CombinedData {
  project: ProjectDto;
  claimDetails: ClaimDetailsDto;
  claimOverrides: ClaimOverrideRateDto;
  costCategories: CostCategoryDto[];
  forecastDetail: ForecastDetailsDTO;
  documents: DocumentSummaryDto[];
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>;
}

export interface EditClaimLineItemsCallbacks {
  onUpdate: (saving: boolean, dto: ClaimDetailsDto, goToUpload?: boolean) => void;
}

const LineItemForm = createTypedForm<ClaimDetailsDto>();
const LineItemTable = createTypedTable<ClaimLineItemDto>();

const DeleteByEnteringZero = () => (
  <ACC.ValidationMessage
    messageType="info"
    qa="claim-warning"
    message={<ACC.Content value={x => x.pages.editClaimLineItems.setToZeroToRemove} />}
  />
);

export class EditClaimLineItemsComponent extends ContainerBaseWithState<
  EditClaimDetailsParams,
  EditClaimLineItemsData,
  EditClaimLineItemsCallbacks,
  { showAddRemove: boolean }
> {
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
      claimOverrides: this.props.claimOverrides,
      costCategories: this.props.costCategories,
      forecastDetail: this.props.forecastDetail,
      documents: this.props.documents,
      editor: this.props.editor,
    });

    return <ACC.PageLoader pending={combined} render={data => this.renderContents(data)} />;
  }

  private renderContents({
    project,
    costCategories,
    documents,
    forecastDetail,
    claimOverrides,
    claimDetails,
    editor,
  }: CombinedData) {
    const back = this.props.routes.prepareClaim.getLink({
      projectId: project.id,
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
    });
    const costCategory = costCategories.find(x => x.id === this.props.costCategoryId) || ({} as CostCategoryDto);

    const { isKTP, isCombinationOfSBRI } = checkProjectCompetition(project.competitionType);
    const editClaimLineItemGuidance = <ACC.Content value={x => x.claimsMessages.editClaimLineItemGuidance} />;

    const editClaimLineItemVat = (
      <>
        <ACC.Renderers.SimpleString qa="vat-registered">
          <ACC.Content value={x => x.claimsMessages.editClaimLineItemVatRegistered} />
        </ACC.Renderers.SimpleString>
        <ACC.Renderers.SimpleString qa="vat-contact-mo">
          <ACC.Content value={x => x.claimsMessages.editClaimLineItemContactMo} />
        </ACC.Renderers.SimpleString>
      </>
    );

    const isOtherCosts = costCategory.type === CostCategoryType.Other_Costs;
    const isVAT = costCategory.type === CostCategoryType.VAT;

    return (
      <ACC.Page
        backLink={
          <ACC.BackLink route={back}>
            <ACC.Content value={x => x.pages.editClaimLineItems.backLink} />
          </ACC.BackLink>
        }
        error={editor.error}
        validator={editor.validator}
        pageTitle={<ACC.Projects.Title {...project} heading={costCategory.name} />}
      >
        <AwardRateOverridesMessage
          claimOverrides={claimOverrides}
          currentCostCategoryId={costCategory.id}
          isNonFec={project.isNonFec}
        />
        {this.renderNegativeClaimWarning(editor.data)}
        {(!claimDetails.isAuthor || editor.data.lineItems.some(x => !x.isAuthor)) && <DeleteByEnteringZero />}

        <>
          {isCombinationOfSBRI ? (
            <>
              {isOtherCosts && (
                <>
                  <ACC.Renderers.SimpleString qa="other-costs-guidance-message">
                    <ACC.Content value={x => x.claimsMessages.editClaimLineItemOtherCostsTotalCosts} />
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
            <MountedHoc>
              {y => (
                <ACC.Content
                  value={x =>
                    y.isClient
                      ? x.claimsMessages.editClaimLineItemConvertGbp
                      : x.claimsMessages.nonjsEditClaimLineItemConvertGbp
                  }
                />
              )}
            </MountedHoc>
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

  private renderCalculated(
    costCategory: CostCategoryDto,
    claimDetails: ClaimDetailsDto,
    forecastDetail: ForecastDetailsDTO,
    documents: DocumentSummaryDto[],
    editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
    competitionType: string,
  ) {
    const mockItems: ClaimLineItemDto[] = [
      {
        costCategoryId: costCategory.id,
        description: costCategory.name,
        partnerId: this.props.partnerId,
        periodId: this.props.periodId,
        id: "",
        value: claimDetails.value,
        lastModifiedDate: new Date(),
        isAuthor: true,
      },
    ];

    const supportingDocumentContent = this.getCompetitionRenderCalculatedDocumentSection(
      competitionType,
      documents,
      editor,
    );

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
            <LineItemTable.String
              header={x => x.pages.editClaimLineItems.headerDescription}
              qa="cost-description"
              value={x => x.description}
            />
            <LineItemTable.ShortDate
              header={x => x.pages.editClaimLineItems.headerLastUpdated}
              qa="cost-last-updated"
              value={x => x.lastModifiedDate}
            />
            <LineItemTable.Currency
              header={x => x.pages.editClaimLineItems.headerCost}
              qa="cost-value"
              value={x => x.value}
              width={30}
            />
          </LineItemTable.Table>
        </LineItemForm.Fieldset>

        {supportingDocumentContent}

        <LineItemForm.Submit>
          <ACC.Content value={x => x.pages.editClaimLineItems.buttonSaveAndReturn} />
        </LineItemForm.Submit>
      </LineItemForm.Form>
    );
  }

  private renderTable(
    editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
    forecastDetail: ForecastDetailsDTO,
    documents: DocumentSummaryDto[],
    competitionType: string,
  ) {
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
            <LineItemTable.Custom
              header={x => x.pages.editClaimLineItems.headerDescription}
              qa="cost-description"
              value={(x, i) => this.renderDescription(x, i, validationResults[i.row], editor)}
            />
            <LineItemTable.Custom
              header={x => x.pages.editClaimLineItems.headerCost}
              qa="cost-value"
              classSuffix="numeric"
              value={(x, i) => this.renderCost(x, i, validationResults[i.row], editor)}
              width={30}
            />
            <LineItemTable.ShortDate
              header={x => x.pages.editClaimLineItems.headerLastUpdated}
              qa="cost-last-updated"
              value={x => x.lastModifiedDate}
            />
            <LineItemTable.Custom
              header={x => x.pages.editClaimLineItems.headerAction}
              hideHeader
              qa="remove"
              value={(x, i) =>
                x.isAuthor && (
                  <a href="" className="govuk-link" role="button" onClick={e => this.removeItem(x, i, e, editor)}>
                    <ACC.Content value={y => y.pages.editClaimLineItems.buttonRemove} />
                  </a>
                )
              }
              width={1}
            />
          </LineItemTable.Table>
        </LineItemForm.Fieldset>

        {documentSection}
        <LineItemForm.Submit>
          <ACC.Content value={x => x.pages.editClaimLineItems.buttonSaveAndReturn} />
        </LineItemForm.Submit>
      </LineItemForm.Form>
    );
  }

  private getCompetitionRenderCalculatedDocumentSection(
    competitionType: string,
    documents: DocumentSummaryDto[],
    editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  ) {
    const { isKTP, isCombinationOfSBRI } = checkProjectCompetition(competitionType);

    return (
      !isKTP && (
        <>
          <LineItemForm.Fieldset>{this.renderDocuments(documents, isCombinationOfSBRI, editor)}</LineItemForm.Fieldset>

          <LineItemForm.Fieldset
            heading={x => x.pages.editClaimLineItems.headerAdditionalInformation}
            qa="additional-info-form"
            headingQa="additional-info-heading"
            className="govuk-!-margin-top-8"
          >
            <LineItemForm.MultilineString
              label={x => x.pages.editClaimLineItems.additionalInfo}
              hint={this.getHintContent(isKTP, isCombinationOfSBRI)}
              labelHidden
              name="comments"
              value={() => editor.data.comments}
              update={(dto, v) => (dto.comments = v)}
              qa="info-text-area"
            />
          </LineItemForm.Fieldset>
        </>
      )
    );
  }

  private getCompetitionRenderTableDocumentContent(
    competitionType: string,
    documents: DocumentSummaryDto[],
    editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  ) {
    const { isKTP, isCombinationOfSBRI } = checkProjectCompetition(competitionType);

    return (
      !isKTP && (
        <>
          <LineItemForm.Fieldset>{this.renderDocuments(documents, isCombinationOfSBRI, editor)}</LineItemForm.Fieldset>

          <LineItemForm.Fieldset
            heading={x => x.pages.editClaimLineItems.headerAdditionalInformation}
            qa="additional-info-form"
            headingQa="additional-info-heading"
            className="govuk-!-margin-top-8"
          >
            <LineItemForm.MultilineString
              label={x => x.pages.editClaimLineItems.additionalInfo}
              hint={this.getHintContent(isKTP, isCombinationOfSBRI)}
              labelHidden
              name="comments"
              value={() => editor.data.comments}
              update={(data, v) => (editor.data.comments = v)}
              qa="info-text-area"
            />
          </LineItemForm.Fieldset>
        </>
      )
    );
  }

  private getHintContent(isKTP: boolean, isCombinationOfSBRI: boolean): ContentSelector | undefined {
    if (!isKTP && !isCombinationOfSBRI) {
      return x => x.pages.editClaimLineItems.hintAdditionalInformation;
    } else if (isCombinationOfSBRI) {
      return x => x.pages.editClaimLineItems.sbriHintAdditionalInformation;
    } else {
      return undefined;
    }
  }

  private renderDocuments(
    documents: DocumentSummaryDto[],
    isCombinationOfSBRI: boolean,
    editorData: CombinedData["editor"],
  ) {
    return (
      <>
        <ACC.Section
          title={x => x.pages.editClaimLineItems.headerSupportingDocuments}
          qa="supporting-documents-section"
        >
          {isCombinationOfSBRI ? (
            <>
              <ACC.Renderers.SimpleString>
                <ACC.Content value={x => x.claimsMessages.editClaimLineItemUploadEvidence} />
              </ACC.Renderers.SimpleString>

              <ACC.Renderers.SimpleString>
                <ACC.Content value={x => x.claimsMessages.editClaimLineItemClaimDocuments} />
              </ACC.Renderers.SimpleString>

              <ACC.Renderers.SimpleString>
                <ACC.Content value={x => x.claimsMessages.editClaimLineItemContactMo} />
              </ACC.Renderers.SimpleString>
            </>
          ) : (
            <ACC.Renderers.SimpleString>
              <ACC.Content value={x => x.claimsMessages.editClaimLineItemDocumentGuidance} />
            </ACC.Renderers.SimpleString>
          )}

          <LineItemForm.Button name="upload" onClick={() => this.props.onUpdate(true, editorData.data, true)}>
            <ACC.Content value={x => x.pages.editClaimLineItems.buttonUploadAndRemoveDocuments} />
          </LineItemForm.Button>
        </ACC.Section>

        <ACC.Section>
          <ACC.DocumentView qa="edit-claim-line-items-documents" documents={documents} />
        </ACC.Section>
      </>
    );
  }

  private renderCost(
    item: ClaimLineItemDto,
    index: { column: number; row: number },
    validation: ClaimLineItemDtoValidator,
    editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  ) {
    return (
      <span>
        <ACC.ValidationError error={validation.cost} />
        <ACC.Inputs.NumberInput
          name={`value${index.row}`}
          value={item.value}
          disabled={editor.status === EditorStatus.Saving}
          onChange={val => this.updateItem(index, editor, dto => (dto.value = val as number))}
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
          <ACC.Content value={x => x.claimsMessages.negativeClaimWarning} />
        </ACC.Renderers.SimpleString>

        <UL>{errorItemsList}</UL>
      </>
    );

    return <ACC.ValidationMessage messageType="info" qa="claim-warning" message={markup} />;
  }

  private renderDescription(
    item: ClaimLineItemDto,
    index: { column: number; row: number },
    validation: ClaimLineItemDtoValidator,
    editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  ) {
    return (
      <span>
        <ACC.ValidationError error={validation.description} />
        <input type="hidden" name={`id${index.row}`} value={item.id} />
        <ACC.Inputs.TextInput
          name={`description${index.row}`}
          value={item.description}
          disabled={editor.status === EditorStatus.Saving}
          onChange={val => this.updateItem(index, editor, dto => (dto.description = val as string))}
          ariaLabel={`description of claim line item ${index.row + 1}`}
        />
      </span>
    );
  }

  private removeItem(
    item: ClaimLineItemDto,
    i: { column: number; row: number },
    e: React.SyntheticEvent<HTMLAnchorElement>,
    editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  ) {
    e.preventDefault();
    const dto = editor.data;
    dto.lineItems.splice(i.row, 1);
    this.props.onUpdate(false, dto);
  }

  private addItem(
    e: React.SyntheticEvent<HTMLAnchorElement>,
    editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  ) {
    e.preventDefault();
    const dto = editor.data;
    dto.lineItems.push({
      partnerId: this.props.partnerId,
      periodId: this.props.periodId,
      costCategoryId: this.props.costCategoryId,
      isAuthor: true,
    } as ClaimLineItemDto);
    this.props.onUpdate(false, dto);
  }

  private updateItem(
    i: { column: number; row: number },
    editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
    update: (item: ClaimLineItemDto) => void,
  ) {
    const dto = editor.data;
    update(dto.lineItems[i.row]);
    this.props.onUpdate(false, dto);
  }

  private renderFooters(
    data: ClaimLineItemDto[],
    forecastDetail: ForecastDetailsDTO,
    showAddRemove: boolean,
    editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  ) {
    const total: number = sumBy(data, item => item.value);

    // @TODO remove multiply by 100
    const forecast = forecastDetail.value;
    const diff = diffAsPercentage(forecast, total);
    const lengthWithinBoundary = data.length < this.props.maxClaimLineItems;

    const footers: JSX.Element[] = [];

    if (showAddRemove && lengthWithinBoundary) {
      footers.push(
        <tr key={1} className="govuk-table__row">
          <td className="govuk-table__cell" colSpan={4}>
            <a href="" className="govuk-link" role="button" onClick={e => this.addItem(e, editor)} data-qa="add-cost">
              <ACC.Content value={x => x.pages.editClaimLineItems.addCost} />
            </a>
          </td>
        </tr>,
      );
    }

    footers.push(
      <tr key={2} className="govuk-table__row">
        <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
          <ACC.Content value={x => x.pages.editClaimLineItems.totalCosts} />
        </td>
        <td className="govuk-table__cell govuk-table__cell--numeric">
          <ACC.Renderers.Currency value={total} />
        </td>
        <td className="govuk-table__cell">
          <ACC.Renderers.AccessibilityText>
            <ACC.Content value={x => x.pages.editClaimLineItems.noData} />
          </ACC.Renderers.AccessibilityText>
        </td>
        {showAddRemove ? (
          <td className="govuk-table__cell">
            <ACC.Renderers.AccessibilityText>
              <ACC.Content value={x => x.pages.editClaimLineItems.noData} />
            </ACC.Renderers.AccessibilityText>
          </td>
        ) : null}
      </tr>,
    );

    footers.push(
      <tr key={3} className="govuk-table__row">
        <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
          <ACC.Content value={x => x.pages.editClaimLineItems.forecastCosts} />
        </td>
        <td className="govuk-table__cell govuk-table__cell--numeric">
          <ACC.Renderers.Currency value={forecast} />
        </td>
        <td className="govuk-table__cell">
          <ACC.Renderers.AccessibilityText>
            <ACC.Content value={x => x.pages.editClaimLineItems.noData} />
          </ACC.Renderers.AccessibilityText>
        </td>
        {showAddRemove ? (
          <td className="govuk-table__cell">
            <ACC.Renderers.AccessibilityText>
              <ACC.Content value={x => x.pages.editClaimLineItems.noData} />
            </ACC.Renderers.AccessibilityText>
          </td>
        ) : null}
      </tr>,
    );

    if (forecast > 0) {
      footers.push(
        <tr key={4} className="govuk-table__row">
          <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
            <ACC.Content value={x => x.pages.editClaimLineItems.difference} />
          </td>
          <td className="govuk-table__cell govuk-table__cell--numeric">
            <ACC.Renderers.Percentage value={diff} />
          </td>
          <td className="govuk-table__cell">
            <ACC.Renderers.AccessibilityText>
              <ACC.Content value={x => x.pages.editClaimLineItems.noData} />
            </ACC.Renderers.AccessibilityText>
          </td>
          {showAddRemove ? (
            <td className="govuk-table__cell">
              <ACC.Renderers.AccessibilityText>
                <ACC.Content value={x => x.pages.editClaimLineItems.noData} />
              </ACC.Renderers.AccessibilityText>
            </td>
          ) : null}
        </tr>,
      );
    }

    return footers;
  }
}

const getDestination = (props: EditClaimDetailsParams & BaseProps, goToUpload: boolean | undefined) => {
  if (goToUpload) {
    return props.routes.claimDetailDocuments.getLink({
      projectId: props.projectId,
      partnerId: props.partnerId,
      periodId: props.periodId,
      costCategoryId: props.costCategoryId,
    });
  } else {
    return props.routes.prepareClaim.getLink({
      projectId: props.projectId,
      partnerId: props.partnerId,
      periodId: props.periodId,
    });
  }
};

const EditClaimLineItemsContainer = (props: EditClaimDetailsParams & BaseProps) => {
  const stores = useStores();
  const { isClient } = useMounted();
  const navigate = useNavigate();
  const { data } = useClientOptionsQuery();

  return (
    <EditClaimLineItemsComponent
      {...props}
      project={stores.projects.getById(props.projectId)}
      claimDetails={stores.claimDetails.get(props.projectId, props.partnerId, props.periodId, props.costCategoryId)}
      costCategories={stores.costCategories.getAllFiltered(props.partnerId)}
      forecastDetail={stores.forecastDetails.get(props.partnerId, props.periodId, props.costCategoryId)}
      claimOverrides={stores.claimOverrides.getAllByPartner(props.partnerId)}
      documents={stores.claimDetailDocuments.getClaimDetailDocuments(
        props.projectId,
        props.partnerId,
        props.periodId,
        props.costCategoryId,
      )}
      editor={stores.claimDetails.getClaimDetailsEditor(
        props.projectId,
        props.partnerId,
        props.periodId,
        props.costCategoryId,
        (dto: ClaimDetailsDto) => {
          if (isClient) return;
          const currentItemsLength = dto.lineItems.length;
          const maximumItemsLength = data.clientConfig.options.nonJsMaxClaimLineItems;
          const extraRows = maximumItemsLength - currentItemsLength;

          const extraLineItems: ClaimLineItemDto[] = range(extraRows).map(() => ({
            costCategoryId: props.costCategoryId,
            partnerId: props.partnerId,
            periodId: props.periodId,
            id: "",
            description: "",
            value: null as unknown as number,
            lastModifiedDate: null as unknown as Date,
            isAuthor: true,
          }));
          dto.lineItems.push(...extraLineItems);
        },
      )}
      onUpdate={(saving, dto, goToUpload) =>
        stores.claimDetails.updateClaimDetailsEditor(
          saving,
          props.projectId,
          props.partnerId,
          props.periodId,
          props.costCategoryId,
          dto,
          () => navigate(getDestination(props, goToUpload).path),
        )
      }
      maxClaimLineItems={data.clientConfig.options.maxClaimLineItems} // TODO when this is refactored to a function component, we can replace this param with useStores inside the component
    />
  );
};

export const EditClaimLineItemsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "claimLineItemEdit",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/costs/:costCategoryId",
  container: EditClaimLineItemsContainer,
  getParams: route => ({
    projectId: route.params.projectId,
    partnerId: route.params.partnerId,
    costCategoryId: route.params.costCategoryId,
    periodId: parseInt(route.params.periodId, 10),
  }),
  accessControl: (auth, params) =>
    auth.forPartner(params.projectId, params.partnerId).hasRole(ProjectRole.FinancialContact),
  getTitle: ({ params, stores }) => {
    const costCatName = stores.costCategories.get(params.costCategoryId).then(x => x.name).data;
    return {
      htmlTitle: costCatName ? `Add costs for ${costCatName}` : "Add costs",
      displayTitle: costCatName || "Costs",
    };
  },
});
