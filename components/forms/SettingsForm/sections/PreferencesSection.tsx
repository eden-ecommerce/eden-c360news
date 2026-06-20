"use client";

import { Button } from "@components/ui/button";
import { FormField } from "@components/forms/FormField";
import { useFormFieldStyles } from "@components/forms/useFormFieldStyles";
import type { SettingsFormValues } from "@components/forms/SettingsForm/settings.schema";
import { useFormikContext } from "formik";

export function PreferencesSection() {
  const formik = useFormikContext<SettingsFormValues>();
  const { getFieldClassName } = useFormFieldStyles<SettingsFormValues>();

  const handleSaveSection = async () => {
    await formik.setFieldValue("saveMode", "preferences");
    await formik.submitForm();
  };

  return (
    <div className="space-y-4">
      <FormField label="Notifications" name="notificationsEnabled">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formik.values.notificationsEnabled}
            onChange={(event) =>
              void formik.setFieldValue("notificationsEnabled", event.target.checked)
            }
            className={getFieldClassName("notificationsEnabled")}
          />
          Enable notifications
        </label>
      </FormField>
      <Button type="button" variant="outline" onClick={() => void handleSaveSection()}>
        Save section
      </Button>
    </div>
  );
}
