"use client";

import { motion } from "framer-motion";
import { useSafeTranslations } from "@/hooks/use-safe-translations";
import { AppShell } from "@/components/app-shell";
import { useAppStore } from "@/lib/store";
import {
  Globe,
  MessageSquare,
  Mic,
  Bell,
  Moon,
  Shield,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${
        enabled ? "bg-profit" : "bg-border"
      }`}
    >
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const {
    language,
    smsEnabled,
    voiceEnabled,
    pushEnabled,
    setLanguage,
    setSmsEnabled,
    setVoiceEnabled,
    setPushEnabled,
  } = useAppStore();
  const t = useSafeTranslations();

  return (
    <AppShell>
      <section className="py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1
            className="text-2xl md:text-[var(--font-size-h2)] font-extrabold text-text-primary mb-2"
            style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
          >
            {t("navigation.settings")}
          </h1>
          <p className="text-text-secondary mb-8">
            {t("settings.subtitle")}
          </p>
        </motion.div>

        <div className="max-w-2xl space-y-6">
          {/* Language */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)]"
          >
            <h3
              className="font-bold text-text-primary mb-4 flex items-center gap-2"
              style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
            >
              <Globe size={18} className="text-primary" /> {t("settings.language")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { key: "en", label: "English", native: "English" },
                { key: "hi", label: "Hindi", native: "हिंदी" },
                { key: "te", label: "Telugu", native: "తెలుగు" },
                { key: "ta", label: "Tamil", native: "தமிழ்" },
                { key: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
                { key: "mr", label: "Marathi", native: "मराठी" },
                { key: "bn", label: "Bengali", native: "বাংলা" },
                { key: "gu", label: "Gujarati", native: "ગુજરાતી" },
                { key: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
                { key: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
              ].map((lang) => (
                <button
                  key={lang.key}
                  onClick={() => setLanguage(lang.key as any)}
                  className={`p-3 rounded-xl text-center font-medium transition-all ${
                    language === lang.key
                      ? "bg-primary text-white shadow-md"
                      : "bg-bg-section text-text-secondary border border-border hover:border-primary-button"
                  }`}
                >
                  <p className="text-sm font-bold">{lang.native}</p>
                  <p className="text-[10px] mt-0.5 opacity-70">{lang.label}</p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)]"
          >
            <h3
              className="font-bold text-text-primary mb-4 flex items-center gap-2"
              style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
            >
              <Bell size={18} className="text-primary" /> {t("settings.notifications")}
            </h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-bg-highlight flex items-center justify-center">
                    <MessageSquare size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary text-sm">{t("settings.smsLabel")}</p>
                    <p className="text-xs text-text-secondary">
                      {t("settings.smsDesc")}
                    </p>
                  </div>
                </div>
                <ToggleSwitch enabled={smsEnabled} onChange={setSmsEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-bg-highlight flex items-center justify-center">
                    <Mic size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary text-sm">{t("settings.voiceLabel")}</p>
                    <p className="text-xs text-text-secondary">
                      {t("settings.voiceDesc")}
                    </p>
                  </div>
                </div>
                <ToggleSwitch enabled={voiceEnabled} onChange={setVoiceEnabled} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-bg-highlight flex items-center justify-center">
                    <Bell size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary text-sm">{t("settings.pushLabel")}</p>
                    <p className="text-xs text-text-secondary">
                      {t("settings.pushDesc")}
                    </p>
                  </div>
                </div>
                <ToggleSwitch enabled={pushEnabled} onChange={setPushEnabled} />
              </div>
            </div>
          </motion.div>

          {/* More Options */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)]"
          >
            <h3
              className="font-bold text-text-primary mb-4"
              style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
            >
              {t("settings.more")}
            </h3>
            <div className="space-y-1">
              {[
                { icon: Moon, label: t("settings.darkMode"), sub: "v1.0.0" },
                { icon: Shield, label: t("settings.privacy"), sub: "SimpleKeth" },
                { icon: HelpCircle, label: t("settings.help"), sub: "Support" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-bg-section transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} className="text-text-secondary" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-text-primary">{item.label}</p>
                      <p className="text-xs text-text-secondary">{item.sub}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-text-secondary" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* App Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center py-6 text-xs text-text-secondary"
          >
            <p className="font-medium">SimpleKeth v1.0.0</p>
            <p className="mt-1">AI-Powered Decision Intelligence for Farmers</p>
            <p className="mt-0.5">© 2026 SimpleKeth. All rights reserved.</p>
          </motion.div>
        </div>
      </section>
    </AppShell>
  );
}
