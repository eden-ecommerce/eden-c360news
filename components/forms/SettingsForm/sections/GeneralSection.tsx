"use client";

import { FormField } from "@components/forms/FormField";
import { useFormFieldStyles } from "@components/forms/useFormFieldStyles";
import type { SettingsFormValues } from "@components/forms/SettingsForm/settings.schema";
import { Input } from "@components/ui/input";
import { useFormikContext } from "formik";

export function GeneralSection() {
  const formik = useFormikContext<SettingsFormValues>();
  const { getFieldClassName } = useFormFieldStyles<SettingsFormValues>();

  return (
    <div className="space-y-4">
      <FormField
        label="Title"
        name="title"
        error={formik.errors.title}
        touched={formik.touched.title}
        required
      >
        <Input
          id="title"
          {...formik.getFieldProps("title")}
          className={getFieldClassName("title")}
        />
      </FormField>
      <FormField
        label="Description"
        name="description"
        error={formik.errors.description}
        touched={formik.touched.description}
      >
        <Input
          id="description"
          {...formik.getFieldProps("description")}
          className={getFieldClassName("description")}
        />
      </FormField>
    </div>
  );
}
