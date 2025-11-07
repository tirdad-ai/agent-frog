import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";
import { LOCALES, DEFAULT_LOCALE } from "./constants";

/**
 * Default routing configuration
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
});

/**
 * Pre-configured navigation utilities
 */
const navigation = createNavigation(routing);
export const Link: any = navigation.Link;
export const redirect: any = navigation.redirect;
export const usePathname: any = navigation.usePathname;
export const useRouter: any = navigation.useRouter;
export const getPathname: any = navigation.getPathname;
