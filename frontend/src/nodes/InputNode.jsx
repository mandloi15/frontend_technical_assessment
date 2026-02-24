// InputNode.jsx - Input node using BaseNode abstraction
import React, { useState } from 'react';
import { BaseNode } from '../components/BaseNode';
import { useStore } from '../store';

export const InputNode = ({ id, data, selected }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, 'inputName', e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
    updateNodeField(id, 'inputType', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Input"
      type="input"
      outputs={[{ id: 'value', label: 'Output' }]}
      selected={selected}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">Name</label>
          <input
            type="text"
            value={currName}
            onChange={handleNameChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500
                       focus:border-transparent transition-all"
            placeholder="Enter input name..."
          />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">Type</label>
          <select
            value={inputType}
            onChange={handleTypeChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500
                       focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
            <option value="Number">Number</option>
            <option value="JSON">JSON</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};

export default InputNode;
