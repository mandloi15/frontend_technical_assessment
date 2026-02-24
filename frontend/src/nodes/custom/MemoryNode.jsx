// MemoryNode.jsx - Value storage/memory node
import React, { useState } from 'react';
import { BaseNode } from '../../components/BaseNode';
import { useStore } from '../../store';

export const MemoryNode = ({ id, data, selected }) => {
  const [key, setKey] = useState(data?.key || 'myVariable');
  const [defaultValue, setDefaultValue] = useState(data?.defaultValue || '');
  const [operation, setOperation] = useState(data?.operation || 'get');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleKeyChange = (e) => {
    setKey(e.target.value);
    updateNodeField(id, 'key', e.target.value);
  };

  const handleDefaultValueChange = (e) => {
    setDefaultValue(e.target.value);
    updateNodeField(id, 'defaultValue', e.target.value);
  };

  const handleOperationChange = (e) => {
    setOperation(e.target.value);
    updateNodeField(id, 'operation', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Memory"
      type="memory"
      inputs={[
        { id: 'value', label: 'Value' },
        { id: 'trigger', label: 'Trigger' }
      ]}
      outputs={[
        { id: 'stored', label: 'Stored' },
        { id: 'previous', label: 'Previous' }
      ]}
      selected={selected}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">Operation</label>
          <select
            value={operation}
            onChange={handleOperationChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500
                       focus:border-transparent appearance-none cursor-pointer"
          >
            <option value="get">📖 Get Value</option>
            <option value="set">📝 Set Value</option>
            <option value="append">➕ Append</option>
            <option value="increment">🔼 Increment</option>
            <option value="decrement">🔽 Decrement</option>
            <option value="clear">🗑️ Clear</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">
            Variable Key
          </label>
          <input
            type="text"
            value={key}
            onChange={handleKeyChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500
                       focus:border-transparent font-mono"
            placeholder="variableName"
          />
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">
            Default Value
          </label>
          <input
            type="text"
            value={defaultValue}
            onChange={handleDefaultValueChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500
                       focus:border-transparent"
            placeholder="Default value if not set"
          />
        </div>

        {/* Memory Status */}
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Storage Key:</span>
            <span className="text-teal-400 font-mono">{key}</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-slate-500">Operation:</span>
            <span className="text-teal-400">{operation.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default MemoryNode;
