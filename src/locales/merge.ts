type Primitive = string | number | boolean | null | undefined;

export type DeepPartial<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : { [K in keyof T]?: DeepPartial<T[K]> };

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const mergeLocale = <T>(base: T, override: DeepPartial<T>): T => {
  if (Array.isArray(base) || Array.isArray(override)) {
    return (override as T) ?? base;
  }

  if (!isPlainObject(base) || !isPlainObject(override)) {
    return (override as T) ?? base;
  }

  const nextValue: Record<string, unknown> = { ...base };

  Object.keys(override).forEach((key) => {
    const baseValue = (base as Record<string, unknown>)[key];
    const overrideValue = override[key as keyof typeof override];

    if (overrideValue === undefined) {
      return;
    }

    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      nextValue[key] = mergeLocale(baseValue, overrideValue);
      return;
    }

    nextValue[key] = overrideValue;
  });

  return nextValue as T;
};
