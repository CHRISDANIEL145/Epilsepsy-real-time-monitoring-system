
import React from 'react';
import { HeartPulse, ShieldAlert, Siren, CheckCircle2 } from 'lucide-react';
import { EpilepsyState } from './types';
import type { ReactElement } from 'react';

interface StateConfig {
  color: string;
  bgColor: string;
  icon: ReactElement;
  label: string;
  animation?: string;
}

export const STATE_CONFIG: Record<EpilepsyState, StateConfig> = {
  [EpilepsyState.Normal]: {
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
    icon: <HeartPulse className="h-16 w-16" />,
    label: 'Normal',
    animation: 'animate-pulse-slow',
  },
  [EpilepsyState.Preictal]: {
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    icon: <ShieldAlert className="h-16 w-16" />,
    label: 'Preictal (Warning)',
    animation: 'animate-pulse',
  },
  [EpilepsyState.Ictal]: {
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    icon: <Siren className="h-16 w-16" />,
    label: 'Ictal (Seizure)',
    animation: 'animate-ping-fast',
  },
  [EpilepsyState.Postictal]: {
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    icon: <CheckCircle2 className="h-16 w-16" />,
    label: 'Postictal (Recovery)',
    animation: '',
  },
};

export const STATE_COLORS: Record<EpilepsyState, string> = {
    [EpilepsyState.Normal]: '#4CAF50',
    [EpilepsyState.Preictal]: '#FFC107',
    [EpilepsyState.Ictal]: '#F44336',
    [EpilepsyState.Postictal]: '#2196F3',
};
