import { ForecastTableSpreadsheet } from "@framework/documents/spreadsheets/ForecastTableSpreadsheet";
import { ForecastTableDto } from "./NewForecastTable.logic";

const ForecastTableDownloadButton = ({ tableData }: { tableData: ForecastTableDto }) => {
  const download = async () => {
    const forecastTableGenerator = new ForecastTableSpreadsheet({ tableData });
    const buffer = await forecastTableGenerator.exportOOXML();
    const blob = new Blob([buffer], { type: "application/vnd.ms-excel" });
    const blobUrl = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = blobUrl;
    anchor.download = "excel.xlsx";
    document.body.append(anchor);
    anchor.click();
    URL.revokeObjectURL(blobUrl);
    anchor.remove();
  };

  return <button onClick={download}>Download</button>;
};

export { ForecastTableDownloadButton };
