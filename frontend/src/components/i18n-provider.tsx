"use client";

import { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import { useAppStore } from "@/lib/store";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const language = useAppStore((state) => state.language);
  const [messages, setMessages] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMessages() {
      try {
        setLoading(true);
        // Load English as base
        const enModule = await import(`../../messages/en.json`);
        const enMessages = enModule.default;

        if (language === "en") {
          setMessages(enMessages);
        } else {
          // Load current language and merge with EN fallback
          const targetModule = await import(`../../messages/${language}.json`);
          setMessages({ ...enMessages, ...targetModule.default });
        }
      } catch (err) {
        console.error("Failed to load language files:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMessages();
  }, [language]);

  if (loading) {
    return null; // Or a very generic skeleton
  }

  return (
    <NextIntlClientProvider locale={language} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
