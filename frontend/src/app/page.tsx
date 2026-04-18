"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSafeTranslations } from "@/hooks/use-safe-translations";
import { AppShell } from "@/components/app-shell";
import { DecisionCard } from "@/components/decision-card";
import { CropInputModule } from "@/components/crop-input";
import { PriceChart } from "@/components/price-chart";
import { useAppStore } from "@/lib/store";
import {
  getRecommendation,
  getMandiComparison,
  CROPS,
  MOCK_ALERTS,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  BarChart3,
  Bell,
  ArrowRight,
  Sprout,
  IndianRupee,
  MapPin,
  Zap,
  Store,
} from "lucide-react";
import Link from "next/link";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function HomePage() {
  const t = useSafeTranslations();
  const { selectedCrop, quantity, location, language } = useAppStore();
  const [showResult, setShowResult] = useState(false);

  const recommendation = useMemo(
    () => getRecommendation(selectedCrop, quantity, location),
    [selectedCrop, quantity, location]
  );

  const topMandis = useMemo(
    () => getMandiComparison(selectedCrop, quantity).slice(0, 3),
    [selectedCrop, quantity]
  );

  const selectedCropData = CROPS.find((c) => c.id === selectedCrop);
  const recentAlerts = MOCK_ALERTS.slice(0, 3);

  return (
    <AppShell>
      {/* ===== HERO SECTION ===== */}
      <section className="py-8 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left — Headline + Input */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div variants={fadeIn} custom={0}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-bg-highlight text-primary mb-4">
                <Zap size={14} />
                {t("navigation.predictions")} AI-Powered Decision Engine
              </span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-[var(--font-size-hero)] font-extrabold leading-tight text-text-primary mb-4"
              style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
            >
              {t("dashboard.heroTitle")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-xl mb-8"
            >
              {t("dashboard.heroSubtitle")}
            </motion.p>

            <motion.div variants={fadeIn} custom={3}>
              <div className="bg-white rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)]">
                <CropInputModule onSubmit={() => setShowResult(true)} />
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Decision Card or Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {showResult ? (
              <DecisionCard recommendation={recommendation} />
            ) : (
              <div className="relative">
                {/* Animated Farm Visual */}
                <div className="rounded-2xl bg-gradient-to-br from-bg-highlight via-white to-bg-section p-8 lg:p-12 text-center">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="text-8xl mb-6"
                  >
                    🌾
                  </motion.div>
                  <h3
                    className="font-bold text-lg text-text-primary mb-4"
                    style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
                  >
                    {t("dashboard.sellLaterTitle")}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {t("dashboard.sellLaterSubtitle")}
                  </p>

                  {/* Stats preview */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    {[
                      { icon: Sprout, label: t("dashboard.stats.crops"), sub: t("common.profit") },
                      { icon: MapPin, label: t("dashboard.stats.mandis"), sub: t("common.profit") },
                      { icon: IndianRupee, label: t("dashboard.stats.profit"), sub: t("common.profit") },
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + idx * 0.15 }}
                        className="text-center"
                      >
                        <stat.icon
                          size={24}
                          className="mx-auto mb-1 text-primary-button"
                        />
                        <p className="text-sm font-bold text-text-primary">
                          {stat.label}
                        </p>
                        <p className="text-xs text-text-secondary">{stat.sub}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ===== PRICE TREND ===== */}
      {showResult && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="py-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-text-primary"
                style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
              >
                {t("predictions.trend")} — {selectedCropData?.[language === 'en' ? 'name' : 'nameHi'] || selectedCropData?.name}
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                30-day history + 15-day forecast
              </p>
            </div>
            <Link
              href="/predictions"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-button transition-colors"
            >
              {t("navigation.settings")} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="bg-white rounded-[var(--radius-card)] p-4 md:p-6 shadow-[var(--shadow-card)]">
            <PriceChart basePrice={recommendation.currentPrice} height={280} />
          </div>
        </motion.section>
      )}

      {/* ===== TOP MANDIS ===== */}
      {showResult && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="py-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="text-xl md:text-2xl font-bold text-text-primary"
                style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
              >
                {t("dashboard.topMandis")}
              </h2>
              <p className="text-sm text-text-secondary mt-1">
                {t("market.bestNetProfit")} & {t("simulator.costs.transport")}
              </p>
            </div>
            <Link
              href="/market"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-button transition-colors"
            >
              {t("market.searchPlaceholder")} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topMandis.map((mandi, idx) => (
              <motion.div
                key={mandi.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="bg-white rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-primary-button bg-bg-highlight px-2 py-0.5 rounded-full">
                    #{idx + 1}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {mandi.distance} km
                  </span>
                </div>
                <h4 className="font-bold text-text-primary mb-1">{mandi.name}</h4>
                <p className="text-xs text-text-secondary mb-3">
                  {mandi.district}, {mandi.state}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{t("common.currentPrice")}</span>
                    <span className="font-semibold">
                      {formatCurrency(mandi.currentPrice)}/{t("common.perQuintal")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">{t("simulator.costs.transport")}</span>
                    <span className="font-medium text-loss">
                      -{formatCurrency(mandi.transportTotal)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between text-sm">
                    <span className="font-semibold text-text-primary">
                      {t("common.netProfit")}
                    </span>
                    <span className="profit-text text-lg">
                      {formatCurrency(mandi.netProfit)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ===== QUICK ACTIONS + ALERTS ===== */}
      <section className="py-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div>
            <h2
              className="text-xl font-bold text-text-primary mb-4"
              style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
            >
              {t("profile.activity")}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  href: "/market",
                  icon: Store,
                  label: t("navigation.market"),
                  color: "#2F5D3A",
                },
                {
                  href: "/predictions",
                  icon: TrendingUp,
                  label: t("navigation.predictions"),
                  color: "#4E7C4F",
                },
                {
                  href: "/simulator",
                  icon: Zap,
                  label: t("navigation.simulator"),
                  color: "#8B5E3C",
                },
                {
                  href: "/alerts",
                  icon: Bell,
                  label: t("navigation.alerts"),
                  color: "#C89B3C",
                },
              ].map((action, idx) => (
                <Link
                  key={idx}
                  href={action.href}
                  className="bg-white rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all hover:-translate-y-0.5 flex flex-col items-center gap-2 text-center"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: action.color + "18" }}
                  >
                    <action.icon size={20} style={{ color: action.color }} />
                  </div>
                  <span className="text-sm font-medium text-text-primary">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-bold text-text-primary"
                style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
              >
                {t("navigation.alerts")}
              </h2>
              <Link
                href="/alerts"
                className="text-sm font-medium text-primary hover:text-primary-button transition-colors"
              >
                {t("navigation.settings")}
              </Link>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-card)] flex items-start gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      backgroundColor:
                        alert.type === "opportunity"
                          ? "rgba(63, 163, 77, 0.12)"
                          : alert.type === "urgent"
                          ? "rgba(178, 58, 58, 0.12)"
                          : "rgba(200, 155, 60, 0.12)",
                    }}
                  >
                    <Bell
                      size={16}
                      style={{
                        color:
                          alert.type === "opportunity"
                            ? "#3FA34D"
                            : alert.type === "urgent"
                            ? "#B23A3A"
                            : "#C89B3C",
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-text-primary">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                      {alert.message}
                    </p>
                  </div>
                  {alert.priceChange && (
                    <span
                      className="text-xs font-bold flex-shrink-0"
                      style={{
                        color:
                          alert.priceChange > 0
                            ? "var(--color-profit)"
                            : "var(--color-loss)",
                      }}
                    >
                      {alert.priceChange > 0 ? "+" : ""}
                      {alert.priceChange}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
