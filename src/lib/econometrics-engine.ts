// Econometric Simulation Engine for ARIMA, GARCH, and Monte Carlo Policy Simulation
import { COMMODITIES, MonthlyPriceRecord } from './data';

export interface ForecastPoint {
  month: string;
  price: number;
  lowerCI: number; // 95% Confidence Interval Lower Bound
  upperCI: number; // 95% Confidence Interval Upper Bound
  volatility: number; // Time-varying volatility
}

export interface SimulationResult {
  paths: number[][]; // 50 simulated paths for 12 months
  months: string[];
  medianPath: number[];
  stabilityProbability: number; // percentage of paths staying in safety corridor [2.0% - 4.5%]
  averageBudgetCost: number; // Trillion IDR
}

export interface PolicyMetrics {
  berasPriceChangePct: number;
  foodInflationRate: number;
  budgetDeficitTrillion: number;
  stabilityIndex: number;
}

// Helper to generate monthly labels for the forecast (Jan 2026 - Dec 2026)
const FORECAST_MONTHS = [
  '2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06',
  '2026-07', '2026-08', '2026-09', '2026-10', '2026-11', '2026-12'
];

/**
 * 1. ARIMA(1,1,1) Forecasting Simulator
 * Predicts the price for next 12 months with confidence bounds.
 */
export function runARIMAForecast(
  commodityId: string,
  phi = 0.75, // Autoregressive parameter
  theta = -0.35 // Moving Average parameter
): ForecastPoint[] {
  const commodity = COMMODITIES.find(c => c.id === commodityId);
  if (!commodity) return [];

  const historical = commodity.historical;
  const lastPrice = historical[historical.length - 1].price;
  const prices = historical.map(h => h.price);

  // Calculate historical drift/trend
  let sumDiff = 0;
  for (let i = 1; i < prices.length; i++) {
    sumDiff += prices[i] - prices[i - 1];
  }
  const avgDrift = sumDiff / (prices.length - 1);

  // Standard error of historical prices
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
  const stdError = Math.sqrt(variance) * 0.04; // scale residual error for realistic forecasts

  const forecast: ForecastPoint[] = [];
  let prevPrice = lastPrice;
  let prevError = stdError * (Math.random() - 0.5);

  // Simple ARIMA model equation:
  // Diff(t) = Drift + phi * Diff(t-1) + theta * Error(t-1)
  let prevDiff = avgDrift;

  FORECAST_MONTHS.forEach((month, idx) => {
    const error = stdError * (Math.random() - 0.5);
    const diff = avgDrift + phi * prevDiff + theta * prevError;
    const price = Math.round(prevPrice + diff);
    
    // Confidence intervals expand as t increases (propagate uncertainty)
    const stepUncertainty = stdError * Math.sqrt(idx + 1) * 1.96;
    const lowerCI = Math.round(price - stepUncertainty);
    const upperCI = Math.round(price + stepUncertainty);
    
    forecast.push({
      month,
      price,
      lowerCI,
      upperCI,
      volatility: stdError
    });

    prevPrice = price;
    prevDiff = diff;
    prevError = error;
  });

  return forecast;
}

/**
 * 2. GARCH(1,1) Volatility Simulator
 * Predicts the price and volatility paths (with conditional heteroskedasticity).
 */
export function runGARCHForecast(
  commodityId: string,
  omega = 0.1,  // Baseline variance constant
  alpha = 0.15, // Sensitivity of current variance to past shocks (ARCH)
  beta = 0.80   // Persistence of volatility (GARCH)
): ForecastPoint[] {
  const commodity = COMMODITIES.find(c => c.id === commodityId);
  if (!commodity) return [];

  const historical = commodity.historical;
  const lastPrice = historical[historical.length - 1].price;
  const prices = historical.map(h => h.price);

  // Baseline standard deviation
  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / prices.length;
  let currentVar = variance * 0.001; // Scale variance down to return rate scale

  const forecast: ForecastPoint[] = [];
  let prevPrice = lastPrice;
  let prevShock = 0;

  FORECAST_MONTHS.forEach((month, idx) => {
    // GARCH(1,1): sigma^2_t = omega + alpha * e^2_{t-1} + beta * sigma^2_{t-1}
    currentVar = omega + alpha * Math.pow(prevShock, 2) + beta * currentVar;
    const stdDev = Math.sqrt(currentVar);

    // Simulated shock using standard normal approximation
    const z = (Math.random() + Math.random() + Math.random() - 1.5) * 1.63; // normal distribution approximation
    const shock = stdDev * z;
    
    // High volatility commodities like chili have larger shocks
    const volatilityMultiplier = commodity.volatilityRating === 'High' ? 1.5 : (commodity.volatilityRating === 'Medium' ? 1.0 : 0.6);
    const returnRate = 0.002 + shock * volatilityMultiplier; // Drift rate + shock
    
    const price = Math.round(prevPrice * (1 + returnRate));
    
    // Confidence intervals grow dynamically with the conditional variance
    const CIWidth = price * stdDev * 1.96 * Math.sqrt(idx + 1) * volatilityMultiplier;
    const lowerCI = Math.round(price - CIWidth);
    const upperCI = Math.round(price + CIWidth);

    forecast.push({
      month,
      price,
      lowerCI,
      upperCI,
      volatility: stdDev
    });

    prevPrice = price;
    prevShock = shock;
  });

  return forecast;
}

/**
 * 3. Policy Transmission Model
 * Evaluates impact of three fiscal policy levers:
 * - fertilizerSubsidy: level of additional fertilizer subsidy in % (0 to 100)
 * - riceImportVolume: rice import quotas in Million Metric Tons (MMT) (0.0 to 2.5)
 * - bulogDistribution: Bulog operations scale in % (0 to 100)
 */
export function evaluatePolicyImpact(
  fertilizerSubsidy: number, // 0 - 100
  riceImportVolume: number,  // 0.0 - 2.5
  bulogDistribution: number  // 0 - 100
): PolicyMetrics {
  // Baseline rates
  const baselineDeficit = 32.5; // Trillion IDR (Base budget cost for food stabilization)
  const baselineFoodInflation = 5.4; // 5.4% Food inflation baseline

  // Policy costs
  const subsidyCost = (fertilizerSubsidy / 100) * 12.0; // max 12T extra
  const importCost = riceImportVolume * 2.5; // import logistics, max 6.25T
  const bulogCost = (bulogDistribution / 100) * 4.5; // distribution operations, max 4.5T
  const totalBudgetDeficit = baselineDeficit + subsidyCost + importCost + bulogCost;

  // Commodity price reduction impacts (percentages)
  // 1. Fertilizer subsidy lowers farm input costs, reducing domestic prices (affects Beras, Cabai, Bawang)
  const subsidyReduction = -(fertilizerSubsidy / 100) * 0.14; // max -14%
  
  // 2. Rice imports directly expand rice supply, reducing price eceran Beras
  const importReduction = -riceImportVolume * 0.06; // max -15%
  
  // 3. Bulog operations releases government grain stock to damp speculation
  const bulogReduction = -(bulogDistribution / 100) * 0.07; // max -7%

  // Combined Rice Price Impact (transmission)
  const berasPriceChangePct = Math.round((subsidyReduction * 0.5 + importReduction + bulogReduction * 0.6) * 100);

  // Overall volatile food inflation impact
  // Food inflation is weighted by rice (40%), horticultural spices (30%), livestock (30%)
  const foodInflationRate = Math.max(1.2, parseFloat(
    (baselineFoodInflation + 
     (berasPriceChangePct / 10) + 
     (subsidyReduction * 8) + 
     (bulogReduction * 4)
    ).toFixed(2)
  ));

  // Policy Stability Index (Scale 0-100)
  // Optimal food inflation target is 2.5% - 3.0%. Deviations lower the stability score.
  // Higher budget deficit also slightly lowers the sustainability of the policy index.
  const inflationDeviation = Math.abs(foodInflationRate - 2.8);
  const budgetPenalty = Math.max(0, (totalBudgetDeficit - 35) * 0.8);
  const stabilityIndex = Math.max(15, Math.min(100, Math.round(100 - (inflationDeviation * 14) - budgetPenalty + (bulogDistribution * 0.05))));

  return {
    berasPriceChangePct,
    foodInflationRate,
    budgetDeficitTrillion: parseFloat(totalBudgetDeficit.toFixed(2)),
    stabilityIndex
  };
}

/**
 * 4. Monte Carlo Simulation Engine
 * Runs 50 random paths for volatile food inflation over 12 months
 * based on selected policies under global oil volatility shock.
 */
export function runMonteCarloSimulation(
  fertilizerSubsidy: number,
  riceImportVolume: number,
  bulogDistribution: number,
  globalOilVolatility: 'High' | 'Medium' | 'Low' = 'Medium'
): SimulationResult {
  const numPaths = 50;
  const numMonths = 12;
  const paths: number[][] = [];

  const policy = evaluatePolicyImpact(fertilizerSubsidy, riceImportVolume, bulogDistribution);
  
  // Base inflation start (e.g. 5.1%)
  const startingInflation = 5.1;

  // Global oil volatility increases baseline variance
  const baselineVariance = globalOilVolatility === 'High' ? 1.5 : (globalOilVolatility === 'Medium' ? 0.9 : 0.5);
  
  // Bulog operation scales down standard deviation (dampens price spreads/volatility spikes)
  const volatilityReduction = Math.max(0.4, 1.0 - (bulogDistribution / 100) * 0.45);
  const pathSigma = Math.sqrt(baselineVariance) * volatilityReduction * 0.45;

  // Drift rate is driven by policy success (towards stability)
  // We want drift to pull inflation towards the target of 2.8%
  const targetInflation = 2.8;
  const policyImpactRate = (policy.foodInflationRate - startingInflation) / 12;

  for (let p = 0; p < numPaths; p++) {
    const path: number[] = [startingInflation];
    let currentInf = startingInflation;

    for (let m = 1; m < numMonths; m++) {
      // Mean reverting process towards target inflation rate + random brownian motion walk
      const meanReversionDrift = 0.15 * (targetInflation - currentInf);
      const policyDrift = policyImpactRate;
      const z = (Math.random() + Math.random() + Math.random() - 1.5) * 1.63; // normal approx
      const randomShock = pathSigma * z;

      currentInf = Math.max(0.5, parseFloat((currentInf + meanReversionDrift + policyDrift + randomShock).toFixed(2)));
      path.push(currentInf);
    }
    paths.push(path);
  }

  // Calculate Median Path
  const medianPath: number[] = [];
  for (let m = 0; m < numMonths; m++) {
    const monthValues = paths.map(p => p[m]).sort((a, b) => a - b);
    const median = monthValues[Math.floor(numPaths / 2)];
    medianPath.push(parseFloat(median.toFixed(2)));
  }

  // Calculate Stability Probability
  // Percentage of final month (Month 12) points falling within the safety corridor [2.0% - 4.2%]
  let successCount = 0;
  paths.forEach(p => {
    const finalVal = p[numMonths - 1];
    if (finalVal >= 2.0 && finalVal <= 4.2) {
      successCount++;
    }
  });
  const stabilityProbability = Math.round((successCount / numPaths) * 100);

  return {
    paths,
    months: FORECAST_MONTHS,
    medianPath,
    stabilityProbability,
    averageBudgetCost: policy.budgetDeficitTrillion
  };
}
