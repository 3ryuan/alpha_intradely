import * as tf from '@tensorflow/tfjs';
import { CandleData } from '../types';

// Reduced window size and prediction horizon for faster processing
const WINDOW_SIZE = 10;
const PREDICTION_HORIZON = 3;

export class PredictionModel {
  private model: tf.LayersModel | null = null;
  private isTraining = false;
  private meanStd: { mean: number; std: number } = { mean: 0, std: 0 };

  private preprocessData(data: number[]): { mean: number; std: number; normalized: number[] } {
    const mean = data.reduce((a, b) => a + b) / data.length;
    const std = Math.sqrt(data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length);
    const normalized = data.map(x => (x - mean) / std);
    return { mean, std, normalized };
  }

  private createSequences(data: number[], windowSize: number): [tf.Tensor2D, tf.Tensor2D] {
    const sequences: number[][] = [];
    const targets: number[] = [];

    for (let i = 0; i <= data.length - windowSize - PREDICTION_HORIZON; i++) {
      sequences.push(data.slice(i, i + windowSize));
      targets.push(data[i + windowSize + PREDICTION_HORIZON - 1]);
    }

    return [
      tf.tensor2d(sequences),
      tf.tensor2d(targets, [targets.length, 1])
    ];
  }

  private async createModel(): Promise<tf.LayersModel> {
    const model = tf.sequential();

    // Simplified architecture for faster training
    model.add(tf.layers.dense({
      units: 32,
      inputShape: [WINDOW_SIZE],
      activation: 'relu'
    }));

    model.add(tf.layers.dense({
      units: 16,
      activation: 'relu'
    }));

    model.add(tf.layers.dense({ units: 1 }));

    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError'
    });

    return model;
  }

  async train(historicalData: CandleData[]): Promise<void> {
    if (this.isTraining) return;
    this.isTraining = true;

    try {
      const closePrices = historicalData.slice(-50).map(d => d.close); // Use only recent data
      const { mean, std, normalized } = this.preprocessData(closePrices);
      this.meanStd = { mean, std };

      const [xTrain, yTrain] = this.createSequences(normalized, WINDOW_SIZE);

      if (!this.model) {
        this.model = await this.createModel();
      }

      await this.model.fit(xTrain, yTrain, {
        epochs: 20, // Reduced epochs
        batchSize: 16,
        shuffle: true,
        verbose: 0
      });

      xTrain.dispose();
      yTrain.dispose();
    } finally {
      this.isTraining = false;
    }
  }

  async predict(recentData: CandleData[]): Promise<number[]> {
    if (!this.model || recentData.length < WINDOW_SIZE) {
      return [];
    }

    const closePrices = recentData.slice(-WINDOW_SIZE).map(d => d.close);
    const normalized = closePrices.map(x => (x - this.meanStd.mean) / this.meanStd.std);

    const input = tf.tensor2d([normalized]);
    const predictions = await this.model.predict(input) as tf.Tensor;
    const predictionArray = await predictions.array() as number[][];

    input.dispose();
    predictions.dispose();

    return predictionArray[0].map(p => p * this.meanStd.std + this.meanStd.mean);
  }

  async getConfidenceInterval(predictions: number[]): Promise<{ upper: number; lower: number }[]> {
    const volatility = this.meanStd.std * 0.5; // Reduced confidence interval
    return predictions.map(pred => ({
      upper: pred + volatility,
      lower: pred - volatility
    }));
  }
}