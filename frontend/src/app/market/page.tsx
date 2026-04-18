"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSafeTranslations } from "@/hooks/use-safe-translations";
import { AppShell } from "@/components/app-shell";
import { useAppStore } from "@/lib/store";
import { getMandiComparison, CROPS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Truck, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function MarketPage() {
  const t = useSafeTranslations();
  const { selectedCrop, quantity, language } = useAppStore();
  const mandis = useMemo(
    () => getMandiComparison(selectedCrop, quantity),
    [selectedCrop, quantity]
  );
  const cropData = CROPS.find((c) => c.id === selectedCrop);
  const bestProfit = mandis[0]?.netProfit ?? 0;

  return (
    <AppShell>
      <section className="py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-2xl md:text-[var(--font-size-h2)] font-extrabold text-text-primary mb-2"
            style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
          >
            {t("navigation.market")}
          </h1>
          <p className="text-text-secondary mb-8">
            {cropData?.icon} {cropData?.[language === 'en' ? 'name' : 'nameHi'] || cropData?.name} · {quantity} kg · {t("dashboard.topMandis")}
          </p>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: t("market.bestNetProfit"),
              value: formatCurrency(bestProfit),
              color: "var(--color-profit)",
              bg: "rgba(63,163,77,0.08)",
            },
            {
              label: t("common.distance"),
              value: mandis[0]?.name ?? "—",
              color: "var(--color-primary)",
              bg: "rgba(47,93,58,0.08)",
            },
            {
              label: t("market.highestPrice"),
              value: formatCurrency(Math.max(...mandis.map((m) => m.currentPrice))) + "/" + t("common.perQuintal"),
              color: "var(--color-earth-clay)",
              bg: "rgba(139,94,60,0.08)",
            },
            {
              label: t("market.comparison"),
              value: String(mandis.length),
              color: "var(--color-warning)",
              bg: "rgba(200,155,60,0.08)",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-card)]"
            >
              <p className="text-xs text-text-secondary mb-1">{stat.label}</p>
              <p className="text-lg font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mandi Cards */}
        <div className="space-y-4">
          {mandis.map((mandi, idx) => {
            const isBest = idx === 0;
            return (
              <motion.div
                key={mandi.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + idx * 0.08 }}
                className={`bg-white rounded-[var(--radius-card)] p-5 md:p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)] ${
                  isBest ? "ring-2 ring-profit/30" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Rank + Name */}
                  <div className="flex items-center gap-4 md:w-1/3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                        isBest
                          ? "bg-profit/10 text-profit"
                          : "bg-bg-section text-text-secondary"
                      }`}
                    >
                      #{idx + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary flex items-center gap-1">
                        {mandi.name}
                        {isBest && (
                          <span className="text-[10px] bg-profit/10 text-profit px-1.5 py-0.5 rounded-full font-semibold">
                            {t("market.bestBadge")}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-text-secondary flex items-center gap-1">
                        <MapPin size={12} /> {mandi.district}, {mandi.state} ·{" "}
                        {mandi.distance} km
                      </p>
                    </div>
                  </div>

                  {/* Price Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:flex-1">
                    <div>
                      <p className="text-[11px] text-text-secondary">{t("common.currentPrice")}</p>
                      <p className="text-sm font-semibold">
                        {formatCurrency(mandi.currentPrice)}/{t("common.perQuintal")}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-text-secondary flex items-center gap-1">
                        <Truck size={10} /> {t("simulator.costs.transport")}
                      </p>
                      <p className="text-sm font-semibold text-loss">
                        -{formatCurrency(mandi.transportTotal)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-text-secondary">{t("simulator.costs.losses")}</p>
                      <p className="text-sm font-semibold text-loss">
                        -{formatCurrency(mandi.losses)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-text-secondary">{t("common.netProfit")}</p>
                      <p
                        className={`text-lg font-extrabold ${
                          mandi.netProfit > 0 ? "profit-text" : "loss-text"
                        }`}
                      >
                        {formatCurrency(mandi.netProfit)}
                      </p>
                    </div>
                  </div>

                  {/* Profit per kg */}
                  <div className="text-right md:w-28">
                    <p className="text-[11px] text-text-secondary">{t("common.quantityKg")}</p>
                    <p className="text-lg font-bold text-primary">
                      ₹{mandi.profitPerKg}
                    </p>
                  </div>
                </div>

                {/* Prediction bar */}
                <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap gap-4 text-xs text-text-secondary">
                  <span className="flex items-center gap-1">
                    <TrendingUp size={12} className="text-profit" />
                    7d: {formatCurrency(mandi.predictedPrice7d)}/{t("common.perQuintal")}
                    {mandi.predictedPrice7d > mandi.currentPrice ? (
                      <ArrowUpRight size={12} className="text-profit" />
                    ) : (
                      <ArrowDownRight size={12} className="text-loss" />
                    )}
                  </span>
                  <span>15d: {formatCurrency(mandi.predictedPrice15d)}/{t("common.perQuintal")}</span>
                  <span>30d: {formatCurrency(mandi.predictedPrice30d)}/{t("common.perQuintal")}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
