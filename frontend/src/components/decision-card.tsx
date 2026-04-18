"use client";

import { motion } from "framer-motion";
import { useSafeTranslations } from "@/hooks/use-safe-translations";
import { useAppStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { MapPin, TrendingUp, TrendingDown, Clock, ShieldCheck, Volume2 } from "lucide-react";
import type { Recommendation } from "@/lib/mock-data";

interface DecisionCardProps {
  recommendation: Recommendation;
}

export function DecisionCard({ recommendation }: DecisionCardProps) {
  const t = useSafeTranslations();
  const { language } = useAppStore();
  const isSell = recommendation.decision === "SELL_NOW";

  const handleTTS = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    
    const profitText = formatCurrency(recommendation.expectedProfit);
    const text = isSell 
      ? `${t("common.sellNow")}! ${t("common.expectedProfit")} ${profitText}.`
      : `${t("common.hold")}. ${t("common.expectedProfit")} ${profitText} in ${recommendation.holdDays} days.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "en" ? "en-IN" : `${language}-IN`;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[var(--radius-card)] p-6 md:p-8"
      style={{
        background: isSell
          ? "linear-gradient(135deg, #E6F0E8 0%, #d4edda 100%)"
          : "linear-gradient(135deg, #FFF8E1 0%, #FFF3CD 100%)",
        boxShadow: "var(--shadow-card-hover)",
      }}
    >
      {/* Decision Badge */}
      <div className="flex items-center justify-between mb-6">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="decision-text text-3xl md:text-4xl lg:text-5xl flex items-center gap-4"
          style={{
            color: isSell ? "var(--color-profit)" : "var(--color-warning)",
          }}
        >
          {isSell ? t("common.sellNow") : t("common.hold")}
          <button 
            onClick={handleTTS}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
            aria-label="Listen to recommendation"
          >
            <Volume2 size={24} />
          </button>
        </motion.div>

        <div
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
          style={{
            backgroundColor: isSell
              ? "rgba(63, 163, 77, 0.15)"
              : "rgba(200, 155, 60, 0.15)",
            color: isSell ? "var(--color-profit)" : "var(--color-warning)",
          }}
        >
          <ShieldCheck size={16} />
          {t("predictions.confidence", { pct: recommendation.confidence })}
        </div>
      </div>

      {/* Profit */}
      <div className="mb-6">
        <p className="text-sm text-text-secondary mb-1">{t("common.expectedProfit")}</p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="profit-text text-4xl md:text-5xl"
        >
          {formatCurrency(recommendation.expectedProfit)}
        </motion.p>
      </div>

      {/* Best Mandi */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-primary" />
          <div>
            <p className="text-xs text-text-secondary">{t("common.bestMandi")}</p>
            <p className="font-semibold text-text-primary">
              {recommendation.bestMandi.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSell ? (
            <TrendingUp size={18} className="text-profit" />
          ) : (
            <Clock size={18} className="text-warning" />
          )}
          <div>
            <p className="text-xs text-text-secondary">
              {isSell ? t("common.currentPrice") : t("predictions.holdLabel", { days: recommendation.holdDays ?? 0 })}
            </p>
            <p className="font-semibold text-text-primary">
              {formatCurrency(recommendation.currentPrice)}/{t("common.perQuintal")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TrendingDown size={18} className="text-earth-clay" />
          <div>
            <p className="text-xs text-text-secondary">{t("simulator.costs.transport")}</p>
            <p className="font-semibold text-text-primary">
              {formatCurrency(recommendation.bestMandi.transportCost)}/{t("common.perQuintal")}
            </p>
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 rounded-lg"
        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
      >
        <p className="text-sm text-text-secondary leading-relaxed">
          💡 {recommendation.reasoning}
        </p>
      </motion.div>
    </motion.div>
  );
}
