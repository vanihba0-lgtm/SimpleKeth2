package com.simpleketh.engine.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ApiController {

    @GetMapping("/health")
    public Map<String, String> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        response.put("service", "engine-service");
        return response;
    }

    @PostMapping("/calculate-recommendation")
    public Map<String, Object> calculateRecommendation(@RequestBody Map<String, Object> request) {
        // Parse incoming predictions and weather data (mocked execution)
        Map<String, Object> predictions = (Map<String, Object>) request.getOrDefault("predictions", new HashMap<>());
        Map<String, Object> weather = (Map<String, Object>) request.getOrDefault("weather", new HashMap<>());
        
        double currentPrice = 2450.0;
        int conf = (Integer) predictions.getOrDefault("confidence", 85);
        double expectedProfit = 10875.0;
        String decision = "SELL_NOW";
        String reasoning = "Current prices are strong. Selling now avoids storage costs and potential losses. Net profit is within 5% of the best predicted outcome.";
        
        // Adjust recommendation if weather risk is high or predictions suggest a massive spike
        if (weather.containsKey("rainfall_mm") && ((Number) weather.get("rainfall_mm")).doubleValue() > 100) {
            decision = "HOLD";
            reasoning = "Heavy rainfall predicted. Supply chain will be disrupted, leading to potential price spikes. Holding is recommended.";
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("decision", decision);
        response.put("confidence", conf);
        response.put("current_price", currentPrice);
        response.put("expected_profit", expectedProfit);
        
        Map<String, Object> bestMandi = new HashMap<>();
        bestMandi.put("id", 1);
        bestMandi.put("name", "Azadpur Mandi");
        bestMandi.put("district", "Delhi");
        bestMandi.put("state", "Delhi");
        bestMandi.put("latitude", 28.7041);
        bestMandi.put("longitude", 77.1025);
        
        response.put("best_mandi", bestMandi);
        response.put("reasoning", reasoning);
        response.put("hold_days", decision.equals("HOLD") ? 7 : null);
        
        return response;
    }

    @PostMapping("/compare-mandis")
    public List<Map<String, Object>> compareMandis(@RequestBody Map<String, Object> request) {
        // Mocking the comparison for MVP
        List<Map<String, Object>> response = new ArrayList<>();
        
        Map<String, Object> mandi1 = new HashMap<>();
        mandi1.put("mandi_id", 1);
        mandi1.put("mandi_name", "Azadpur Mandi");
        mandi1.put("district", "Delhi");
        mandi1.put("state", "Delhi");
        mandi1.put("distance_km", 45);
        mandi1.put("current_price", 2450);
        mandi1.put("predicted_price_7d", 2580);
        mandi1.put("transport_cost", 1750);
        mandi1.put("storage_cost", 0);
        mandi1.put("losses", 1225);
        mandi1.put("net_profit", 9275);
        mandi1.put("profit_per_kg", 18.55);
        
        Map<String, Object> mandi2 = new HashMap<>();
        mandi2.put("mandi_id", 3);
        mandi2.put("mandi_name", "Yeshwanthpur");
        mandi2.put("district", "Bangalore");
        mandi2.put("state", "Karnataka");
        mandi2.put("distance_km", 200);
        mandi2.put("current_price", 2520);
        mandi2.put("predicted_price_7d", 2640);
        mandi2.put("transport_cost", 3400);
        mandi2.put("storage_cost", 0);
        mandi2.put("losses", 1260);
        mandi2.put("net_profit", 7940);
        mandi2.put("profit_per_kg", 15.88);
        
        response.add(mandi1);
        response.add(mandi2);
        
        return response;
    }
}
