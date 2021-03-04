import {
  ClaimDetailsSummaryDto,
  ClaimDto,
  ForecastDetailsDTO,
  GOLCostDto,
  PartnerDto,
  ProjectDto,
  ProjectRole,
} from "@framework/dtos";
import { IEditorStore } from "@ui/redux";
import { ForecastDetailsDtosValidator } from "@ui/validators";
import { CostCategoryDto } from "@framework/dtos/costCategoryDto";
import { AriaLive } from "../renderers/ariaLive";
import { ValidationMessage } from "../validationMessage";
import { Content } from "../content";
import { UL } from "../layout";

interface Props {
  project: ProjectDto;
  partner: PartnerDto;
  claims: ClaimDto[];
  claimDetails: ClaimDetailsSummaryDto[];
  forecastDetails: ForecastDetailsDTO[];
  golCosts: GOLCostDto[];
  costCategories: CostCategoryDto[];
  editor?: IEditorStore<ForecastDetailsDTO[], ForecastDetailsDtosValidator>;
}

export const Warning = (props: Props) => <AriaLive>{renderWarningMessage(props)}</AriaLive>;

const renderWarningMessage = (props: Props) => {
  const categories: string[] = [];
  const currentPeriod = props.claims.reduce((prev, item) => (item.periodId > prev ? item.periodId : prev), 0);
  const forecasts = props.editor ? props.editor.data : props.forecastDetails;

  props.costCategories
    .filter(
      (x) =>
        x.competitionType === props.project.competitionType && x.organisationType === props.partner.organisationType,
    )
    .forEach((category) => {
      let total = 0;
      const gol = props.golCosts.find((x) => x.costCategoryId === category.id);

      props.claimDetails.forEach(
        (x) => (total += x.costCategoryId === category.id && x.periodId <= currentPeriod ? x.value : 0),
      );
      forecasts.forEach((x) => (total += x.costCategoryId === category.id && x.periodId > currentPeriod ? x.value : 0));

      if (gol && gol.value < total) {
        categories.push(category.name);
      }
    });

  const lowerCaseCategories = categories.map((x) => (
    <li key={x}>{x.toLocaleLowerCase()}</li>
  ));

  const categoriesList = (
    <UL>{lowerCaseCategories}</UL>
  );
  const isFC = (props.partner.roles & ProjectRole.FinancialContact) === ProjectRole.FinancialContact;

  if (categories.length === 0) return null;

  return isFC ? (
    <ValidationMessage
      messageType="info"
      message={
        <div>
          <Content value={x => x.components.warningContent.amountRequestMessage} />
          <UL>{categoriesList}</UL>
          <Content value={x => x.components.warningContent.contactmessage} />
        </div>
      }
      qa="forecasts-warning-fc"
    />
  ) : (
    <ValidationMessage
      messageType="info"
      message={
        <div>
          <Content value={x => x.components.warningContent.MOPMmessage} />
          <UL>{categoriesList}</UL>
        </div>
      }
      qa="forecasts-warning-mo-pm"
    />
  );
};
