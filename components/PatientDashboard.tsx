
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { LogOut, User as UserIcon, Wifi, WifiOff, LoaderCircle } from 'lucide-react';
import { useEegSimulator } from '../hooks/useEegSimulator';
import { STATE_CONFIG, STATE_COLORS } from '../constants';
import Card from './ui/Card';
import Toast from './ui/Toast';
import { EpilepsyState } from '../types';
import type { User } from '../types';
import { useCsvPlayer } from '../hooks/useCsvPlayer';
import FileUpload from './ui/FileUpload';

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, onLogout }) => {
  const { eegData: simulatedEegData, currentState: simulatedCurrentState, confidence, predictionHistory } = useEegSimulator();
  const [isOnline, setIsOnline] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'warning' } | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { eegData: csvEegData, currentState: csvCurrentState, progress, isDataLoaded, isPlaying } = useCsvPlayer(uploadedFile);
  
  const currentConfig = STATE_CONFIG[simulatedCurrentState];
  const csvCurrentStateConfig = csvCurrentState ? STATE_CONFIG[csvCurrentState] : null;

  useEffect(() => {
    if (simulatedCurrentState === EpilepsyState.Preictal || simulatedCurrentState === EpilepsyState.Ictal) {
      setToast({ message: `State changed to ${simulatedCurrentState}.`, type: 'warning' });
    }
  }, [simulatedCurrentState]);

  const handleFileSelect = (file: File) => {
    if (file && file.type === 'text/csv') {
      setToast(null);
      setUploadedFile(file);
    } else {
      setToast({ message: 'Please upload a valid CSV file.', type: 'warning' });
    }
  };

  // Mock stats data
  const statsData = [
    { name: 'Normal', value: 75, color: STATE_COLORS.Normal },
    { name: 'Preictal', value: 10, color: STATE_COLORS.Preictal },
    { name: 'Ictal', value: 5, color: STATE_COLORS.Ictal },
    { name: 'Postictal', value: 10, color: STATE_COLORS.Postictal },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-4 sm:p-6 lg:p-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <header className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-300">Epilepsy Monitoring Dashboard</h1>
          <div className="flex items-center gap-2 mt-2 text-blue-400">
            <UserIcon className="h-5 w-5" />
            <span>{user.name} (Patient)</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${isOnline ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            <span>{isOnline ? 'Connected' : 'Offline'}</span>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-blue-600/50 hover:bg-blue-600 text-white font-semibold rounded-lg transition">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Real-Time EEG Simulation" className="h-[25rem] sm:h-[30rem]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulatedEegData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 150, 255, 0.1)" />
                <XAxis dataKey="time" tick={false} axisLine={false} />
                <YAxis domain={[-100, 100]} stroke="rgba(0, 150, 255, 0.3)" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#16213e', border: '1px solid #0096FF', borderRadius: '8px' }}
                  labelStyle={{ color: '#E0E0E0' }}
                />
                 <ReferenceArea y1={-100} y2={100} fill={STATE_COLORS[simulatedCurrentState]} fillOpacity={0.1} />
                <Line type="monotone" dataKey="value" stroke={STATE_COLORS[simulatedCurrentState]} strokeWidth={2} dot={false} isAnimationActive={false}/>
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Uploaded EEG Data Playback">
            <div className="h-[27rem] sm:h-[32rem] flex flex-col">
              {!uploadedFile ? (
                <FileUpload onFileSelect={handleFileSelect} className="h-full"/>
              ) : !isDataLoaded ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <LoaderCircle className="h-12 w-12 animate-spin text-blue-400" />
                  <p className="mt-4 text-gray-400">Processing CSV data...</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <p className="truncate max-w-xs sm:max-w-md" title={uploadedFile.name}>
                        File: <span className="font-medium text-gray-300">{uploadedFile.name}</span>
                      </p>
                      <p className={`${csvCurrentStateConfig?.color}`}>{csvCurrentStateConfig?.label}</p>
                    </div>
                    <div className="w-full bg-gray-900/50 rounded-full h-2.5 mt-2 overflow-hidden border border-blue-900/50">
                      <div className="bg-blue-600 h-full rounded-full transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={csvEegData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 150, 255, 0.1)" />
                        <XAxis dataKey="time" tick={false} axisLine={false} />
                        <YAxis domain={[-100, 100]} stroke="rgba(0, 150, 255, 0.3)" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#16213e', border: '1px solid #0096FF', borderRadius: '8px' }}
                          labelStyle={{ color: '#E0E0E0' }}
                        />
                        {csvCurrentState && <ReferenceArea y1={-100} y2={100} fill={STATE_COLORS[csvCurrentState]} fillOpacity={0.1} />}
                        <Line type="monotone" dataKey="value" stroke={csvCurrentState ? STATE_COLORS[csvCurrentState] : '#8884d8'} strokeWidth={2} dot={false} isAnimationActive={false}/>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <Card className={`${currentConfig.bgColor} border-2 ${currentConfig.color.replace('text-','border-')}`}>
              <div className="text-center">
                  <div className={`relative inline-flex items-center justify-center ${currentConfig.color}`}>
                    {currentConfig.icon}
                    {currentConfig.animation && <span className={`absolute h-16 w-16 ${currentConfig.animation} ${currentConfig.color.replace('text-','bg-')} opacity-50 rounded-full`}></span>}
                  </div>
                  <h2 className={`text-3xl font-bold mt-4 ${currentConfig.color}`}>{currentConfig.label}</h2>
                  <p className="text-gray-400 mt-2">Confidence: {confidence.toFixed(2)}%</p>
              </div>
          </Card>
          
          <Card title="Statistics (Live Sim)">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                    {statsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Prediction History (Live Sim)">
            <ul className="space-y-2">
              {predictionHistory.map((p, i) => (
                  <li key={i} className="flex justify-between items-center text-sm p-2 rounded-md bg-gray-800/50">
                    <span className={`${STATE_CONFIG[p.state].color} font-semibold`}>{p.state}</span>
                    <span className="text-gray-400">{new Date(p.timestamp).toLocaleTimeString()}</span>
                  </li>
              ))}
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
