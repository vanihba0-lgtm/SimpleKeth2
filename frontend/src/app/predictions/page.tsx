"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSafeTranslations } from "@/hooks/use-safe-translations";
import { AppShell } from "@/components/app-shell";
import { PriceChart } from "@/components/price-chart";
import { useAppStore } from "@/lib/store";
import { CROPS, MANDIS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Calendar, ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react";

export default function PredictionsPage() {
  const t = useSafeTranslations();
  const { selectedCrop, language } = useAppStore();
  const [selectedMandiId, setSelectedMandiId] = useState(MANDIS[0].id);
  const cropData = CROPS.find((c) => c.id === selectedCrop);
  const mandi = MANDIS.find((m) => m.id === selectedMandiId) ?? MANDIS[0];

  const priceChanges = useMemo(() => {
    return {
      "7d": {
        value: mandi.predictedPrice7d - mandi.currentPrice,
        pct: ((mandi.predictedPrice7d - mandi.currentPrice) / mandi.currentPrice * 100).toFixed(1),
      },
      "15d": {
        value: mandi.predictedPrice15d - mandi.currentPrice,
        pct: ((mandi.predictedPrice15d - mandi.currentPrice) / mandi.currentPrice * 100).toFixed(1),
      },
      "30d": {
        value: mandi.predictedPrice30d - mandi.currentPrice,
        pct: ((mandi.predictedPrice30d - mandi.currentPrice) / mandi.currentPrice * 100).toFixed(1),
      },
    };
  }, [mandi]);

  return (
    <AppShell>
      <section className="py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1
            className="text-2xl md:text-[var(--font-size-h2)] font-extrabold text-text-primary mb-2"
            style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
          >
            {t("navigation.predictions")}
          </h1>
          <p className="text-text-secondary mb-8">
            {cropData?.icon} {cropData?.[language === 'en' ? 'name' : 'nameHi'] || cropData?.name} · {t("dashboard.visualOverview")}
          </p>
        </motion.div>

        {/* Mandi Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-2">{t("market.searchPlaceholder").split(" ")[0]}</label>
          <div className="flex flex-wrap gap-2">
            {MANDIS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMandiId(m.id)}
                className={`px-4 py-2 rounded-[var(--radius-button)] text-sm font-medium transition-all ${
                  selectedMandiId === m.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-text-secondary border border-border hover:border-primary-button hover:text-primary"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Prediction Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "7-Day Forecast", key: "7d" as const, price: mandi.predictedPrice7d },
            { label: "15-Day Forecast", key: "15d" as const, price: mandi.predictedPrice15d },
            { label: "30-Day Forecast", key: "30d" as const, price: mandi.predictedPrice30d },
          ].map((item, idx) => {
            const change = priceChanges[item.key];
            const isUp = change.value >= 0;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-text-secondary flex items-center gap-1">
                    <Calendar size={12} /> {item.label.replace("Forecast", t("predictions.predicted"))}
                  </span>
                  <span
                    className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                      isUp ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"
                    }`}
                  >
                    {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {isUp ? "+" : ""}
                    {change.pct}%
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-text-primary">
                  {formatCurrency(item.price)}
                  <span className="text-sm font-normal text-text-secondary">/quintal</span>
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {isUp ? "↑" : "↓"} {formatCurrency(Math.abs(change.value))} {t("common.fromToday")}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[var(--radius-card)] p-4 md:p-6 shadow-[var(--shadow-card)] mb-8"
        >
          <div className="flex items-center justify-between mb-4">
          </div>
          <PriceChart basePrice={mandi.currentPrice} height={350} />
        </motion.div>

        {/* Key Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h3
            className="text-lg font-bold text-text-primary mb-4"
            style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
          >
            {t("predictions.insights")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: TrendingUp,
                title: t("predictions.uptrend"),
                text: `Market arrivals are slowing down this week, which might push the price up by 3-5% in the next 7 days.`,
                color: "var(--color-profit)",
              },
              {
                icon: TrendingDown,
                title: t("predictions.correction"),
                text: `Bulk harvests from neighboring states are expected in 20 days. Prices may stabilize or dip slightly.`,
                color: "var(--color-warning)",
              },
            ].map((insight, idx) => (
              <div
                key={idx}
                className="bg-white rounded-[var(--radius-card)] p-5 shadow-[var(--shadow-card)] flex gap-4"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: insight.color + "14" }}
                >
                  <insight.icon size={20} style={{ color: insight.color }} />
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">{insight.title}</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </AppShell>
  );
}
