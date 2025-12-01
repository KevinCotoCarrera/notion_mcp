import { locales, defaultLocale } from "../lib/services/i18n/config";

/**
 * Exports the i18n configuration object containing the available locales and the default locale.
 *
 * @remarks
 * This file serves as a proxy to expose the i18n configuration within `src/i18n/config.ts`,
 * while the actual configuration is maintained at `src/lib/services/i18n/config.ts`.
 * This indirection is required because certain dependencies or tooling expect the i18n config
 * to be available at `src/i18n/config.ts`. By re-exporting from the real config path,
 * we avoid duplicating configuration logic and ensure consistency across the project.
 *
 * @see src/lib/services/i18n/config.ts
 * @see locales
 * @see defaultLocale
 */
export default {
  locales,
  defaultLocale,
};
