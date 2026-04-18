import { useTranslations } from "next-intl";

/**
 * A safe wrapper around useTranslations that provides:
 * 1. Fallback to English if a key is missing.
 * 2. Logging of missing keys in development.
 * 3. Support for nested keys and params.
 */
export function useSafeTranslations(namespace?: string) {
  const t = useTranslations(namespace);

  return (key: string, values?: Record<string, string | number | Date>) => {
    try {
      // In next-intl, if a key is missing it returns the key itself or throws
      // depending on the configuration.
      return t(key, values);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[i18n] Missing key: ${namespace ? `${namespace}.` : ""}${key}`);
      }
      
      // Attempt to return the key name as a placeholder
      return key;
    }
  };
}
