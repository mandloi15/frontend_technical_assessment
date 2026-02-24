// OutputNode.jsx - Output node using BaseNode abstraction
import React, { useState } from 'react';
import { BaseNode } from '../components/BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data, selected }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, 'outputName', e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
    updateNodeField(id, 'outputType', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Output"
      type="output"
      inputs={[{ id: 'value', label: 'Input' }]}
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
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500
                       focus:border-transparent transition-all"
            placeholder="Enter output name..."
          />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">Type</label>
          <select
            value={outputType}
            onChange={handleTypeChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500
                       focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="Text">Text</option>
            <option value="Image">Image</option>
            <option value="File">File</option>
            <option value="JSON">JSON</option>
          </select>
        </div>
      </div>
    </BaseNode>
  );
};

export default OutputNode;
