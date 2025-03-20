import { ForecastTableSpreadsheet } from "@framework/documents/spreadsheets/ForecastTableSpreadsheet";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FileInput } from "@ui/components/atoms/form/FileInput/FileInput";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { useMounted } from "@ui/context/Mounted";
import { useContent } from "@ui/hooks/content.hook";
import { useForm, UseFormSetValue } from "react-hook-form";
import { ForecastTableDto } from "./NewForecastTable.logic";
import { ForecastPageSchema } from "@ui/pages/forecasts/forecastPage.zod";

const ForecastTableUploadButton = <TFieldValues extends ForecastPageSchema>({
  tableData,
  setValue,
}: {
  tableData: ForecastTableDto;
  setValue: UseFormSetValue<TFieldValues>;
}) => {
  const { copy } = useContent();
  const { isClient } = useMounted();

  const { handleSubmit, register } = useForm<{ file: FileList }>();

  if (!isClient) return null;

  return (
    <form
      onSubmit={handleSubmit(async ({ file: [file] }) => {
        const spreadsheet = new ForecastTableSpreadsheet({ tableData, copy });
        await spreadsheet.import(await file.arrayBuffer());
        const data = await spreadsheet.extractWorksheets();

        const profiles: Record<string, string> = {};

        for (const { costCategory, periods } of data) {
          const costCatData = tableData.costCategories.find(x => x.costCategoryName === costCategory);

          for (let i = 0; i < periods.length; i++) {
            const periodNumber = i + 1;
            const periodValue = periods[i];
            const profileId = costCatData?.profiles.find(x => x.periodId === periodNumber)?.profileId;

            if (profileId) profiles[profileId] = String(periodValue);
          }
        }

        setValue("profile", profiles);
      })}
    >
      <FormGroup>
        <Fieldset>
          <FileInput {...register("file")} />
          <button type="submit">import</button>
        </Fieldset>
      </FormGroup>
    </form>
  );
};

export { ForecastTableUploadButton };
