// LLMNode.jsx - LLM node using BaseNode abstraction
import React, { useState } from 'react';
import { BaseNode } from '../components/BaseNode';
import { useStore } from '../store';

export const LLMNode = ({ id, data, selected }) => {
  const [model, setModel] = useState(data?.model || 'gpt-4');
  const [temperature, setTemperature] = useState(data?.temperature || 0.7);
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleModelChange = (e) => {
    setModel(e.target.value);
    updateNodeField(id, 'model', e.target.value);
  };

  const handleTempChange = (e) => {
    const value = parseFloat(e.target.value);
    setTemperature(value);
    updateNodeField(id, 'temperature', value);
  };

  return (
    <BaseNode
      id={id}
      title="LLM Engine"
      type="llm"
      inputs={[
        { id: 'system', label: 'System' },
        { id: 'prompt', label: 'Prompt' }
      ]}
      outputs={[{ id: 'response', label: 'Response' }]}
      selected={selected}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">Model</label>
          <select
            value={model}
            onChange={handleModelChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500
                       focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="claude-3">Claude 3</option>
            <option value="llama-2">Llama 2</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">
            Temperature: {temperature}
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={temperature}
            onChange={handleTempChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                       accent-violet-500"
          />
        </div>
        <div className="text-xs text-slate-500 italic">
          Processes prompts using selected LLM
        </div>
      </div>
    </BaseNode>
  );
};

export default LLMNode;
