"use client";

import { FormField } from "@components/forms/FormField";
import { useFormFieldStyles } from "@components/forms/useFormFieldStyles";
import type { OnboardingFormValues } from "@components/forms/OnboardingForm/onboarding.schema";
import { Input } from "@components/ui/input";
import { useFormikContext } from "formik";

export function ContactSection() {
  const formik = useFormikContext<OnboardingFormValues>();
  const { getFieldClassName } = useFormFieldStyles<OnboardingFormValues>();

  return (
    <div className="space-y-4">
      <FormField
        label="Email"
        name="email"
        error={formik.errors.email}
        touched={formik.touched.email}
        required
      >
        <Input
          id="email"
          type="email"
          {...formik.getFieldProps("email")}
          className={getFieldClassName("email")}
        />
      </FormField>
      <FormField
        label="Phone"
        name="phone"
        error={formik.errors.phone}
        touched={formik.touched.phone}
      >
        <Input
          id="phone"
          {...formik.getFieldProps("phone")}
          className={getFieldClassName("phone")}
        />
      </FormField>
    </div>
  );
}
