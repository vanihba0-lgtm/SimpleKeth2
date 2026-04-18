"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSafeTranslations } from "@/hooks/use-safe-translations";
import { AppShell } from "@/components/app-shell";
import { MANDIS, CROPS } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { MapPin, TrendingUp, ArrowUpRight, ArrowDownRight, Navigation } from "lucide-react";

export default function MapPage() {
  const t = useSafeTranslations();
  const { selectedCrop, language } = useAppStore();
  const cropData = CROPS.find((c) => c.id === selectedCrop);

  // Sort mandis by current price to create heatmap effect
  const sortedMandis = useMemo(
    () => [...MANDIS].sort((a, b) => b.currentPrice - a.currentPrice),
    []
  );
  const maxPrice = sortedMandis[0]?.currentPrice ?? 1;
  const minPrice = sortedMandis[sortedMandis.length - 1]?.currentPrice ?? 0;

  const getHeatColor = (price: number) => {
    const ratio = (price - minPrice) / (maxPrice - minPrice);
    if (ratio > 0.7) return { bg: "#3FA34D", text: "#fff", label: "High" };
    if (ratio > 0.4) return { bg: "#C89B3C", text: "#fff", label: "Medium" };
    return { bg: "#B23A3A", text: "#fff", label: "Low" };
  };

  return (
    <AppShell>
      <section className="py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1
            className="text-2xl md:text-[var(--font-size-h2)] font-extrabold text-text-primary mb-2"
            style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
          >
            {t("navigation.map")}
          </h1>
          <p className="text-text-secondary mb-6">
            {cropData?.icon} {cropData?.[language === 'en' ? 'name' : 'nameHi'] || cropData?.name} — {t("dashboard.visualOverview")}
          </p>
        </motion.div>

        {/* Legend */}
        <div className="bg-white rounded-2xl p-4 shadow-[var(--shadow-card)] flex flex-col gap-4 mb-8">
          <h3 className="text-sm font-bold text-text-primary">{t("predictions.levelTitle")}</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: t("map.high"), color: "var(--color-profit)" },
              { label: t("map.medium"), color: "var(--color-warning)" },
              { label: t("map.low"), color: "var(--color-loss)" },
            ].map((item) => (
              <span key={item.label} className="flex items-center gap-2 text-sm">
                <span className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Visual Map Grid */}
        <div className="bg-white rounded-[var(--radius-card)] p-6 md:p-8 shadow-[var(--shadow-card)] mb-8">
          <div className="relative w-full" style={{ minHeight: 400 }}>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-bg-highlight/50 to-bg-section/50 border-2 border-dashed border-border/40" />

            {sortedMandis.map((mandi, idx) => {
              const heat = getHeatColor(mandi.currentPrice);
              const top = Math.max(8, Math.min(80, 100 - ((mandi.lat - 10) / 20) * 80));
              const left = Math.max(8, Math.min(85, ((mandi.lng - 72) / 10) * 80));

              return (
                <motion.div
                  key={mandi.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.12, type: "spring", stiffness: 200 }}
                  className="absolute group cursor-pointer"
                  style={{ top: `${top}%`, left: `${left}%` }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform group-hover:scale-125"
                    style={{ backgroundColor: heat.bg }}
                  >
                    <MapPin size={18} color={heat.text} />
                  </div>

                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                    <div className="bg-white rounded-xl shadow-xl p-4 border border-border min-w-48">
                      <h4 className="font-bold text-text-primary text-sm">{mandi.name}</h4>
                      <p className="text-xs text-text-secondary mb-2">
                        {mandi.district}, {mandi.state}
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-text-secondary">{t("common.currentPrice")}</span>
                          <span className="font-bold">{formatCurrency(mandi.currentPrice)}/{t("common.perQuintal")}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-text-secondary">7-day</span>
                          <span className="font-bold flex items-center gap-0.5">
                            {formatCurrency(mandi.predictedPrice7d)}
                            {mandi.predictedPrice7d > mandi.currentPrice ? (
                              <ArrowUpRight size={10} className="text-profit" />
                            ) : (
                              <ArrowDownRight size={10} className="text-loss" />
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-text-secondary">{t("common.distance")}</span>
                          <span className="font-medium">{mandi.distance} km</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-center mt-1 whitespace-nowrap text-text-secondary">
                    {mandi.name.split(" ")[0]}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* List View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3
            className="text-lg font-bold text-text-primary mb-4"
            style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
          >
            {t("map.heatmap")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedMandis.map((mandi, idx) => {
              const heat = getHeatColor(mandi.currentPrice);
              const priceBarWidth = ((mandi.currentPrice - minPrice) / (maxPrice - minPrice)) * 100;

              return (
                <motion.div
                  key={mandi.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.06 }}
                  className="bg-white rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: heat.bg }}
                      />
                      <div>
                        <h4 className="font-semibold text-sm text-text-primary">{mandi.name}</h4>
                        <p className="text-xs text-text-secondary">
                          {mandi.district}, {mandi.state}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg" style={{ color: heat.bg }}>
                        {formatCurrency(mandi.currentPrice)}
                      </p>
                      <p className="text-xs text-text-secondary">{t("common.perQuintal")}</p>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-bg-section rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${priceBarWidth}%` }}
                      transition={{ delay: 0.6 + idx * 0.06, duration: 0.5 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: heat.bg }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Navigation size={10} /> {mandi.distance} km
                    </span>
                    <span>{t("simulator.costs.transport")}: {formatCurrency(mandi.transportCost)}/{t("common.perQuintal")}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>
    </AppShell>
  );
}
