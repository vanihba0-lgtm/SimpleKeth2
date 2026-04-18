"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSafeTranslations } from "@/hooks/use-safe-translations";
import { AppShell } from "@/components/app-shell";
import { MOCK_ALERTS } from "@/lib/mock-data";
import { Bell, TrendingUp, AlertTriangle, Zap, Check, Clock } from "lucide-react";

export default function AlertsPage() {
  const t = useSafeTranslations();
  const [filter, setFilter] = useState<"all" | "opportunity" | "warning" | "urgent">("all");

  const filteredAlerts =
    filter === "all"
      ? MOCK_ALERTS
      : MOCK_ALERTS.filter((a) => a.type === filter);

  const getAlertStyle = (type: string) => {
    switch (type) {
      case "opportunity":
        return { bg: "rgba(63,163,77,0.06)", border: "rgba(63,163,77,0.2)", color: "#3FA34D", icon: TrendingUp };
      case "urgent":
        return { bg: "rgba(178,58,58,0.06)", border: "rgba(178,58,58,0.2)", color: "#B23A3A", icon: Zap };
      case "warning":
        return { bg: "rgba(200,155,60,0.06)", border: "rgba(200,155,60,0.2)", color: "#C89B3C", icon: AlertTriangle };
      default:
        return { bg: "#fff", border: "#DDD6CC", color: "#6B6B6B", icon: Bell };
    }
  };

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return t("alerts.time.now");
    if (hours < 24) return t("alerts.time.hours", { h: hours });
    return t("alerts.time.days", { d: Math.floor(hours / 24) });
  };

  return (
    <AppShell>
      <section className="py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1
            className="text-2xl md:text-[var(--font-size-h2)] font-extrabold text-text-primary mb-2"
            style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
          >
            {t("navigation.alerts")}
          </h1>
          <p className="text-text-secondary mb-6">
            {t("dashboard.heroSubtitle")}
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: "all" as const, label: t("alerts.filters.all"), count: MOCK_ALERTS.length },
            { key: "opportunity" as const, label: t("alerts.filters.opportunity"), count: MOCK_ALERTS.filter((a) => a.type === "opportunity").length },
            { key: "warning" as const, label: t("alerts.filters.warning"), count: MOCK_ALERTS.filter((a) => a.type === "warning").length },
            { key: "urgent" as const, label: t("alerts.filters.urgent"), count: MOCK_ALERTS.filter((a) => a.type === "urgent").length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-[var(--radius-button)] text-sm font-medium transition-all ${
                filter === tab.key
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-text-secondary border border-border hover:border-primary-button"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                  filter === tab.key ? "bg-white/20" : "bg-bg-section"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Alert List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert, idx) => {
            const style = getAlertStyle(alert.type);
            const AlertIcon = style.icon;

            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="rounded-[var(--radius-card)] p-5 md:p-6 transition-shadow hover:shadow-[var(--shadow-card-hover)]"
                style={{
                  backgroundColor: style.bg,
                  border: `1px solid ${style.border}`,
                }}
              >
                <div className="flex gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: style.color + "14" }}
                  >
                    <AlertIcon size={22} style={{ color: style.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-text-primary">{alert.title}</h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {alert.priceChange && (
                          <span
                            className="text-sm font-bold"
                            style={{
                              color: alert.priceChange > 0 ? "var(--color-profit)" : "var(--color-loss)",
                            }}
                          >
                            {alert.priceChange > 0 ? "+" : ""}
                            {alert.priceChange}%
                          </span>
                        )}
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          <Clock size={10} /> {formatTime(alert.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary leading-relaxed mb-3">
                      {alert.message}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {alert.crop && (
                        <span className="text-xs px-2 py-1 rounded-full bg-white/60 text-text-secondary border border-border/60">
                          🌾 {alert.crop}
                        </span>
                      )}
                      {alert.mandi && (
                        <span className="text-xs px-2 py-1 rounded-full bg-white/60 text-text-secondary border border-border/60">
                          📍 {alert.mandi}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-16">
            <Check size={48} className="mx-auto text-profit mb-4" />
            <h3 className="text-lg font-bold text-text-primary mb-2">{t("alerts.allCaughtUp")}</h3>
            <p className="text-text-secondary">{t("alerts.noAlerts")}</p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
