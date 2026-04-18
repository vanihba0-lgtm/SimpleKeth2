// ===== MOCK DATA FOR SIMPLEKETH MVP =====
// All data is realistic but simulated for the initial build.

export interface CropOption {
  id: string;
  name: string;
  nameHi: string;
  icon: string;
}

export interface MandiData {
  id: string;
  name: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  currentPrice: number;       // per quintal
  predictedPrice7d: number;
  predictedPrice15d: number;
  predictedPrice30d: number;
  transportCost: number;
  distance: number;           // km from farmer
}

export interface PriceTrend {
  date: string;
  price: number;
  predicted?: boolean;
}

export interface Recommendation {
  decision: "SELL_NOW" | "HOLD";
  confidence: number;         // 0-100
  currentPrice: number;
  expectedProfit: number;
  bestMandi: MandiData;
  reasoning: string;
  holdDays?: number;
  holdExpectedProfit?: number;
}

export interface Alert {
  id: string;
  type: "opportunity" | "warning" | "urgent";
  title: string;
  message: string;
  timestamp: string;
  crop: string;
  mandi?: string;
  priceChange?: number;
}

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  crops: string[];
  totalLand: number; // acres
}

export interface ScenarioResult {
  sellDay: number;
  predictedPrice: number;
  transportCost: number;
  storageCost: number;
  losses: number;
  netProfit: number;
}

// ===== CROPS =====
export const CROPS: CropOption[] = [
  { id: "wheat", name: "Wheat", nameHi: "गेहूं", icon: "🌾" },
  { id: "rice", name: "Rice", nameHi: "चावल", icon: "🍚" },
  { id: "cotton", name: "Cotton", nameHi: "कपास", icon: "🧵" },
  { id: "soybean", name: "Soybean", nameHi: "सोयाबीन", icon: "🫘" },
  { id: "mustard", name: "Mustard", nameHi: "सरसों", icon: "🌻" },
  { id: "onion", name: "Onion", nameHi: "प्याज", icon: "🧅" },
  { id: "tomato", name: "Tomato", nameHi: "टमाटर", icon: "🍅" },
  { id: "potato", name: "Potato", nameHi: "आलू", icon: "🥔" },
];

// ===== MANDIS =====
export const MANDIS: MandiData[] = [
  {
    id: "azadpur",
    name: "Azadpur Mandi",
    district: "Delhi",
    state: "Delhi",
    lat: 28.7041,
    lng: 77.1025,
    currentPrice: 2450,
    predictedPrice7d: 2580,
    predictedPrice15d: 2690,
    predictedPrice30d: 2520,
    transportCost: 350,
    distance: 45,
  },
  {
    id: "vashi",
    name: "Vashi APMC",
    district: "Navi Mumbai",
    state: "Maharashtra",
    lat: 19.0760,
    lng: 72.8777,
    currentPrice: 2380,
    predictedPrice7d: 2510,
    predictedPrice15d: 2620,
    predictedPrice30d: 2480,
    transportCost: 520,
    distance: 120,
  },
  {
    id: "yeshwanthpur",
    name: "Yeshwanthpur",
    district: "Bangalore",
    state: "Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    currentPrice: 2520,
    predictedPrice7d: 2640,
    predictedPrice15d: 2750,
    predictedPrice30d: 2600,
    transportCost: 680,
    distance: 200,
  },
  {
    id: "koyambedu",
    name: "Koyambedu Market",
    district: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    currentPrice: 2300,
    predictedPrice7d: 2420,
    predictedPrice15d: 2550,
    predictedPrice30d: 2390,
    transportCost: 750,
    distance: 280,
  },
  {
    id: "devi_ahilya",
    name: "Devi Ahilya Mandi",
    district: "Indore",
    state: "Madhya Pradesh",
    lat: 22.7196,
    lng: 75.8577,
    currentPrice: 2280,
    predictedPrice7d: 2400,
    predictedPrice15d: 2500,
    predictedPrice30d: 2350,
    transportCost: 280,
    distance: 30,
  },
];

// ===== PRICE TRENDS (30 days history + 15 days predicted) =====
export function generatePriceTrends(basePrice: number): PriceTrend[] {
  const trends: PriceTrend[] = [];
  const now = new Date();

  // Historical (30 days back)
  for (let i = 30; i >= 1; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const variance = (Math.random() - 0.45) * 200;
    trends.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(basePrice + variance - (i * 3)),
      predicted: false,
    });
  }

  // Today
  trends.push({
    date: now.toISOString().split("T")[0],
    price: basePrice,
    predicted: false,
  });

  // Predicted (15 days forward)
  for (let i = 1; i <= 15; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const growth = i * 8 + (Math.random() - 0.3) * 60;
    trends.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(basePrice + growth),
      predicted: true,
    });
  }

  return trends;
}

// ===== RECOMMENDATION ENGINE (Mock) =====
export function getRecommendation(
  cropId: string,
  quantity: number,
  _location: string
): Recommendation {
  // Sort mandis by net profit
  const rankedMandis = [...MANDIS]
    .map((m) => ({
      ...m,
      netProfit: (m.predictedPrice7d - m.transportCost) * (quantity / 100),
    }))
    .sort((a, b) => b.netProfit - a.netProfit);

  const best = rankedMandis[0];
  const currentNetProfit = (best.currentPrice - best.transportCost) * (quantity / 100);
  const futureNetProfit = (best.predictedPrice7d - best.transportCost) * (quantity / 100);
  const storageCostPerDay = 15 * (quantity / 100); // ₹15/quintal/day
  const storageCost7d = storageCostPerDay * 7;
  const lossFactor = 0.02; // 2% spoilage over 7 days
  const losses = futureNetProfit * lossFactor;
  const adjustedFutureProfit = futureNetProfit - storageCost7d - losses;

  const shouldSell = currentNetProfit >= adjustedFutureProfit * 0.95;

  return {
    decision: shouldSell ? "SELL_NOW" : "HOLD",
    confidence: shouldSell ? 82 : 76,
    currentPrice: best.currentPrice,
    expectedProfit: shouldSell
      ? Math.round(currentNetProfit)
      : Math.round(adjustedFutureProfit),
    bestMandi: best,
    reasoning: shouldSell
      ? `Current prices at ${best.name} are strong. Selling now avoids storage costs of ${formatINR(storageCost7d)} and potential losses. Net profit is within 5% of the best predicted outcome.`
      : `Prices are predicted to rise by ${formatINR(best.predictedPrice7d - best.currentPrice)}/quintal over the next 7 days at ${best.name}. Even after storage costs, waiting could increase your profit by ${formatINR(Math.round(adjustedFutureProfit - currentNetProfit))}.`,
    holdDays: shouldSell ? undefined : 7,
    holdExpectedProfit: shouldSell ? undefined : Math.round(adjustedFutureProfit),
  };
}

function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

// ===== MANDI COMPARISON =====
export function getMandiComparison(
  _cropId: string,
  quantity: number
) {
  return MANDIS.map((m) => {
    const grossRevenue = m.currentPrice * (quantity / 100);
    const transport = m.transportCost * (quantity / 100);
    const storageCost = 0;
    const losses = grossRevenue * 0.01;
    const netProfit = grossRevenue - transport - storageCost - losses;

    return {
      ...m,
      grossRevenue: Math.round(grossRevenue),
      transportTotal: Math.round(transport),
      storageCost: Math.round(storageCost),
      losses: Math.round(losses),
      netProfit: Math.round(netProfit),
      profitPerKg: Math.round((netProfit / quantity) * 100) / 100,
    };
  }).sort((a, b) => b.netProfit - a.netProfit);
}

// ===== SCENARIO SIMULATION =====
export function simulateScenarios(
  cropId: string,
  quantity: number,
  baseMandi: MandiData
): ScenarioResult[] {
  const results: ScenarioResult[] = [];
  const storageCostPerDay = 15 * (quantity / 100);

  for (let day = 0; day <= 30; day += 1) {
    let predictedPrice: number;
    if (day <= 7) {
      predictedPrice =
        baseMandi.currentPrice +
        ((baseMandi.predictedPrice7d - baseMandi.currentPrice) / 7) * day;
    } else if (day <= 15) {
      predictedPrice =
        baseMandi.predictedPrice7d +
        ((baseMandi.predictedPrice15d - baseMandi.predictedPrice7d) / 8) *
          (day - 7);
    } else {
      predictedPrice =
        baseMandi.predictedPrice15d +
        ((baseMandi.predictedPrice30d - baseMandi.predictedPrice15d) / 15) *
          (day - 15);
    }

    const transportCost = baseMandi.transportCost * (quantity / 100);
    const storageCost = storageCostPerDay * day;
    const lossPercent = Math.min(day * 0.003, 0.08);
    const grossRevenue = predictedPrice * (quantity / 100);
    const losses = grossRevenue * lossPercent;
    const netProfit = grossRevenue - transportCost - storageCost - losses;

    results.push({
      sellDay: day,
      predictedPrice: Math.round(predictedPrice),
      transportCost: Math.round(transportCost),
      storageCost: Math.round(storageCost),
      losses: Math.round(losses),
      netProfit: Math.round(netProfit),
    });
  }

  return results;
}

// ===== ALERTS =====
export const MOCK_ALERTS: Alert[] = [
  {
    id: "1",
    type: "opportunity",
    title: "Price Spike at Azadpur",
    message: "Wheat prices jumped 8% in the last 24 hours at Azadpur Mandi. Consider selling if you have stock ready.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    crop: "wheat",
    mandi: "Azadpur Mandi",
    priceChange: 8,
  },
  {
    id: "2",
    type: "warning",
    title: "Prices Expected to Dip",
    message: "Rice prices at Vashi APMC may drop 5% next week due to new arrivals from Punjab.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    crop: "rice",
    mandi: "Vashi APMC",
    priceChange: -5,
  },
  {
    id: "3",
    type: "urgent",
    title: "Best Selling Window Closing",
    message: "Onion prices at Devi Ahilya Mandi are at a 3-month high. Prices predicted to fall after 3 days.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    crop: "onion",
    mandi: "Devi Ahilya Mandi",
    priceChange: 12,
  },
  {
    id: "4",
    type: "opportunity",
    title: "Cotton Demand Surge",
    message: "Cotton demand increased in Yeshwanthpur due to textile orders. Prices up by 6%.",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    crop: "cotton",
    mandi: "Yeshwanthpur",
    priceChange: 6,
  },
  {
    id: "5",
    type: "warning",
    title: "Storage Advisory",
    message: "High humidity predicted in your region. Ensure grain storage is protected for the next 5 days.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    crop: "wheat",
  },
];

// ===== FARMER PROFILE MOCK =====
export const MOCK_FARMER: FarmerProfile = {
  id: "f001",
  name: "Ramesh Kumar",
  phone: "+91 98765 43210",
  village: "Sehore",
  district: "Sehore",
  state: "Madhya Pradesh",
  crops: ["wheat", "soybean", "mustard"],
  totalLand: 8.5,
};
