
import { useState, useEffect } from 'react';
import { EpilepsyState, EegDataPoint } from '../types';

const MAX_DATA_POINTS = 300;
const SIMULATION_INTERVAL = 100; // ms, matches useEegSimulator
const POSTICTAL_DURATION = 10000; // 10 seconds

const parseCsv = (csvText: string): number[] => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    // Skip header if it exists and isn't a number
    const dataLines = isNaN(parseFloat(lines[0].split(',')[1])) ? lines.slice(1) : lines;
    
    return dataLines.map(line => {
        const parts = line.split(',');
        // Assuming EEG value is in the second column
        return parseFloat(parts[1]);
    }).filter(value => !isNaN(value));
};

const predictState = (window: number[], previousState: EpilepsyState): EpilepsyState => {
    if (window.length < 20) return EpilepsyState.Normal;
    
    const values = window.slice(-20);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stddev = Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / values.length);
    
    if (stddev > 35) return EpilepsyState.Ictal;
    if (stddev > 20) return EpilepsyState.Preictal;
    if (previousState === EpilepsyState.Ictal && stddev <= 20) return EpilepsyState.Postictal;
    
    return EpilepsyState.Normal;
};

export const useCsvPlayer = (file: File | null) => {
    const [eegData, setEegData] = useState<EegDataPoint[]>([]);
    const [currentState, setCurrentState] = useState<EpilepsyState>(EpilepsyState.Normal);
    const [fullData, setFullData] = useState<number[]>([]);
    const [playbackIndex, setPlaybackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeInPostictal, setTimeInPostictal] = useState(0);

    useEffect(() => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const parsedData = parseCsv(text);
                if (parsedData.length === 0) {
                    console.error("CSV parsing resulted in no data.");
                    return;
                }
                setFullData(parsedData);
                setPlaybackIndex(0);
                setEegData([]);
                setCurrentState(EpilepsyState.Normal);
                setIsPlaying(true);
            } catch (error) {
                console.error("Error parsing CSV file:", error);
            }
        };
        reader.readAsText(file);
    }, [file]);

    useEffect(() => {
        if (!isPlaying || playbackIndex >= fullData.length) {
            if (isPlaying) setIsPlaying(false);
            return;
        }

        const timer = setInterval(() => {
            const newValue = fullData[playbackIndex];
            const newTime = Date.now();
            
            setEegData(prev => {
                const newDataPoint = { time: newTime, value: newValue };
                return [...prev, newDataPoint].slice(-MAX_DATA_POINTS);
            });
            
            setCurrentState(prevState => {
                if (prevState === EpilepsyState.Postictal) {
                    const newTime = timeInPostictal + SIMULATION_INTERVAL;
                    if (newTime >= POSTICTAL_DURATION) {
                        setTimeInPostictal(0);
                        return predictState(fullData.slice(0, playbackIndex + 1), prevState);
                    }
                    setTimeInPostictal(newTime);
                    return EpilepsyState.Postictal;
                }

                const newState = predictState(fullData.slice(0, playbackIndex + 1), prevState);
                if(newState === EpilepsyState.Postictal) {
                    setTimeInPostictal(0);
                }
                return newState;
            });

            setPlaybackIndex(prev => prev + 1);

        }, SIMULATION_INTERVAL);

        return () => clearInterval(timer);

    }, [isPlaying, playbackIndex, fullData, timeInPostictal]);

    const progress = fullData.length > 0 ? (playbackIndex / fullData.length) * 100 : 0;

    return { eegData, currentState, isPlaying, progress, isDataLoaded: fullData.length > 0 };
};
