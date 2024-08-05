import { ClaimLineItemDto } from "@framework/dtos/claimLineItemDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { ShortDate } from "@ui/components/atomicDesign/atoms/Date";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { useMounted } from "@ui/context/Mounted";
import { TableEmptyCell } from "@ui/components/atomicDesign/atoms/table/TableEmptyCell/TableEmptyCell";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { useContent } from "@ui/hooks/content.hook";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { EditClaimLineItemsSchemaType } from "./editClaimLineItems.zod";
import { useMapToClaimLineItemTableDto } from "./useMapToClaimLineItemTableDto";
import { AccessibilityText } from "@ui/components/atomicDesign/atoms/AccessibilityText/AccessibilityText";
import { Percentage } from "@ui/components/atomicDesign/atoms/Percentage/percentage";
import { useClientConfig } from "@ui/context/ClientConfigProvider";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";

const emptyData = { id: "", description: "", value: "" };

interface ClaimLineItemsTableProps {
  lineItems: Pick<ClaimLineItemDto, "id" | "description" | "value" | "lastModifiedDate" | "isAuthor">[];
  forecastDetail: Pick<ForecastDetailsDTO, "value">;
  differenceRow: boolean;
  boldTotalCosts: boolean;
}

interface EditClaimLineItemsTableProps extends ClaimLineItemsTableProps {
  formMethods: UseFormReturn<z.output<EditClaimLineItemsSchemaType>>;
  disabled?: boolean;
}

const EditClaimLineItemsTable = ({
  formMethods,
  lineItems,
  forecastDetail,
  disabled,
  differenceRow = true,
  boldTotalCosts = false,
}: EditClaimLineItemsTableProps) => {
  const { isClient } = useMounted();
  const { getContent } = useContent();
  const { options } = useClientConfig();

  const { register, getFieldState, watch } = formMethods;
  const { fields, append, remove } = useFieldArray({
    control: formMethods?.control,
    name: "lineItems",
  });

  const { difference, forecast, rows, total } = useMapToClaimLineItemTableDto({
    existingLineItems: lineItems,
    currentLineItems: fields,
    watchedLineItems: watch("lineItems"),
    forecastDetail,
  });

  const ownsAnyRows = rows.some(x => x.isAuthor);

  return (
    <Table data-qa="current-claim-summary-table">
      <THead>
        <TR>
          <TH>{getContent(x => x.pages.editClaimLineItems.headerDescription)}</TH>
          <TH numeric>{getContent(x => x.pages.editClaimLineItems.headerCost)}</TH>
          <TH numeric>{getContent(x => x.pages.editClaimLineItems.headerLastUpdated)}</TH>
          {isClient && ownsAnyRows && (
            <TH>
              <AccessibilityText>{getContent(x => x.pages.editClaimLineItems.headerAction)}</AccessibilityText>
            </TH>
          )}
        </TR>
      </THead>
      <TBody>
        {rows.map((x, i) => {
          return (
            <TR
              data-qa="input-row"
              key={`${i}-js-enabled-${x.jsDisabledRow}`}
              hasError={getFieldState(`lineItems.${i}`).invalid}
            >
              <TD className="ifspa-claim-line-input-cell">
                <input
                  type="hidden"
                  value={x.id ?? ""}
                  {...(x.jsDisabledRow ? { name: `lineItems.${i}.id` } : register(`lineItems.${i}.id`))}
                />
                <ValidationError error={getFieldState(`lineItems.${i}.description`).error} />
                <TextInput
                  id={`lineItems_${i}_description`}
                  hasError={getFieldState(`lineItems.${i}.description`).invalid}
                  defaultValue={x.description}
                  disabled={disabled}
                  aria-label={getContent(x => x.pages.editClaimLineItems.descriptionAriaLabel({ count: i }))}
                  {...(x.jsDisabledRow
                    ? { name: `lineItems.${i}.description` }
                    : register(`lineItems.${i}.description`))}
                />
              </TD>
              <TD numeric className="ifspa-claim-line-input-cell">
                <ValidationError error={getFieldState(`lineItems.${i}.value`).error} />
                <TextInput
                  id={`lineItems_${i}_value`}
                  hasError={getFieldState(`lineItems.${i}.value`).invalid}
                  disabled={disabled}
                  defaultValue={x.displayValue}
                  aria-label={getContent(x => x.pages.editClaimLineItems.costAriaLabel({ count: i }))}
                  numeric
                  {...(x.jsDisabledRow ? { name: `lineItems.${i}.value` } : register(`lineItems.${i}.value`))}
                  prefix={getContent(x => x.forms.prefix.gbp)}
                />
              </TD>

              <TD numeric className="ifspa-claim-line-data-cell">
                {x.lastModifiedDate ? <ShortDate value={x.lastModifiedDate} /> : <TableEmptyCell />}
              </TD>
              {isClient && ownsAnyRows && (
                <TD className="ifspa-claim-line-data-cell">
                  {x.isAuthor ? (
                    <Button
                      onClick={e => {
                        remove(i);
                        e.preventDefault();
                      }}
                      disabled={disabled}
                      styling="Link"
                    >
                      {getContent(x => x.pages.editClaimLineItems.buttonRemove)}
                    </Button>
                  ) : (
                    <TableEmptyCell />
                  )}
                </TD>
              )}
            </TR>
          );
        })}
      </TBody>
      <TFoot>
        {isClient && rows.length < options.maxClaimLineItems && (
          <TR>
            <TD colSpan={isClient && ownsAnyRows ? 4 : 3}>
              <Button
                onClick={e => {
                  append(emptyData);
                  e.preventDefault();
                }}
                disabled={disabled}
                styling="Link"
              >
                {getContent(x => x.pages.editClaimLineItems.addCost)}
              </Button>
            </TD>
          </TR>
        )}
        <TR>
          <TH numeric bold>
            {getContent(x => x.pages.editClaimLineItems.totalCosts)}
          </TH>
          <TD numeric bold={boldTotalCosts}>
            <Currency value={total} />
          </TD>
          <TD>
            <TableEmptyCell />
          </TD>
          {isClient && ownsAnyRows && (
            <TD>
              <TableEmptyCell />
            </TD>
          )}
        </TR>
        <TR>
          <TH numeric bold>
            {getContent(x => x.pages.editClaimLineItems.forecastCosts)}
          </TH>
          <TD numeric>
            <Currency value={forecast} />
          </TD>
          <TD>
            <TableEmptyCell />
          </TD>
          {isClient && ownsAnyRows && (
            <TD>
              <TableEmptyCell />
            </TD>
          )}
        </TR>
        {differenceRow && (
          <TR>
            <TH numeric bold>
              {getContent(x => x.pages.editClaimLineItems.difference)}
            </TH>
            <TD numeric>
              <Percentage value={difference} />
            </TD>
            <TD>
              <TableEmptyCell />
            </TD>
            {isClient && ownsAnyRows && (
              <TD>
                <TableEmptyCell />
              </TD>
            )}
          </TR>
        )}
      </TFoot>
    </Table>
  );
};

const ClaimLineItemsTable = ({
  lineItems,
  forecastDetail,
  differenceRow = false,
  boldTotalCosts = false,
}: ClaimLineItemsTableProps) => {
  const { getContent } = useContent();

  const { difference, forecast, rows, total } = useMapToClaimLineItemTableDto({
    existingLineItems: lineItems,
    forecastDetail,
  });

  return (
    <Table data-qa="current-claim-summary-table">
      <THead>
        <TR>
          <TH>{getContent(x => x.pages.editClaimLineItems.headerDescription)}</TH>
          <TH numeric>{getContent(x => x.pages.editClaimLineItems.headerCost)}</TH>
          <TH numeric>{getContent(x => x.pages.editClaimLineItems.headerLastUpdated)}</TH>
        </TR>
      </THead>
      <TBody>
        {rows.map((x, i) => {
          return (
            <TR key={i}>
              <TD>{x.description}</TD>
              <TD numeric>
                <Currency value={x.value} />
              </TD>

              <TD numeric className="ifspa-claim-line-data-cell">
                {x.lastModifiedDate ? <ShortDate value={x.lastModifiedDate} /> : <TableEmptyCell />}
              </TD>
            </TR>
          );
        })}
      </TBody>
      <TFoot>
        <TR>
          <TH numeric bold>
            {getContent(x => x.pages.editClaimLineItems.totalCosts)}
          </TH>
          <TD numeric bold={boldTotalCosts}>
            <Currency value={total} />
          </TD>
          <TD>
            <TableEmptyCell />
          </TD>
        </TR>
        <TR>
          <TH numeric bold>
            {getContent(x => x.pages.editClaimLineItems.forecastCosts)}
          </TH>
          <TD numeric>
            <Currency value={forecast} />
          </TD>
          <TD>
            <TableEmptyCell />
          </TD>
        </TR>
        {differenceRow && (
          <TR>
            <TH numeric bold>
              {getContent(x => x.pages.editClaimLineItems.difference)}
            </TH>
            <TD numeric>
              <Percentage value={difference} />
            </TD>
            <TD>
              <TableEmptyCell />
            </TD>
          </TR>
        )}
      </TFoot>
    </Table>
  );
};

export { EditClaimLineItemsTable, ClaimLineItemsTable };
