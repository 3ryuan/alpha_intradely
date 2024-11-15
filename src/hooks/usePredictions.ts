import { useState, useEffect } from 'react';
import { CandleData } from '../types';
import { PredictionModel } from '../services/predictionModel';

const predictionModel = new PredictionModel();

export const usePredictions = (historicalData: CandleData[]) => {
  const [predictions, setPredictions] = useState<number[]>([]);
  const [confidenceIntervals, setConfidenceIntervals] = useState<{ upper: number; lower: number }[]>([]);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    let mounted = true;

    const updatePredictions = async () => {
      if (historicalData.length < 20) return;

      try {
        setIsTraining(true);
        await predictionModel.train(historicalData);
        
        if (!mounted) return;

        const newPredictions = await predictionModel.predict(historicalData);
        const intervals = await predictionModel.getConfidenceInterval(newPredictions);

        if (mounted) {
          setPredictions(newPredictions);
          setConfidenceIntervals(intervals);
        }
      } catch (error) {
        console.error('Prediction error:', error);
      } finally {
        if (mounted) {
          setIsTraining(false);
        }
      }
    };

    updatePredictions();

    return () => {
      mounted = false;
    };
  }, [historicalData]);

  return {
    predictions,
    confidenceIntervals,
    isTraining
  };
};