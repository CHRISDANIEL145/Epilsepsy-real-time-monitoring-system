
import { useState, useEffect, useCallback } from 'react';
import { EpilepsyState } from '../types';
import type { EegDataPoint, Prediction } from '../types';

const MAX_DATA_POINTS = 300; // 30 seconds of data at 100ms interval
const SIMULATION_INTERVAL = 100; // ms

// State transition cycle: Normal -> Preictal -> Ictal -> Postictal -> Normal
const STATE_DURATIONS: Record<EpilepsyState, number> = {
  [EpilepsyState.Normal]: 30000, // 30 seconds
  [EpilepsyState.Preictal]: 15000, // 15 seconds
  [EpilepsyState.Ictal]: 20000, // 20 seconds
  [EpilepsyState.Postictal]: 15000, // 15 seconds
};

const STATE_TRANSITION_MAP: Record<EpilepsyState, EpilepsyState> = {
    [EpilepsyState.Normal]: EpilepsyState.Preictal,
    [EpilepsyState.Preictal]: EpilepsyState.Ictal,
    [EpilepsyState.Ictal]: EpilepsyState.Postictal,
    [EpilepsyState.Postictal]: EpilepsyState.Normal,
};

const generateEegValue = (state: EpilepsyState, time: number): number => {
    const base = Math.sin(time / 5) * 20;
    const noise = (Math.random() - 0.5) * 10;
    let anomaly = 0;

    switch (state) {
        case EpilepsyState.Preictal:
            anomaly = Math.sin(time / 2) * 15;
            break;
        case EpilepsyState.Ictal:
            anomaly = (Math.random() - 0.5) * 80 + Math.sin(time) * 30;
            break;
        case EpilepsyState.Postictal:
            anomaly = (Math.random() - 0.5) * 5;
            break;
        default: // Normal
            break;
    }

    return base + noise + anomaly;
};

export const useEegSimulator = () => {
    const [eegData, setEegData] = useState<EegDataPoint[]>([]);
    const [currentState, setCurrentState] = useState<EpilepsyState>(EpilepsyState.Normal);
    const [confidence, setConfidence] = useState<number>(98.5);
    const [timeInState, setTimeInState] = useState(0);
    const [predictionHistory, setPredictionHistory] = useState<Prediction[]>([]);

    const addPredictionToHistory = useCallback((state: EpilepsyState) => {
        setPredictionHistory(prev => [{ state, timestamp: Date.now() }, ...prev.slice(0, 9)]);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            const newTime = Date.now();
            
            setTimeInState(prev => {
                const newTimeInState = prev + SIMULATION_INTERVAL;
                if (newTimeInState >= STATE_DURATIONS[currentState]) {
                    const nextState = STATE_TRANSITION_MAP[currentState];
                    setCurrentState(nextState);
                    addPredictionToHistory(nextState);
                    return 0;
                }
                return newTimeInState;
            });

            setEegData(prevData => {
                const newDataPoint = {
                    time: newTime,
                    value: generateEegValue(currentState, newTime / 100),
                };
                const updatedData = [...prevData, newDataPoint];
                return updatedData.length > MAX_DATA_POINTS ? updatedData.slice(1) : updatedData;
            });
            
            setConfidence(Math.random() * 10 + 88);

        }, SIMULATION_INTERVAL);

        return () => clearInterval(timer);
    }, [currentState, addPredictionToHistory]);

    return { eegData, currentState, confidence, predictionHistory };
};
