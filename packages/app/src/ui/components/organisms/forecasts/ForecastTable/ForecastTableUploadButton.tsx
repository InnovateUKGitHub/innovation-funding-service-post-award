import { ForecastTableSpreadsheet } from "@framework/documents/spreadsheets/ForecastTableSpreadsheet";
import { Fieldset } from "@ui/components/atoms/form/Fieldset/Fieldset";
import { FileInput } from "@ui/components/atoms/form/FileInput/FileInput";
import { FormGroup } from "@ui/components/atoms/form/FormGroup/FormGroup";
import { useMounted } from "@ui/context/Mounted";
import { useContent } from "@ui/hooks/content.hook";
import { useForm, UseFormSetValue } from "react-hook-form";
import { ForecastTableDto } from "./NewForecastTable.logic";
import { ForecastPageSchema } from "@ui/pages/forecasts/forecastPage.zod";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";

class TemplateException extends Error {}

const ForecastTableUploadButton = <TFieldValues extends ForecastPageSchema>({
  tableData,
  setValue,
}: {
  tableData: ForecastTableDto;
  setValue: UseFormSetValue<TFieldValues>;
}) => {
  const { copy } = useContent();
  const { isClient } = useMounted();
  const { handleSubmit, register, formState, setError } = useForm<{ file: FileList }>();

  if (!isClient) return null;

  return (
    <form
      onSubmit={handleSubmit(async ({ file: [file] }) => {
        const spreadsheet = new ForecastTableSpreadsheet({ tableData, copy });
        await spreadsheet.import(await file.arrayBuffer());
        const data = await spreadsheet.extractWorksheets();

        try {
          const profiles: Record<string, string> = {};

          for (const { costCategory, periods } of data) {
            const costCatData = tableData.costCategories.find(x => x.costCategoryName === costCategory);

            if (!costCatData) throw new TemplateException();
            if (periods.length !== costCatData.profiles.length) throw new TemplateException();

            for (let i = 0; i < periods.length; i++) {
              const periodNumber = i + 1;
              const periodValue = periods[i];
              const profileId = costCatData?.profiles.find(x => x.periodId === periodNumber)?.profileId;

              if (profileId) profiles[profileId] = String(periodValue);
            }
          }

          setValue("profile", profiles);
        } catch (e) {
          console.log(e);
          if (e instanceof TemplateException) {
            setError(
              "file",
              { message: "The selected file must use the template.", type: "custom" },
              { shouldFocus: true },
            );
          }
        }
      })}
    >
      <FormGroup hasError={!!formState.errors.file}>
        <ValidationError error={formState.errors.file} />
        <FileInput {...register("file")} />
        <button type="submit">import</button>
      </FormGroup>
    </form>
  );
};

export { ForecastTableUploadButton };
