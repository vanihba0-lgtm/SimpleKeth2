"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSafeTranslations } from "@/hooks/use-safe-translations";
import { AppShell } from "@/components/app-shell";
import { useAppStore } from "@/lib/store";
import { simulateScenarios, MANDIS, CROPS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { Sliders, TrendingUp, Package, Truck, AlertTriangle } from "lucide-react";

export default function SimulatorPage() {
  const t = useSafeTranslations();
  const { selectedCrop, quantity, language } = useAppStore();
  const [selectedMandiId, setSelectedMandiId] = useState(MANDIS[0].id);
  const mandi = MANDIS.find((m) => m.id === selectedMandiId) ?? MANDIS[0];
  const cropData = CROPS.find((c) => c.id === selectedCrop);

  const scenarios = useMemo(
    () => simulateScenarios(selectedCrop, quantity, mandi),
    [selectedCrop, quantity, mandi]
  );

  const bestDay = useMemo(() => {
    return scenarios.reduce((best, s) => (s.netProfit > best.netProfit ? s : best), scenarios[0]);
  }, [scenarios]);

  const todayScenario = scenarios[0];
  const [hoverDay, setHoverDay] = useState<number | null>(null);
  const activeScenario = hoverDay !== null ? scenarios[hoverDay] : bestDay;

  return (
    <AppShell>
      <section className="py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1
            className="text-2xl md:text-[var(--font-size-h2)] font-extrabold text-text-primary mb-2"
            style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
          >
            {t("navigation.simulator")}
          </h1>
          <p className="text-text-secondary mb-6">
            {cropData?.icon} {cropData?.[language === 'en' ? 'name' : 'nameHi'] || cropData?.name} · {quantity} kg — {t("dashboard.sellLaterTitle")}
          </p>
        </motion.div>

        {/* Mandi Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-secondary mb-2">Simulate for Mandi</label>
          <div className="flex flex-wrap gap-2">
            {MANDIS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMandiId(m.id)}
                className={`px-4 py-2 rounded-[var(--radius-button)] text-sm font-medium transition-all ${
                  selectedMandiId === m.id
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-text-secondary border border-border hover:border-primary-button"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Key Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: t("simulator.todayProfit"),
              value: formatCurrency(todayScenario.netProfit),
              color: "var(--color-text-primary)",
              icon: Package,
            },
            {
              label: t("simulator.bestDay"),
              value: `${t("common.day")} ${bestDay.sellDay}`,
              color: "var(--color-profit)",
              icon: TrendingUp,
            },
            {
              label: t("simulator.maxProfit"),
              value: formatCurrency(bestDay.netProfit),
              color: "var(--color-profit)",
              icon: TrendingUp,
            },
            {
              label: t("simulator.extraGain"),
              value: formatCurrency(bestDay.netProfit - todayScenario.netProfit),
              color: bestDay.netProfit > todayScenario.netProfit ? "var(--color-profit)" : "var(--color-loss)",
              icon: Sliders,
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-[var(--radius-card)] p-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={14} className="text-text-secondary" />
                <p className="text-xs text-text-secondary">{stat.label}</p>
              </div>
              <p className="text-xl font-extrabold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Profit Over Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[var(--radius-card)] p-4 md:p-6 shadow-[var(--shadow-card)] mb-8"
        >
          <h3
            className="font-bold text-text-primary mb-4"
            style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
          >
            {t("simulator.breakdown")}
          </h3>
          <div className="w-full" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scenarios} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3FA34D" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3FA34D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDD6CC" opacity={0.5} />
                <XAxis
                  dataKey="sellDay"
                  tick={{ fontSize: 11, fill: "#6B6B6B" }}
                  tickFormatter={(v) => `${t("common.day")} ${v}`}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6B6B6B" }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #DDD6CC",
                    fontSize: 13,
                    backgroundColor: "#F7F4EF",
                  }}
                  formatter={(value: any) => [formatCurrency(Number(value) || 0), t("common.netProfit")]}
                  labelFormatter={(label) => `${t("common.day")} ${label}`}
                />
                <ReferenceLine
                  x={bestDay.sellDay}
                  stroke="#3FA34D"
                  strokeDasharray="4 4"
                  label={{ value: "Best", position: "top", fill: "#3FA34D", fontSize: 11, fontWeight: 700 }}
                />
                <Area
                  type="monotone"
                  dataKey="netProfit"
                  stroke="#3FA34D"
                  strokeWidth={2.5}
                  fill="url(#colorProfit)"
                  dot={false}
                  activeDot={{ r: 5, stroke: "#3FA34D", strokeWidth: 2, fill: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Cost Breakdown Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-[var(--radius-card)] p-4 md:p-6 shadow-[var(--shadow-card)] mb-8"
        >
          <h3
            className="font-bold text-text-primary mb-4"
            style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
          >
            Day-by-Day Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-3 pr-4 text-text-secondary font-medium">{t("common.day")}</th>
                  <th className="py-3 pr-4 text-text-secondary font-medium">{t("common.perQuintal")}</th>
                  <th className="py-3 pr-4 text-text-secondary font-medium">{t("simulator.costs.transport")}</th>
                  <th className="py-3 pr-4 text-text-secondary font-medium">{t("simulator.costs.storage")}</th>
                  <th className="py-3 pr-4 text-text-secondary font-medium">{t("simulator.costs.losses")}</th>
                  <th className="py-3 text-text-secondary font-medium">{t("common.netProfit")}</th>
                </tr>
              </thead>
              <tbody>
                {scenarios
                  .filter((_, i) => i % 3 === 0 || i === bestDay.sellDay)
                  .map((s) => (
                    <tr
                      key={s.sellDay}
                      className={`border-b border-border/50 transition-colors ${
                        s.sellDay === bestDay.sellDay ? "bg-profit/5" : "hover:bg-bg-section/50"
                      }`}
                    >
                      <td className="py-3 pr-4 font-medium">
                        {s.sellDay === 0 ? "Today" : `${t("common.day")} ${s.sellDay}`}
                        {s.sellDay === bestDay.sellDay && (
                          <span className="ml-1 text-[10px] bg-profit/10 text-profit px-1.5 py-0.5 rounded-full font-bold">
                            BEST
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4">{formatCurrency(s.predictedPrice)}</td>
                      <td className="py-3 pr-4 text-loss">-{formatCurrency(s.transportCost)}</td>
                      <td className="py-3 pr-4 text-loss">-{formatCurrency(s.storageCost)}</td>
                      <td className="py-3 pr-4 text-loss">-{formatCurrency(s.losses)}</td>
                      <td className={`py-3 font-bold ${s.netProfit > 0 ? "profit-text" : "loss-text"}`}>
                        {formatCurrency(s.netProfit)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Advisory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 rounded-[var(--radius-card)] flex items-start gap-3"
          style={{ backgroundColor: "rgba(200,155,60,0.08)", border: "1px solid rgba(200,155,60,0.2)" }}
        >
          <AlertTriangle size={20} className="text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-text-primary mb-1">{t("common.importantNote")}</h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t("simulator.advisory")}
            </p>
          </div>
        </motion.div>
      </section>
    </AppShell>
  );
}
