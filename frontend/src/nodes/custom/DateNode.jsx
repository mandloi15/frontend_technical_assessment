// DateNode.jsx - Date/Time operations node
import React, { useState, useEffect } from 'react';
import { BaseNode } from '../../components/BaseNode';
import { useStore } from '../../store';

export const DateNode = ({ id, data, selected }) => {
  const [format, setFormat] = useState(data?.format || 'ISO');
  const [timezone, setTimezone] = useState(data?.timezone || 'local');
  const [currentTime, setCurrentTime] = useState(new Date());
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
    updateNodeField(id, 'format', e.target.value);
  };

  const handleTimezoneChange = (e) => {
    setTimezone(e.target.value);
    updateNodeField(id, 'timezone', e.target.value);
  };

  const formats = [
    { value: 'ISO', label: 'ISO 8601' },
    { value: 'date', label: 'Date Only' },
    { value: 'time', label: 'Time Only' },
    { value: 'datetime', label: 'Date & Time' },
    { value: 'unix', label: 'Unix Timestamp' },
    { value: 'relative', label: 'Relative' },
  ];

  const formatDate = (date) => {
    switch (format) {
      case 'ISO': return date.toISOString();
      case 'date': return date.toLocaleDateString();
      case 'time': return date.toLocaleTimeString();
      case 'datetime': return date.toLocaleString();
      case 'unix': return Math.floor(date.getTime() / 1000).toString();
      case 'relative': return 'now';
      default: return date.toISOString();
    }
  };

  return (
    <BaseNode
      id={id}
      title="Date/Time"
      type="date"
      inputs={[{ id: 'input', label: 'Input Date' }]}
      outputs={[
        { id: 'formatted', label: 'Formatted' },
        { id: 'timestamp', label: 'Timestamp' }
      ]}
      selected={selected}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">Format</label>
          <select
            value={format}
            onChange={handleFormatChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500
                       focus:border-transparent appearance-none cursor-pointer"
          >
            {formats.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">Timezone</label>
          <select
            value={timezone}
            onChange={handleTimezoneChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500
                       focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="local">Local</option>
            <option value="UTC">UTC</option>
            <option value="EST">EST</option>
            <option value="PST">PST</option>
            <option value="IST">IST (India)</option>
          </select>
        </div>

        {/* Live Clock */}
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <div className="text-2xl font-mono text-pink-400 mb-1">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-xs text-slate-500">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default DateNode;
