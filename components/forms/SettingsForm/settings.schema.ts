import { z } from "zod";

export const settingsGeneralSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export const settingsPreferencesSchema = z.object({
  notificationsEnabled: z.boolean(),
});

export const settingsSaveModeSchema = z.enum(["full", "preferences"]);

export const settingsFormSchema = settingsGeneralSchema
  .merge(settingsPreferencesSchema)
  .merge(z.object({ saveMode: settingsSaveModeSchema }));

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;
export type SettingsSaveMode = z.infer<typeof settingsSaveModeSchema>;

export const settingsGeneralFormFields = ["title", "description"] as const satisfies Array<
  keyof SettingsFormValues
>;

export const settingsPreferencesFormFields = [
  "notificationsEnabled",
] as const satisfies Array<keyof SettingsFormValues>;

export type SettingsApiResponse = {
  title: string;
  description: string;
  notificationsEnabled: boolean;
};

export const parseApiToSettingsForm = (api?: SettingsApiResponse | null): SettingsFormValues => ({
  title: api?.title ?? "",
  description: api?.description ?? "",
  notificationsEnabled: api?.notificationsEnabled ?? false,
  saveMode: "full",
});
