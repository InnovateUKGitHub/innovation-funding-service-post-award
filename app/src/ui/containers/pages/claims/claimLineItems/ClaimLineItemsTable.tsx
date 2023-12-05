import { ClaimLineItemDto } from "@framework/dtos/claimLineItemDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { Currency } from "@ui/components/atomicDesign/atoms/Currency/currency";
import { ShortDate } from "@ui/components/atomicDesign/atoms/Date";
import { SubmitButton } from "@ui/components/atomicDesign/atoms/form/Button/Button";
import { TextInput } from "@ui/components/atomicDesign/atoms/form/TextInput/TextInput";
import { useMounted } from "@ui/components/atomicDesign/atoms/providers/Mounted/Mounted";
import { TableEmptyCell } from "@ui/components/atomicDesign/atoms/table/TableEmptyCell/TableEmptyCell";
import { TBody, TD, TFoot, TH, THead, TR, Table } from "@ui/components/atomicDesign/atoms/table/tableComponents";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { useContent } from "@ui/hooks/content.hook";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { EditClaimLineItemsSchemaType } from "./editClaimLineItems.zod";
import { useMapToClaimLineItemTableDto } from "./useMapToClaimLineItemTableDto";
import { AccessibilityText } from "@ui/components/atomicDesign/atoms/AccessibilityText/AccessibilityText";

const emptyData = { id: undefined, description: "", value: "" };

interface ClaimLineItemsTableProps {
  lineItems: Pick<ClaimLineItemDto, "id" | "description" | "value" | "lastModifiedDate">[];
  forecastDetail: Pick<ForecastDetailsDTO, "value">;
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
}: EditClaimLineItemsTableProps) => {
  const { isClient } = useMounted();
  const { getContent } = useContent();

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

  return (
    <Table data-qa="current-claim-summary-table">
      <THead>
        <TR>
          <TH>{getContent(x => x.pages.editClaimLineItems.headerDescription)}</TH>
          <TH>{getContent(x => x.pages.editClaimLineItems.headerCost)}</TH>
          <TH>{getContent(x => x.pages.editClaimLineItems.headerLastUpdated)}</TH>
          {isClient && (
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
              <TD className="ifspa-claim-line-input-cell">
                <ValidationError error={getFieldState(`lineItems.${i}.value`).error} />
                <TextInput
                  id={`lineItems_${i}_value`}
                  hasError={getFieldState(`lineItems.${i}.value`).invalid}
                  disabled={disabled}
                  defaultValue={x.displayValue}
                  aria-label={getContent(x => x.pages.editClaimLineItems.costAriaLabel({ count: i }))}
                  {...(x.jsDisabledRow ? { name: `lineItems.${i}.value` } : register(`lineItems.${i}.value`))}
                />
              </TD>

              <TD className="ifspa-claim-line-data-cell">
                {x.lastModifiedDate ? <ShortDate value={x.lastModifiedDate} /> : <TableEmptyCell />}
              </TD>
              {isClient && (
                <TD className="ifspa-claim-line-data-cell">
                  <SubmitButton
                    onClick={e => {
                      remove(i);
                      e.preventDefault();
                    }}
                    disabled={disabled}
                    styling="TableLink"
                  >
                    {getContent(x => x.pages.editClaimLineItems.buttonRemove)}
                  </SubmitButton>
                </TD>
              )}
            </TR>
          );
        })}
      </TBody>
      <TFoot>
        {isClient && (
          <TR>
            <TD colSpan={4}>
              <SubmitButton
                onClick={e => {
                  append(emptyData);
                  e.preventDefault();
                }}
                disabled={disabled}
                styling="TableLink"
              >
                {getContent(x => x.pages.editClaimLineItems.addCost)}
              </SubmitButton>
            </TD>
          </TR>
        )}
        <TR>
          <TH numeric bold>
            {getContent(x => x.pages.editClaimLineItems.totalCosts)}
          </TH>
          <TD>
            <Currency value={total} />
          </TD>
          <TD>
            <TableEmptyCell />
          </TD>
          {isClient && (
            <TD>
              <TableEmptyCell />
            </TD>
          )}
        </TR>
        <TR>
          <TH numeric bold>
            {getContent(x => x.pages.editClaimLineItems.forecastCosts)}
          </TH>
          <TD>
            <Currency value={forecast} />
          </TD>
          <TD>
            <TableEmptyCell />
          </TD>
          {isClient && (
            <TD>
              <TableEmptyCell />
            </TD>
          )}
        </TR>
        <TR>
          <TH numeric bold>
            {getContent(x => x.pages.editClaimLineItems.difference)}
          </TH>
          <TD>
            <Currency value={difference} />
          </TD>
          <TD>
            <TableEmptyCell />
          </TD>
          {isClient && (
            <TD>
              <TableEmptyCell />
            </TD>
          )}
        </TR>
      </TFoot>
    </Table>
  );
};

const ClaimLineItemsTable = ({ lineItems, forecastDetail }: ClaimLineItemsTableProps) => {
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
          <TH>{getContent(x => x.pages.editClaimLineItems.headerCost)}</TH>
          <TH>{getContent(x => x.pages.editClaimLineItems.headerLastUpdated)}</TH>
        </TR>
      </THead>
      <TBody>
        {rows.map((x, i) => {
          return (
            <TR key={i}>
              <TD>{x.description}</TD>
              <TD>
                <Currency value={x.value} />
              </TD>

              <TD className="ifspa-claim-line-data-cell">
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
          <TD>
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
          <TD>
            <Currency value={forecast} />
          </TD>
          <TD>
            <TableEmptyCell />
          </TD>
        </TR>
        <TR>
          <TH numeric bold>
            {getContent(x => x.pages.editClaimLineItems.difference)}
          </TH>
          <TD>
            <Currency value={difference} />
          </TD>
          <TD>
            <TableEmptyCell />
          </TD>
        </TR>
      </TFoot>
    </Table>
  );
};

export { EditClaimLineItemsTable, ClaimLineItemsTable };
