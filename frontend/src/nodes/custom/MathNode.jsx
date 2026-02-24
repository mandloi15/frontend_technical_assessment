// MathNode.jsx - Mathematical operations node
import React, { useState } from 'react';
import { BaseNode } from '../../components/BaseNode';
import { useStore } from '../../store';

export const MathNode = ({ id, data, selected }) => {
  const [operation, setOperation] = useState(data?.operation || 'add');
  const [value, setValue] = useState(data?.value || 0);
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleOperationChange = (e) => {
    setOperation(e.target.value);
    updateNodeField(id, 'operation', e.target.value);
  };

  const handleValueChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    setValue(val);
    updateNodeField(id, 'value', val);
  };

  const operations = [
    { value: 'add', label: '➕ Add', symbol: '+' },
    { value: 'subtract', label: '➖ Subtract', symbol: '-' },
    { value: 'multiply', label: '✖️ Multiply', symbol: '×' },
    { value: 'divide', label: '➗ Divide', symbol: '÷' },
    { value: 'modulo', label: '📊 Modulo', symbol: '%' },
    { value: 'power', label: '🔢 Power', symbol: '^' },
  ];

  const currentOp = operations.find(op => op.value === operation);

  return (
    <BaseNode
      id={id}
      title="Math"
      type="math"
      inputs={[
        { id: 'inputA', label: 'A' },
        { id: 'inputB', label: 'B' }
      ]}
      outputs={[{ id: 'result', label: 'Result' }]}
      selected={selected}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">Operation</label>
          <select
            value={operation}
            onChange={handleOperationChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-transparent appearance-none cursor-pointer"
          >
            {operations.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">
            Constant Value (optional)
          </label>
          <input
            type="number"
            value={value}
            onChange={handleValueChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-transparent"
            placeholder="0"
          />
        </div>

        {/* Operation Preview */}
        <div className="bg-slate-900/50 rounded-lg p-3 text-center">
          <div className="text-slate-400 font-mono text-sm">
            A <span className="text-blue-400 text-lg mx-2">{currentOp?.symbol}</span> B = Result
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default MathNode;
