import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/components/atomicDesign/atoms/Button/Button";
import { Section } from "@ui/components/atomicDesign/atoms/Section/Section";
import { DropdownSelect } from "@ui/components/atomicDesign/atoms/form/Dropdown/Dropdown";
import { FormTypes } from "@ui/zod/FormTypes";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  PageCrasherValidationSchemaType,
  pageCrasherValidationSchema,
  pageCrasherValidationErrorMap,
  pageCrasherValidCrashTypesArray,
} from "./PageCrasher.logic";
import { useContent } from "@ui/hooks/content.hook";
import { Form } from "@ui/components/atomicDesign/atoms/form/Form/Form";

const FormCrasher = () => {
  const { getContent } = useContent();
  const { register, watch } = useForm<z.output<PageCrasherValidationSchemaType>>({
    resolver: zodResolver(pageCrasherValidationSchema, { errorMap: pageCrasherValidationErrorMap }),
  });
  const crashOptions = useMemo(() => pageCrasherValidCrashTypesArray.map(x => ({ id: x, value: x })), []);

  return (
    <Section title="Page Crasher">
      <Form>
        <input type="hidden" {...register("form")} value={FormTypes.DeveloperPageCrasher} />
        <DropdownSelect {...register("crashType")} options={crashOptions} />
        <div>
          <Button type="submit" styling="Primary">
            {getContent(x => x.components.pageCrasher.throw({ name: watch("crashType") }))}
          </Button>
        </div>
      </Form>
    </Section>
  );
};

export { FormCrasher };
