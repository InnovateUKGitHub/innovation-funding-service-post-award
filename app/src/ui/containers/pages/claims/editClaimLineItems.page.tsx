/* eslint-disable jsx-a11y/anchor-is-valid */ // TODO: ACC-7889
import type { ContentSelector } from "@copy/type";
import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { diffAsPercentage, sumBy } from "@framework/util/numberHelper";
import { Pending } from "@shared/pending";
import { range } from "@shared/range";
import { AwardRateOverridesMessage } from "@ui/components/atomicDesign/organisms/claims/AwardRateOverridesMessage/AwardRateOverridesMessage.withFragment";
import { EditorStatus } from "@ui/redux/constants/enums";
import { BaseProps, defineRoute } from "@ui/containers/containerBase";
import { checkProjectCompetition } from "@ui/helpers/check-competition-type";
import {
  ClaimDetailsValidator,
  ClaimLineItemDtoValidator,
  claimDetailsCommentsMaxLength,
} from "@ui/validation/validators/claimDetailsValidator";
import { useNavigate } from "react-router-dom";
import { CostCategoryType } from "@framework/constants/enums";
import { ProjectRole } from "@framework/constants/project";
import { ClaimDetailsDto } from "@framework/dtos/claimDetailsDto";
import { ClaimLineItemDto } from "@framework/dtos/claimLineItemDto";
import { ProjectDto } from "@framework/dtos/projectDto";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { DocumentView } from "@ui/components/atomicDesign/organisms/documents/DocumentView/DocumentView";
import { createTypedForm } from "@ui/components/bjss/form/form";
import { UL } from "@ui/components/atomicDesign/atoms/List/list";
import { Page } from "@ui/components/bjss/Page/page";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { TextHint } from "@ui/components/atomicDesign/molecules/TextHint/textHint";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PageLoader } from "@ui/components/bjss/loading";
import { Title } from "@ui/components/atomicDesign/organisms/projects/ProjectTitle/title";
import { AccessibilityText } from "@ui/components/atomicDesign/atoms/AccessibilityText/AccessibilityText";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { createTypedTable } from "@ui/components/atomicDesign/molecules/Table/Table";
import { ValidationMessage } from "@ui/components/atomicDesign/molecules/validation/ValidationMessage/ValidationMessage";
import { MountedHoc, useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { IEditorStore } from "@ui/redux/reducers/editorsReducer";
import { useStores } from "@ui/redux/storesProvider";
import { ValidationError } from "@ui/components/atomicDesign/molecules/validation/ValidationError/validationError";
import { NumberInput } from "@ui/components/bjss/inputs/numberInput";
import { TextInput } from "@ui/components/bjss/inputs/textInput";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { useEditClaimLineItemsData } from "./editClaimLineItems.logic";

export interface EditClaimDetailsParams {
  projectId: ProjectId;
  partnerId: PartnerId;
  costCategoryId: CostCategoryId;
  periodId: PeriodId;
}

type LineItem = Pick<ClaimLineItemDto, "lastModifiedDate" | "isAuthor" | "value" | "description" | "id">;

export interface EditClaimLineItemsData {
  project: Pick<ProjectDto, "id" | "competitionType" | "title" | "projectNumber" | "isNonFec">;
  claimDetails: Pick<ClaimDetailsDto, "isAuthor" | "value" | "comments"> & { lineItems: LineItem[] };
  claimOverrides: ClaimOverrideRateDto;
  costCategories: Pick<CostCategoryDto, "id" | "type" | "name" | "hintText" | "isCalculated">[];
  forecastDetail: Pick<ForecastDetailsDTO, "value">;
  documents: Pick<
    DocumentSummaryDto,
    "id" | "dateCreated" | "fileSize" | "fileName" | "link" | "uploadedBy" | "isOwner" | "description"
  >[];
}

export interface ContainerProps {
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>;
  maxClaimLineItems: number;
}

interface CombinedData {
  project: EditClaimLineItemsData["project"];
  claimDetails: EditClaimLineItemsData["claimDetails"];
  claimOverrides: EditClaimLineItemsData["claimOverrides"];
  costCategories: EditClaimLineItemsData["costCategories"];
  forecastDetail: EditClaimLineItemsData["forecastDetail"];
  documents: EditClaimLineItemsData["documents"];
  editor: ContainerProps["editor"];
}

const LineItemForm = createTypedForm<Pick<ClaimDetailsDto, "value" | "comments"> & { lineItems: LineItem[] }>();
const LineItemTable = createTypedTable<LineItem>();

export interface EditClaimLineItemsCallbacks {
  onUpdate: (saving: boolean, dto: ClaimDetailsDto, goToUpload?: boolean) => void;
}

const DeleteByEnteringZero = () => (
  <ValidationMessage
    messageType="info"
    qa="claim-warning"
    message={<Content value={x => x.pages.editClaimLineItems.setToZeroToRemove} />}
  />
);

const EditClaimLineItemsComponent = (
  props: BaseProps & EditClaimDetailsParams & ContainerProps & EditClaimLineItemsCallbacks,
) => {
  const { isClient: showAddRemove } = useMounted();

  const { project, claimDetails, forecastDetail, costCategories, documents, fragmentRef } = useEditClaimLineItemsData(
    props.projectId,
    props.partnerId,
    props.periodId,
    props.costCategoryId,
  );

  const { editor } = props;

  const back = props.routes.prepareClaim.getLink({
    projectId: project.id,
    partnerId: props.partnerId,
    periodId: props.periodId,
  });
  const costCategory = costCategories.find(x => x.id === props.costCategoryId) || ({} as CostCategoryDto);

  const { isKTP, isCombinationOfSBRI } = checkProjectCompetition(project.competitionType);
  const editClaimLineItemGuidance = <Content value={x => x.claimsMessages.editClaimLineItemGuidance} />;

  const editClaimLineItemVat = (
    <>
      <SimpleString qa="vat-registered">
        <Content value={x => x.claimsMessages.editClaimLineItemVatRegistered} />
      </SimpleString>
      <SimpleString qa="vat-contact-mo">
        <Content value={x => x.claimsMessages.editClaimLineItemContactMo} />
      </SimpleString>
    </>
  );

  const isOtherCosts = costCategory.type === CostCategoryType.Other_Costs;
  const isVAT = costCategory.type === CostCategoryType.VAT;

  return (
    <Page
      backLink={
        <BackLink route={back}>
          <Content value={x => x.pages.editClaimLineItems.backLink} />
        </BackLink>
      }
      error={editor.error}
      validator={editor.validator}
      pageTitle={<Title title={project.title} projectNumber={project.projectNumber} heading={costCategory.name} />}
      fragmentRef={fragmentRef}
    >
      <AwardRateOverridesMessage currentCostCategoryId={costCategory.id} />
      {renderNegativeClaimWarning(claimDetails)}
      {(!claimDetails.isAuthor || claimDetails.lineItems.some(x => !x.isAuthor)) && <DeleteByEnteringZero />}

      <>
        {isCombinationOfSBRI ? (
          <>
            {isOtherCosts && (
              <>
                <SimpleString qa="other-costs-guidance-message">
                  <Content value={x => x.claimsMessages.editClaimLineItemOtherCostsTotalCosts} />
                </SimpleString>
                {editClaimLineItemVat}
              </>
            )}
            {isVAT && editClaimLineItemVat}
          </>
        ) : (
          !isKTP && <SimpleString qa="guidance-message">{editClaimLineItemGuidance}</SimpleString>
        )}
        <SimpleString qa="guidance-currency-message">
          <MountedHoc>
            {y => (
              <Content
                value={x =>
                  y.isClient
                    ? x.claimsMessages.editClaimLineItemConvertGbp
                    : x.claimsMessages.nonJsEditClaimLineItemConvertGbp
                }
              />
            )}
          </MountedHoc>
        </SimpleString>
      </>

      <Section>
        {costCategory.hintText && <TextHint>{costCategory.hintText}</TextHint>}
        {costCategory.isCalculated
          ? renderCalculated(
              costCategory,
              claimDetails,
              forecastDetail,
              documents,
              editor,
              project.competitionType,
              props.onUpdate,
              props.partnerId,
              props.periodId,
              props.maxClaimLineItems,
            )
          : renderTable(
              editor,
              forecastDetail,
              documents,
              project.competitionType,
              showAddRemove,
              props.maxClaimLineItems,
              props.onUpdate,
              props.partnerId,
              props.periodId,
              props.costCategoryId,
            )}
      </Section>
    </Page>
  );
};

const renderTable = (
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  forecastDetail: Pick<ForecastDetailsDTO, "value">,
  documents: Pick<
    DocumentSummaryDto,
    "id" | "dateCreated" | "fileSize" | "fileName" | "link" | "uploadedBy" | "isOwner" | "description"
  >[],
  competitionType: string,
  showAddRemove: boolean,
  maxClaimLineItems: number,
  onUpdate: EditClaimLineItemsCallbacks["onUpdate"],
  partnerId: PartnerId,
  periodId: PeriodId,
  costCategoryId: CostCategoryId,
) => {
  const validationResults = editor.validator.items.results;

  const documentSection = getCompetitionRenderTableDocumentContent(competitionType, documents, editor, onUpdate);

  return (
    <LineItemForm.Form
      editor={editor}
      onSubmit={() => onUpdate(true, editor.data, false)}
      qa="current-claim-summary-form"
    >
      <LineItemForm.Hidden name="itemCount" value={x => x.lineItems.length} />
      <LineItemForm.Fieldset>
        <LineItemTable.Table
          data={editor.data.lineItems}
          validationResult={validationResults}
          footers={renderFooters(
            editor.data.lineItems,
            forecastDetail,
            showAddRemove,
            editor,
            maxClaimLineItems,
            partnerId,
            periodId,
            costCategoryId,
            onUpdate,
          )}
          qa="current-claim-summary-table"
        >
          <LineItemTable.Custom
            header={x => x.pages.editClaimLineItems.headerDescription}
            qa="cost-description"
            value={(x, i) => renderDescription(x, i, validationResults[i.row], editor, onUpdate)}
          />
          <LineItemTable.Custom
            header={x => x.pages.editClaimLineItems.headerCost}
            qa="cost-value"
            classSuffix="numeric"
            value={(x, i) => renderCost(x, i, validationResults[i.row], editor, onUpdate)}
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
                <a href="" className="govuk-link" role="button" onClick={e => removeItem(i, e, editor, onUpdate)}>
                  <Content value={y => y.pages.editClaimLineItems.buttonRemove} />
                </a>
              )
            }
            width={1}
          />
        </LineItemTable.Table>
      </LineItemForm.Fieldset>

      {documentSection}
      <LineItemForm.Submit>
        <Content value={x => x.pages.editClaimLineItems.buttonSaveAndReturn} />
      </LineItemForm.Submit>
    </LineItemForm.Form>
  );
};

const getCompetitionRenderCalculatedDocumentSection = (
  competitionType: string,
  documents: Pick<
    DocumentSummaryDto,
    "id" | "dateCreated" | "fileSize" | "fileName" | "link" | "uploadedBy" | "isOwner" | "description"
  >[],
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  onUpdate: EditClaimLineItemsCallbacks["onUpdate"],
) => {
  const { isKTP, isCombinationOfSBRI } = checkProjectCompetition(competitionType);

  return (
    !isKTP && (
      <>
        <LineItemForm.Fieldset>
          {renderDocuments(documents, isCombinationOfSBRI, editor, onUpdate)}
        </LineItemForm.Fieldset>

        <LineItemForm.Fieldset
          heading={x => x.pages.editClaimLineItems.headerAdditionalInformation}
          qa="additional-info-form"
          headingQa="additional-info-heading"
          className="govuk-!-margin-top-8"
        >
          <LineItemForm.MultilineString
            label={x => x.pages.editClaimLineItems.additionalInfo}
            hint={getHintContent(isKTP, isCombinationOfSBRI)}
            labelHidden
            name="comments"
            value={() => editor.data.comments}
            update={(dto, v) => (dto.comments = v)}
            characterCountOptions={{ type: "descending", maxValue: claimDetailsCommentsMaxLength }}
            qa="info-text-area"
            validation={editor.validator.comments}
          />
        </LineItemForm.Fieldset>
      </>
    )
  );
};

const getCompetitionRenderTableDocumentContent = (
  competitionType: string,
  documents: DocumentSummaryDto[],
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  onUpdate: EditClaimLineItemsCallbacks["onUpdate"],
) => {
  const { isKTP, isCombinationOfSBRI } = checkProjectCompetition(competitionType);

  return (
    !isKTP && (
      <>
        <LineItemForm.Fieldset>
          {renderDocuments(documents, isCombinationOfSBRI, editor, onUpdate)}
        </LineItemForm.Fieldset>

        <LineItemForm.Fieldset
          heading={x => x.pages.editClaimLineItems.headerAdditionalInformation}
          qa="additional-info-form"
          headingQa="additional-info-heading"
          className="govuk-!-margin-top-8"
        >
          <LineItemForm.MultilineString
            label={x => x.pages.editClaimLineItems.additionalInfo}
            hint={getHintContent(isKTP, isCombinationOfSBRI)}
            labelHidden
            name="comments"
            value={() => editor.data.comments}
            update={(data, v) => (editor.data.comments = v)}
            characterCountOptions={{ type: "descending", maxValue: claimDetailsCommentsMaxLength }}
            qa="info-text-area"
            validation={editor.validator.comments}
          />
        </LineItemForm.Fieldset>
      </>
    )
  );
};

const getHintContent = (isKTP: boolean, isCombinationOfSBRI: boolean): ContentSelector | undefined => {
  if (!isKTP && !isCombinationOfSBRI) {
    return x => x.pages.editClaimLineItems.hintAdditionalInformation;
  } else if (isCombinationOfSBRI) {
    return x => x.pages.editClaimLineItems.sbriHintAdditionalInformation;
  } else {
    return undefined;
  }
};

const renderDocuments = (
  documents: Pick<
    DocumentSummaryDto,
    "id" | "dateCreated" | "fileSize" | "fileName" | "link" | "uploadedBy" | "isOwner" | "description"
  >[],
  isCombinationOfSBRI: boolean,
  editorData: CombinedData["editor"],
  onUpdate: EditClaimLineItemsCallbacks["onUpdate"],
) => {
  return (
    <>
      <Section title={x => x.pages.editClaimLineItems.headerSupportingDocuments} qa="supporting-documents-section">
        {isCombinationOfSBRI ? (
          <>
            <SimpleString>
              <Content value={x => x.claimsMessages.editClaimLineItemUploadEvidence} />
            </SimpleString>

            <SimpleString>
              <Content value={x => x.claimsMessages.editClaimLineItemClaimDocuments} />
            </SimpleString>

            <SimpleString>
              <Content value={x => x.claimsMessages.editClaimLineItemContactMo} />
            </SimpleString>
          </>
        ) : (
          <SimpleString>
            <Content value={x => x.claimsMessages.editClaimLineItemDocumentGuidance} />
          </SimpleString>
        )}

        <LineItemForm.Button name="upload" onClick={() => onUpdate(true, editorData.data, true)}>
          <Content value={x => x.pages.editClaimLineItems.buttonUploadAndRemoveDocuments} />
        </LineItemForm.Button>
      </Section>

      <Section>
        <DocumentView qa="edit-claim-line-items-documents" documents={documents} />
      </Section>
    </>
  );
};

const renderCost = (
  item: Pick<ClaimLineItemDto, "value">,
  index: { column: number; row: number },
  validation: ClaimLineItemDtoValidator,
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  onUpdate: EditClaimLineItemsCallbacks["onUpdate"],
) => {
  return (
    <span>
      <ValidationError error={validation.cost} />
      <NumberInput
        name={`value${index.row}`}
        value={item.value}
        disabled={editor.status === EditorStatus.Saving}
        onChange={val => updateItem(index, editor, dto => (dto.value = val as number), onUpdate)}
        ariaLabel={`value of claim line item ${index.row + 1}`}
      />
    </span>
  );
};

const renderNegativeClaimWarning = (claimDetails: EditClaimLineItemsData["claimDetails"]) => {
  const errorItems = claimDetails.lineItems.reduce<string[]>(
    (acc, i) => (i.value < 0 ? [...acc, i.description] : acc),
    [],
  );

  if (!errorItems.length) return null;

  const errorItemsList = errorItems.map(costCategory => <li key={costCategory}>{costCategory}</li>);
  const markup = (
    <>
      <SimpleString>
        <Content value={x => x.claimsMessages.negativeClaimWarning} />
      </SimpleString>

      <UL>{errorItemsList}</UL>
    </>
  );

  return <ValidationMessage messageType="info" qa="claim-warning" message={markup} />;
};

const renderDescription = (
  item: Pick<ClaimLineItemDto, "description" | "id">,
  index: { column: number; row: number },
  validation: ClaimLineItemDtoValidator,
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  onUpdate: EditClaimLineItemsCallbacks["onUpdate"],
) => {
  return (
    <span>
      <ValidationError error={validation.description} />
      <input type="hidden" name={`id${index.row}`} value={item.id} />
      <TextInput
        name={`description${index.row}`}
        value={item.description}
        disabled={editor.status === EditorStatus.Saving}
        onChange={val => updateItem(index, editor, dto => (dto.description = val as string), onUpdate)}
        ariaLabel={`description of claim line item ${index.row + 1}`}
      />
    </span>
  );
};

const removeItem = (
  i: { column: number; row: number },
  e: React.SyntheticEvent<HTMLAnchorElement>,
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  onUpdate: EditClaimLineItemsCallbacks["onUpdate"],
) => {
  e.preventDefault();
  const dto = editor.data;
  dto.lineItems.splice(i.row, 1);
  onUpdate(false, dto);
};

const addItem = (
  e: React.SyntheticEvent<HTMLAnchorElement>,
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  partnerId: PartnerId,
  periodId: PeriodId,
  costCategoryId: CostCategoryId,
  onUpdate: EditClaimLineItemsCallbacks["onUpdate"],
) => {
  e.preventDefault();
  const dto = editor.data;
  dto.lineItems.push({
    partnerId,
    periodId,
    costCategoryId,
    isAuthor: true,
  } as unknown as ClaimLineItemDto);
  onUpdate(false, dto);
};

const updateItem = (
  i: { column: number; row: number },
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  update: (item: ClaimLineItemDto) => void,
  onUpdate: EditClaimLineItemsCallbacks["onUpdate"],
) => {
  const dto = editor.data;
  update(dto.lineItems[i.row]);
  onUpdate(false, dto);
};

const renderFooters = (
  data: Pick<ClaimLineItemDto, "value">[],
  forecastDetail: Pick<ForecastDetailsDTO, "value">,
  showAddRemove: boolean,
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  maxClaimLineItems: number,
  partnerId: PartnerId,
  periodId: PeriodId,
  costCategoryId: CostCategoryId,
  onUpdate: EditClaimLineItemsCallbacks["onUpdate"],
) => {
  const total: number = sumBy(data, item => item.value);

  const forecast = forecastDetail.value;
  const diff = diffAsPercentage(forecast, total);
  const lengthWithinBoundary = data.length < maxClaimLineItems;

  const footers: JSX.Element[] = [];

  if (showAddRemove && lengthWithinBoundary) {
    footers.push(
      <tr key={1} className="govuk-table__row">
        <td className="govuk-table__cell" colSpan={4}>
          <a
            href=""
            className="govuk-link"
            role="button"
            onClick={e => addItem(e, editor, partnerId, periodId, costCategoryId, onUpdate)}
            data-qa="add-cost"
          >
            <Content value={x => x.pages.editClaimLineItems.addCost} />
          </a>
        </td>
      </tr>,
    );
  }

  footers.push(
    <tr key={2} className="govuk-table__row">
      <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
        <Content value={x => x.pages.editClaimLineItems.totalCosts} />
      </td>
      <td className="govuk-table__cell govuk-table__cell--numeric">
        <Currency value={total} />
      </td>
      <td className="govuk-table__cell">
        <AccessibilityText>
          <Content value={x => x.pages.editClaimLineItems.noData} />
        </AccessibilityText>
      </td>
      {showAddRemove ? (
        <td className="govuk-table__cell">
          <AccessibilityText>
            <Content value={x => x.pages.editClaimLineItems.noData} />
          </AccessibilityText>
        </td>
      ) : null}
    </tr>,
  );

  footers.push(
    <tr key={3} className="govuk-table__row">
      <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
        <Content value={x => x.pages.editClaimLineItems.forecastCosts} />
      </td>
      <td className="govuk-table__cell govuk-table__cell--numeric">
        <Currency value={forecast} />
      </td>
      <td className="govuk-table__cell">
        <AccessibilityText>
          <Content value={x => x.pages.editClaimLineItems.noData} />
        </AccessibilityText>
      </td>
      {showAddRemove ? (
        <td className="govuk-table__cell">
          <AccessibilityText>
            <Content value={x => x.pages.editClaimLineItems.noData} />
          </AccessibilityText>
        </td>
      ) : null}
    </tr>,
  );

  if (forecast > 0) {
    footers.push(
      <tr key={4} className="govuk-table__row">
        <td className="govuk-table__cell govuk-table__cell--numeric govuk-!-font-weight-bold">
          <Content value={x => x.pages.editClaimLineItems.difference} />
        </td>
        <td className="govuk-table__cell govuk-table__cell--numeric">
          <Percentage value={diff} />
        </td>
        <td className="govuk-table__cell">
          <AccessibilityText>
            <Content value={x => x.pages.editClaimLineItems.noData} />
          </AccessibilityText>
        </td>
        {showAddRemove ? (
          <td className="govuk-table__cell">
            <AccessibilityText>
              <Content value={x => x.pages.editClaimLineItems.noData} />
            </AccessibilityText>
          </td>
        ) : null}
      </tr>,
    );
  }

  return footers;
};

const renderCalculated = (
  costCategory: Pick<CostCategoryDto, "id" | "name">,
  claimDetails: Pick<ClaimDetailsDto, "value">,
  forecastDetail: Pick<ForecastDetailsDTO, "value">,
  documents: Pick<
    DocumentSummaryDto,
    "id" | "dateCreated" | "fileSize" | "fileName" | "link" | "uploadedBy" | "isOwner" | "description"
  >[],
  editor: IEditorStore<ClaimDetailsDto, ClaimDetailsValidator>,
  competitionType: string,
  onUpdate: EditClaimLineItemsCallbacks["onUpdate"],
  partnerId: PartnerId,
  periodId: PeriodId,
  maxClaimLineItems: number,
) => {
  const mockItems: ClaimLineItemDto[] = [
    {
      costCategoryId: costCategory.id,
      description: costCategory.name,
      partnerId: partnerId,
      periodId: periodId,
      id: "",
      value: claimDetails.value,
      lastModifiedDate: new Date(),
      isAuthor: true,
    },
  ];

  const supportingDocumentContent = getCompetitionRenderCalculatedDocumentSection(
    competitionType,
    documents,
    editor,
    onUpdate,
  );

  return (
    <LineItemForm.Form
      editor={editor}
      onSubmit={() => onUpdate(true, editor.data, false)}
      qa="current-claim-summary-form"
    >
      <LineItemForm.Fieldset>
        <LineItemTable.Table
          data={mockItems}
          footers={renderFooters(
            mockItems,
            forecastDetail,
            false,
            editor,
            maxClaimLineItems,
            partnerId,
            periodId,
            costCategory.id,
            onUpdate,
          )}
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
        <Content value={x => x.pages.editClaimLineItems.buttonSaveAndReturn} />
      </LineItemForm.Submit>
    </LineItemForm.Form>
  );
};

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
  const config = stores.config.getConfig();

  const combined = Pending.combine({
    editor: stores.claimDetails.getClaimDetailsEditor(
      props.projectId,
      props.partnerId,
      props.periodId,
      props.costCategoryId,
      (dto: ClaimDetailsDto) => {
        if (isClient) return;
        const currentItemsLength = dto.lineItems.length;
        const maximumItemsLength = config.options.nonJsMaxClaimLineItems;
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
    ),
  });

  const onUpdate = (saving: boolean, dto: ClaimDetailsDto, goToUpload?: boolean) =>
    stores.claimDetails.updateClaimDetailsEditor(
      saving,
      props.projectId,
      props.partnerId,
      props.periodId,
      props.costCategoryId,
      dto,
      () => navigate(getDestination(props, goToUpload).path),
    );

  return (
    <PageLoader
      pending={combined}
      render={data => (
        <EditClaimLineItemsComponent
          onUpdate={onUpdate}
          maxClaimLineItems={config.options.maxClaimLineItems}
          {...data}
          {...props}
        />
      )}
    />
  );
};

export const EditClaimLineItemsRoute = defineRoute({
  allowRouteInActiveAccess: true,
  routeName: "claimLineItemEdit",
  routePath: "/projects/:projectId/claims/:partnerId/prepare/:periodId/costs/:costCategoryId",
  container: EditClaimLineItemsContainer,
  getParams: route => ({
    projectId: route.params.projectId as ProjectId,
    partnerId: route.params.partnerId as PartnerId,
    costCategoryId: route.params.costCategoryId as CostCategoryId,
    periodId: parseInt(route.params.periodId, 10) as PeriodId,
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
