import React, { useEffect, useRef, useCallback } from 'react';
import { createChart, IChartApi, DeepPartial, ChartOptions, ISeriesApi, LineStyle } from 'lightweight-charts';
import { usePredictions } from '../hooks/usePredictions';

interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Props {
  data: ChartData[];
  symbol: string;
}

const defaultOptions: DeepPartial<ChartOptions> = {
  layout: {
    background: { color: '#ffffff' },
    textColor: '#333',
  },
  grid: {
    vertLines: { color: '#f0f0f0' },
    horzLines: { color: '#f0f0f0' },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
};

const TradingViewChart: React.FC<Props> = ({ data, symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const predictionSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const confidenceAreaRef = useRef<ISeriesApi<"Area"> | null>(null);

  const { predictions, confidenceIntervals, isTraining } = usePredictions(data);

  const handleResize = useCallback(() => {
    if (chartContainerRef.current && chartRef.current) {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    }
  }, []);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      ...defaultOptions,
      width: container.clientWidth,
      height: 400,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const predictionSeries = chart.addLineSeries({
      color: '#2962FF',
      lineWidth: 2,
      lineStyle: LineStyle.Dotted,
    });

    const confidenceArea = chart.addAreaSeries({
      topColor: 'rgba(41, 98, 255, 0.2)',
      bottomColor: 'rgba(41, 98, 255, 0.0)',
      lineColor: 'rgba(41, 98, 255, 0.5)',
      lineWidth: 1,
    });

    chartRef.current = chart;
    candleSeriesRef.current = candlestickSeries;
    predictionSeriesRef.current = predictionSeries;
    confidenceAreaRef.current = confidenceArea;

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [handleResize]);

  useEffect(() => {
    if (!candleSeriesRef.current || !data.length) return;

    const sortedData = [...data].sort((a, b) => a.time - b.time);
    candleSeriesRef.current.setData(sortedData);

    if (predictions.length && predictionSeriesRef.current && confidenceAreaRef.current) {
      const lastTimestamp = sortedData[sortedData.length - 1].time;
      const predictionData = predictions.map((price, i) => ({
        time: lastTimestamp + (i + 1) * 86400,
        value: price,
      }));

      const confidenceData = confidenceIntervals.map((interval, i) => ({
        time: lastTimestamp + (i + 1) * 86400,
        high: interval.upper,
        low: interval.lower,
      }));

      predictionSeriesRef.current.setData(predictionData);
      confidenceAreaRef.current.setData(confidenceData);
    }

    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  }, [data, predictions, confidenceIntervals]);

  return (
    <div className="w-full h-[400px] bg-white rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{symbol} Chart</h2>
        {isTraining && (
          <span className="text-sm text-blue-600">
            Training ML model...
          </span>
        )}
      </div>
      <div ref={chartContainerRef} />
    </div>
  );
};

export default TradingViewChart;