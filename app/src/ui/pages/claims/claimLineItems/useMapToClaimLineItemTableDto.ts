import { ClaimLineItemDto } from "@framework/dtos/claimLineItemDto";
import { ForecastDetailsDTO } from "@framework/dtos/forecastDetailsDto";
import { diffAsPercentage, isNumber, parseCurrency, roundCurrency } from "@framework/util/numberHelper";
import { useMemo } from "react";
import { z } from "zod";
import { EditClaimLineItemLineItemSchemaType } from "./editClaimLineItems.zod";
import { useMounted } from "@ui/context/Mounted";
import { useClientConfig } from "@ui/context/ClientConfigProvider";

interface LineItem {
  id?: string;
  description?: string;
  value: string | null;
}

interface InitialLineItem {
  id?: string;
  description?: string;
  value: string | number | null;
}

interface MapToClaimLineItemTableProps {
  existingLineItems: Pick<ClaimLineItemDto, "id" | "description" | "value" | "lastModifiedDate" | "isAuthor">[];
  currentLineItems?: LineItem[];
  watchedLineItems?: LineItem[];
  forecastDetail: Pick<ForecastDetailsDTO, "value">;
  extraRows: number;
}

interface ClaimLineItemRow {
  id?: string;
  description: string;
  value: number;
  lastModifiedDate?: Date;
  displayValue: string;
  isAuthor: boolean;
  jsDisabledRow: boolean;
}

interface ClaimLineItemTableDto {
  rows: ClaimLineItemRow[];
  total: number;
  forecast: number;
  difference: number;
}

const mapToInitialLineItems = (initialLineItems: InitialLineItem[]): z.output<EditClaimLineItemLineItemSchemaType>[] =>
  initialLineItems.map(({ id, value, description }) => ({
    id,
    value: String(value),
    description: description ?? "",
  }));

const mapToClaimLineItemTableDto = ({
  existingLineItems,
  currentLineItems,
  watchedLineItems,
  forecastDetail,
  extraRows = 0,
}: MapToClaimLineItemTableProps): ClaimLineItemTableDto => {
  const rows: ClaimLineItemRow[] = [];
  let total: number = 0;

  // RHF table
  if (currentLineItems && watchedLineItems) {
    // See "Controlled Field Array"
    // https://react-hook-form.com/docs/usefieldarray
    const controlledFields = currentLineItems.map((field, index) => {
      return {
        ...field,
        ...watchedLineItems[index],
      };
    });

    for (const lineItem of controlledFields) {
      const existingLineItem = existingLineItems.find(x => x.id === lineItem.id);
      const value = parseCurrency(lineItem.value ?? "");

      if (isNumber(value)) total = roundCurrency(value + total);

      rows.push({
        id: lineItem.id,
        description: lineItem.description ?? "",
        displayValue: lineItem.value ?? "",
        value: isNumber(value) ? value : 0,
        lastModifiedDate: existingLineItem?.lastModifiedDate,
        jsDisabledRow: false,
        isAuthor: existingLineItem?.isAuthor ?? true,
      });
    }

    // If JavaScript is disabled, pad out extra rows until we reach
    // the JS disabled number of rows.
    for (let i = 0; i < extraRows; i++) {
      rows.push({
        description: "",
        displayValue: "",
        value: 0,
        jsDisabledRow: true,
        isAuthor: true,
      });
    }
  } else {
    for (const lineItem of existingLineItems) {
      const value = lineItem.value;

      total = roundCurrency(value + total);

      rows.push({
        id: lineItem.id,
        description: lineItem.description,
        displayValue: String(lineItem.value),
        value,
        lastModifiedDate: lineItem.lastModifiedDate,
        jsDisabledRow: false,
        isAuthor: lineItem.isAuthor,
      });
    }
  }

  return {
    rows,
    total,
    forecast: forecastDetail.value,
    difference: diffAsPercentage(forecastDetail.value, total),
  };
};

const useMapToInitialLineItems = (initialLineItems: InitialLineItem[]) => {
  return useMemo(() => mapToInitialLineItems(initialLineItems), []);
};

const useMapToClaimLineItemTableDto = (props: Omit<MapToClaimLineItemTableProps, "extraRows">) => {
  const { isServer, isClient } = useMounted();
  const { options } = useClientConfig();
  return useMemo(() => {
    let extraRows = 0;

    if (isServer) {
      extraRows = options.nonJsMaxClaimLineItems - (props.currentLineItems?.length ?? props.existingLineItems.length);
    }

    return mapToClaimLineItemTableDto({
      ...props,
      extraRows,
    });
  }, [props.forecastDetail, props.existingLineItems, props.currentLineItems, isServer, isClient]);
};

export { ClaimLineItemTableDto, mapToClaimLineItemTableDto, useMapToClaimLineItemTableDto, useMapToInitialLineItems };
