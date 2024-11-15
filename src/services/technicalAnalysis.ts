import { SMA, RSI, MACD } from 'technicalindicators';
import { CandleData, AnalysisResult, TradingLevels } from '../types';

function calculateTradingLevels(data: CandleData[], signal: 'buy' | 'sell' | 'neutral'): TradingLevels | undefined {
  if (signal === 'neutral') return undefined;

  const currentPrice = data[data.length - 1].close;
  const prices = data.slice(-20).map(d => d.close);
  
  // Calculate Average True Range (ATR) manually for faster processing
  const trueRanges = data.slice(-14).map((d, i) => {
    if (i === 0) return d.high - d.low;
    const previousClose = data[i - 1].close;
    const tr = Math.max(
      d.high - d.low,
      Math.abs(d.high - previousClose),
      Math.abs(d.low - previousClose)
    );
    return tr;
  });
  
  const atr = trueRanges.reduce((sum, tr) => sum + tr, 0) / trueRanges.length;
  
  // Calculate volatility
  const volatility = Math.sqrt(
    prices.reduce((sum, price) => {
      const diff = price - currentPrice;
      return sum + diff * diff;
    }, 0) / prices.length
  );

  const riskMultiplier = 1.5;
  const rewardMultiplier = 3;

  if (signal === 'buy') {
    const stopLoss = currentPrice - (atr * riskMultiplier);
    const takeProfit = currentPrice + (atr * rewardMultiplier);

    return {
      entry: Number(currentPrice.toFixed(8)),
      takeProfit: Number(takeProfit.toFixed(8)),
      stopLoss: Number(stopLoss.toFixed(8)),
      riskRewardRatio: rewardMultiplier / riskMultiplier
    };
  } else {
    const stopLoss = currentPrice + (atr * riskMultiplier);
    const takeProfit = currentPrice - (atr * rewardMultiplier);

    return {
      entry: Number(currentPrice.toFixed(8)),
      takeProfit: Number(takeProfit.toFixed(8)),
      stopLoss: Number(stopLoss.toFixed(8)),
      riskRewardRatio: rewardMultiplier / riskMultiplier
    };
  }
}

export async function analyzeMarket(data: CandleData[], symbol: string): Promise<AnalysisResult> {
  try {
    if (data.length < 50) {
      throw new Error("Insufficient data for analysis");
    }

    const closes = data.map(d => d.close);
    const currentPrice = closes[closes.length - 1];
    
    // Calculate basic indicators
    const sma20 = SMA.calculate({ period: 20, values: closes }).slice(-1)[0];
    const sma50 = SMA.calculate({ period: 50, values: closes }).slice(-1)[0];
    const rsi = RSI.calculate({ period: 14, values: closes }).slice(-1)[0];
    
    const macdInput = {
      values: closes,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    };
    
    const macdResult = MACD.calculate(macdInput);
    const macd = macdResult[macdResult.length - 1];

    // Simplified signal generation
    let signal: 'buy' | 'sell' | 'neutral';
    let strength = 50;

    if (currentPrice > sma20 && sma20 > sma50 && rsi < 70 && macd.histogram > 0) {
      signal = 'buy';
      strength = 70;
    } else if (currentPrice < sma20 && sma20 < sma50 && rsi > 30 && macd.histogram < 0) {
      signal = 'sell';
      strength = 70;
    } else {
      signal = 'neutral';
    }

    const levels = calculateTradingLevels(data, signal);
    
    // Generate analysis reason
    let reason = '';
    if (signal === 'buy') {
      reason = `Bullish trend detected with price above SMAs. RSI at ${rsi.toFixed(2)} shows momentum.`;
    } else if (signal === 'sell') {
      reason = `Bearish trend detected with price below SMAs. RSI at ${rsi.toFixed(2)} shows momentum.`;
    } else {
      reason = 'Market showing mixed signals. Consider waiting for clearer direction.';
    }

    if (levels) {
      reason += ` Entry at ${levels.entry}, take profit at ${levels.takeProfit}, stop loss at ${levels.stopLoss} (${levels.riskRewardRatio}:1 risk/reward ratio).`;
    }

    return {
      signal,
      strength,
      reason,
      levels
    };
  } catch (error) {
    console.error('Market analysis failed:', error);
    return {
      signal: 'neutral',
      strength: 50,
      reason: 'Analysis failed due to technical issues. Please try again later.',
    };
  }
}