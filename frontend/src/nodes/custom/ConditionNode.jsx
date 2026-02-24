// ConditionNode.jsx - If/Else logic node
import React, { useState } from 'react';
import { BaseNode } from '../../components/BaseNode';
import { useStore } from '../../store';

export const ConditionNode = ({ id, data, selected }) => {
  const [operator, setOperator] = useState(data?.operator || 'equals');
  const [compareValue, setCompareValue] = useState(data?.compareValue || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleOperatorChange = (e) => {
    setOperator(e.target.value);
    updateNodeField(id, 'operator', e.target.value);
  };

  const handleCompareValueChange = (e) => {
    setCompareValue(e.target.value);
    updateNodeField(id, 'compareValue', e.target.value);
  };

  const operators = [
    { value: 'equals', label: '== Equals', symbol: '==' },
    { value: 'not_equals', label: '!= Not Equals', symbol: '!=' },
    { value: 'greater', label: '> Greater Than', symbol: '>' },
    { value: 'less', label: '< Less Than', symbol: '<' },
    { value: 'greater_eq', label: '>= Greater or Equal', symbol: '>=' },
    { value: 'less_eq', label: '<= Less or Equal', symbol: '<=' },
    { value: 'contains', label: '∈ Contains', symbol: '∈' },
    { value: 'empty', label: '∅ Is Empty', symbol: '∅' },
  ];

  const currentOp = operators.find(op => op.value === operator);

  return (
    <BaseNode
      id={id}
      title="Condition"
      type="condition"
      inputs={[{ id: 'input', label: 'Value' }]}
      outputs={[
        { id: 'true', label: '✓ True' },
        { id: 'false', label: '✗ False' }
      ]}
      selected={selected}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">Operator</label>
          <select
            value={operator}
            onChange={handleOperatorChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:border-transparent appearance-none cursor-pointer"
          >
            {operators.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">
            Compare Value
          </label>
          <input
            type="text"
            value={compareValue}
            onChange={handleCompareValueChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                       focus:border-transparent"
            placeholder="Value to compare..."
          />
        </div>

        {/* Logic Preview */}
        <div className="bg-slate-900/50 rounded-lg p-3">
          <div className="text-center mb-2">
            <span className="text-slate-400 text-xs font-mono">
              IF input <span className="text-indigo-400 font-bold">{currentOp?.symbol}</span> "{compareValue || '...'}"
            </span>
          </div>
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-green-400">True</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-red-400">False</span>
            </div>
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default ConditionNode;
