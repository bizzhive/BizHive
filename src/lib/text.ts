export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const fillTemplate = (
  template: string,
  values: Record<string, string | number | null | undefined>
) =>
  template.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: string) => {
    const value = values[key];
    return value === null || value === undefined || value === ""
      ? `{{${key}}}`
      : String(value);
  });
