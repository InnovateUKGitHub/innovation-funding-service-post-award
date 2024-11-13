import { ForecastTableSpreadsheet } from "@framework/documents/spreadsheets/ForecastTableSpreadsheet";
import { ForecastTableDto } from "./NewForecastTable.logic";
import { useContent } from "@ui/hooks/content.hook";
import { Spreadsheet, SpreadsheetFormat } from "@framework/documents/spreadsheets/Spreadsheet";
import { useEffect, useMemo, useState } from "react";
import { GovLink } from "@ui/components/atoms/Links/links";

const ForecastTableDownloadButton = ({
  tableData,
  format,
}: {
  tableData: ForecastTableDto;
  format: SpreadsheetFormat;
}) => {
  const { copy, getContent } = useContent();
  const { mimeType, extension } = Spreadsheet.metadata[format];

  const [downloadUrl, setDownloadUrl] = useState(
    `/api/documents/forecasts/${tableData.metadata.project.id}/${tableData.metadata.partner.id}/${format}`,
  );
  const spreadsheet = useMemo(
    () =>
      new ForecastTableSpreadsheet({
        tableData,
        copy,
      }),
    [copy, tableData],
  );
  const filename = useMemo(() => spreadsheet.getFilename(), [spreadsheet]);

  useEffect(() => {
    const generateDownloadUrl = async () => {
      const buffer = await spreadsheet.export(format);
      const blob = new Blob([buffer], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      setDownloadUrl(blobUrl);
    };

    generateDownloadUrl();
  }, [setDownloadUrl, format, mimeType, spreadsheet]);

  return (
    <GovLink href={downloadUrl} download={`${filename}.${extension}`}>
      {getContent(x => x.components.forecastTableDownloadButton.download[format])}
    </GovLink>
  );
};

export { ForecastTableDownloadButton };
