import { ForecastTableSpreadsheet } from "@framework/documents/spreadsheets/ForecastTableSpreadsheet";
import { ForecastTableDto } from "./NewForecastTable.logic";
import { useContent } from "@ui/hooks/content.hook";
import { SpreadsheetFormat } from "@framework/documents/spreadsheets/Spreadsheet";

const ForecastTableDownloadButton = ({ tableData }: { tableData: ForecastTableDto }) => {
  const { copy } = useContent();

  const download = (format: SpreadsheetFormat) => async () => {
    const forecastTableGenerator = new ForecastTableSpreadsheet({
      tableData,
      copy,
      workbookOptions: {
        title: "Forecast Table",
        subject: "EUI Small Ent Health Ltd",
      },
    });
    const { buffer, mimeType, extension } = await forecastTableGenerator.export(format);
    const blob = new Blob([buffer], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = `spreadsheet.${extension}`;
    document.body.append(anchor);
    anchor.click();
    URL.revokeObjectURL(blobUrl);
    anchor.remove();
  };

  return (
    <div>
      <button onClick={download(SpreadsheetFormat.OOXML)}>Download Spreadsheet (Open Office XML)</button>
      <button onClick={download(SpreadsheetFormat.CSV)}>Download Spreadsheet (CSV)</button>
    </div>
  );
};

export { ForecastTableDownloadButton };
