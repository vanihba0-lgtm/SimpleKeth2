"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { useSafeTranslations } from "@/hooks/use-safe-translations";
import {
  Home,
  BarChart3,
  TrendingUp,
  Sliders,
  Bell,
  MapPin,
  User,
  Settings,
  Menu,
  X,
  Globe,
  Store,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "dashboard", icon: Home },
  { href: "/market", label: "market", icon: Store },
  { href: "/predictions", label: "predictions", icon: TrendingUp },
  { href: "/simulator", label: "simulator", icon: Sliders },
  { href: "/alerts", label: "alerts", icon: Bell },
  { href: "/map", label: "map", icon: MapPin },
  { href: "/profile", label: "profile", icon: User },
  { href: "/settings", label: "settings", icon: Settings },
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "te", name: "తెలుగు" },
  { code: "ta", name: "தமிழ்" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "mr", name: "मराठी" },
  { code: "bn", name: "বাংলা" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "or", name: "ଓଡ଼ିଆ" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { language, setLanguage } = useAppStore();
  const t = useSafeTranslations();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col bg-white border-r border-border z-50">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌾</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-primary" style={{ fontFamily: "Sora, sans-serif" }}>
                SimpleKeth
              </h1>
              <p className="text-xs text-text-secondary -mt-0.5">{language === 'en' ? 'Smart Farming Decisions' : t("dashboard.heroTitle").split(" ")[0]}</p>
            </div>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-[var(--radius-button)] text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-bg-highlight text-primary"
                    : "text-text-secondary hover:bg-bg-section hover:text-text-primary"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={20} />
                {t(`navigation.${item.label}`)}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-bg-highlight transition-colors text-text-secondary"
            >
              <Globe size={20} />
              <span className="text-sm font-medium">{LANGUAGES.find(l => l.code === language)?.name || t("settings.language")}</span>
            </button>
            <AnimatePresence>
              {langMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-xl shadow-lg border border-border overflow-hidden z-50 max-h-60 overflow-y-auto"
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                        language === lang.code ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-bg-highlight"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-50 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-sm">🌾</span>
          </div>
          <span className="font-bold text-lg text-primary" style={{ fontFamily: "Sora, sans-serif" }}>
            SimpleKeth
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-bg-section transition-colors"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.nav
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="lg:hidden fixed left-0 top-16 bottom-0 w-72 bg-white z-50 border-r border-border py-4 px-3 overflow-y-auto"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-button)] text-base font-medium transition-all ${
                  isActive
                    ? "bg-bg-highlight text-primary"
                    : "text-text-secondary hover:bg-bg-section"
                }`}
              >
                <item.icon size={22} />
                {t(`navigation.${item.label}`)}
              </Link>
            );
          })}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="px-4 text-xs font-bold text-text-secondary uppercase mb-2">{t("settings.language")}</p>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`w-full text-left px-4 py-3 text-sm font-medium rounded-lg ${
                  language === lang.code ? "bg-primary/10 text-primary" : "text-text-secondary"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </motion.nav>
      )}

      {/* Mobile Bottom Tab Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border z-40 flex items-center justify-around px-2">
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-all ${
                isActive ? "text-primary" : "text-text-secondary"
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{t(`navigation.${item.label}`)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
