"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSafeTranslations } from "@/hooks/use-safe-translations";
import { AppShell } from "@/components/app-shell";
import { MOCK_FARMER, CROPS } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import {
  User,
  Phone,
  MapPin,
  Sprout,
  Edit3,
  Save,
  Ruler,
  CheckCircle,
} from "lucide-react";

export default function ProfilePage() {
  const t = useSafeTranslations();
  const { selectedCrop, language } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [farmer, setFarmer] = useState(MOCK_FARMER);

  const farmerCrops = CROPS.filter((c) => farmer.crops.includes(c.id));

  return (
    <AppShell>
      <section className="py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1
                className="text-2xl md:text-[var(--font-size-h2)] font-extrabold text-text-primary mb-2"
                style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
              >
                {t("navigation.profile")}
              </h1>
              <p className="text-text-secondary">{t("dashboard.visualOverview")}</p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-button)] text-sm font-medium transition-all ${
                editing
                  ? "bg-profit text-white shadow-md"
                  : "bg-white text-primary border border-border hover:border-primary-button"
              }`}
            >
              {editing ? <Save size={16} /> : <Edit3 size={16} />}
              {editing ? t("profile.save") : t("profile.edit")}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 bg-white rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)]"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-button mx-auto mb-4 flex items-center justify-center">
                <User size={36} className="text-white" />
              </div>
              {editing ? (
                <input
                  type="text"
                  value={farmer.name}
                  onChange={(e) => setFarmer({ ...farmer, name: e.target.value })}
                  className="text-xl font-bold text-text-primary text-center w-full border-b-2 border-primary-button pb-1 bg-transparent outline-none"
                />
              ) : (
                <h2 className="text-xl font-bold text-text-primary">{farmer.name}</h2>
              )}
              <p className="text-sm text-text-secondary mt-1">{t("profile.farmerId")}: {farmer.id}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-bg-highlight flex items-center justify-center">
                  <Phone size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">{t("profile.phone")}</p>
                  {editing ? (
                    <input
                      type="text"
                      value={farmer.phone}
                      onChange={(e) => setFarmer({ ...farmer, phone: e.target.value })}
                      className="text-sm font-medium border-b border-border bg-transparent outline-none w-full"
                    />
                  ) : (
                    <p className="text-sm font-medium text-text-primary">{farmer.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-bg-highlight flex items-center justify-center">
                  <MapPin size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">{t("common.location")}</p>
                  {editing ? (
                    <input
                      type="text"
                      value={`${farmer.village}, ${farmer.district}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(",");
                        setFarmer({
                          ...farmer,
                          village: parts[0]?.trim() ?? farmer.village,
                          district: parts[1]?.trim() ?? farmer.district,
                        });
                      }}
                      className="text-sm font-medium border-b border-border bg-transparent outline-none w-full"
                    />
                  ) : (
                    <p className="text-sm font-medium text-text-primary">
                      {farmer.village}, {farmer.district}, {farmer.state}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-bg-highlight flex items-center justify-center">
                  <Ruler size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">{t("profile.totalLand")}</p>
                  {editing ? (
                    <input
                      type="number"
                      value={farmer.totalLand}
                      onChange={(e) =>
                        setFarmer({ ...farmer, totalLand: parseFloat(e.target.value) || 0 })
                      }
                      className="text-sm font-medium border-b border-border bg-transparent outline-none w-20"
                    />
                  ) : (
                    <p className="text-sm font-medium text-text-primary">
                      {farmer.totalLand} {t("common.acres")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Crops & Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Crops */}
            <div className="bg-white rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)]">
              <h3
                className="font-bold text-text-primary mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
              >
                <Sprout size={18} className="text-primary" /> {t("profile.myCrops")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {farmerCrops.map((crop) => (
                  <div
                    key={crop.id}
                    className="flex items-center gap-3 p-4 rounded-xl bg-bg-highlight/50 border border-bg-highlight"
                  >
                    <span className="text-2xl">{crop.icon}</span>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">{crop[language === 'en' ? 'name' : 'nameHi'] || crop.name}</p>
                      <p className="text-xs text-text-secondary">{crop.nameHi}</p>
                    </div>
                    <CheckCircle size={16} className="text-profit ml-auto" />
                  </div>
                ))}
              </div>

              {editing && (
                <div className="mt-4">
                  <p className="text-xs text-text-secondary mb-2">Add more crops:</p>
                  <div className="flex flex-wrap gap-2">
                    {CROPS.filter((c) => !farmer.crops.includes(c.id)).map((crop) => (
                      <button
                        key={crop.id}
                        onClick={() =>
                          setFarmer({ ...farmer, crops: [...farmer.crops, crop.id] })
                        }
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-section text-text-secondary hover:bg-primary hover:text-white transition-all border border-border"
                      >
                        {crop.icon} {crop.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-[var(--radius-card)] p-6 shadow-[var(--shadow-card)]">
              <h3
                className="font-bold text-text-primary mb-4"
                style={{ fontFamily: "var(--font-sora), Sora, sans-serif" }}
              >
                {t("profile.activity")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: t("profile.stats.recommendations"), value: "12", sub: t("profile.timeframe.thisMonth") },
                  { label: t("profile.stats.profitableSells"), value: "8", sub: t("profile.timeframe.allTime") },
                  { label: t("profile.stats.avgBoost"), value: "+22%", sub: t("profile.timeframe.vsMarket") },
                  { label: t("profile.stats.alertsActed"), value: "6", sub: t("profile.timeframe.thisMonth") },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center p-3 rounded-xl bg-bg-section/50">
                    <p className="text-2xl font-extrabold text-primary">{stat.value}</p>
                    <p className="text-xs font-medium text-text-primary mt-1">{stat.label}</p>
                    <p className="text-[10px] text-text-secondary">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </AppShell>
  );
}
