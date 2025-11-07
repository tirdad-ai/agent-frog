"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { LOCALES, LOCALE_NAMES } from "@repo/i18n/constants";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract current locale from pathname (e.g., /en/auth/login → en)
  const currentLocale =
    LOCALES.find((locale) => pathname.startsWith(`/${locale}`)) || "en";

  const switchLocale = (newLocale: string) => {
    // Replace current locale in path with new locale
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex gap-2">
      {LOCALES.map((locale) => {
        const localeName = LOCALE_NAMES[locale as keyof typeof LOCALE_NAMES];
        return (
          <Button
            key={locale}
            variant={currentLocale === locale ? "default" : "outline"}
            size="sm"
            onClick={() => switchLocale(locale)}
          >
            {localeName?.native || locale}
          </Button>
        );
      })}
    </div>
  );
}
