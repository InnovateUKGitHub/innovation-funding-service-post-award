import { validTypingCurrencyRegex } from "@framework/util/numberHelper";
import { NumberInput } from "@ui/components/atomicDesign/atoms/form/NumberInput/NumberInput";
import { ForecastTableSchemaType } from "@ui/zod/forecastTableValidation.zod";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { Control, Controller } from "react-hook-form";
import { z } from "zod";

interface ForecastTableCurrencyInputProps {
  costCategoryId: string;
  periodId: number;
  profileId: string;
  control: Control<z.output<ForecastTableSchemaType>>;
  defaultValue?: string;
  disabled?: boolean;
}

const ForecastTableCurrencyInput = ({
  costCategoryId,
  periodId,
  profileId,
  control,
  defaultValue,
  disabled,
  ...props
}: ForecastTableCurrencyInputProps & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
  return (
    <Controller
      name={`profile.${profileId}`}
      control={control}
      defaultValue={defaultValue}
      render={({ field: { onChange, onBlur, value, name, ref }, fieldState: { invalid } }) => (
        <NumberInput
          {...props}
          id={`profile_${profileId}`}
          data-qa={`profile_${costCategoryId}_period-${periodId}`}
          className="govuk-!-font-size-16"
          onChange={e => {
            const valueAsString = e.target.value;
            if (validTypingCurrencyRegex.test(valueAsString)) {
              onChange(valueAsString);
            }
          }}
          onBlur={onBlur}
          value={value}
          name={name}
          ref={ref}
          hasError={invalid}
          disabled={disabled}
        />
      )}
    ></Controller>
  );
};

export { ForecastTableCurrencyInput };
