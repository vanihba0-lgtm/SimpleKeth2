"use client";

import { CROPS } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { useSafeTranslations } from "@/hooks/use-safe-translations";
import { Search } from "lucide-react";

interface CropInputModuleProps {
  onSubmit?: () => void;
  compact?: boolean;
}

export function CropInputModule({ onSubmit, compact }: CropInputModuleProps) {
  const t = useSafeTranslations();
  const { selectedCrop, quantity, location, setCrop, setQuantity, setLocation } =
    useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${compact ? 'gap-3' : 'gap-4'}`}>
      {/* Crop Selector */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {t("common.selectCrop")}
        </label>
        <select
          value={selectedCrop}
          onChange={(e) => setCrop(e.target.value)}
          className="w-full rounded-[var(--radius-button)] border border-border bg-white px-4 py-3 text-text-primary text-base font-medium focus:border-primary-button focus:ring-2 focus:ring-primary-button/20 outline-none transition-all"
        >
          {CROPS.map((crop) => (
            <option key={crop.id} value={crop.id}>
              {crop.icon} {crop.name} ({crop.nameHi})
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {t("common.quantityKg")}
        </label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
          placeholder={t("common.quantityKg")}
          min={0}
          className="w-full rounded-[var(--radius-button)] border border-border bg-white px-4 py-3 text-text-primary text-base font-medium focus:border-primary-button focus:ring-2 focus:ring-primary-button/20 outline-none transition-all"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {t("common.location")}
        </label>
        <div className="relative">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t("common.location")}
            className="w-full rounded-[var(--radius-button)] border border-border bg-white pl-4 pr-10 py-3 text-text-primary text-base font-medium focus:border-primary-button focus:ring-2 focus:ring-primary-button/20 outline-none transition-all"
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        </div>
      </div>

      {/* CTA */}
      <button
        type="submit"
        className="w-full rounded-[var(--radius-button)] bg-primary-button text-white font-semibold py-3.5 text-base hover:bg-primary active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg mt-1"
      >
        {t("common.getRecommendation")} →
      </button>
    </form>
  );
}
