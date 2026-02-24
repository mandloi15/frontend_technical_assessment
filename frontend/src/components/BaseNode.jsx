// BaseNode.jsx - Reusable node component for all node types
import React from 'react';
import { NodeHeader } from './NodeHeader';
import { Handles } from './Handles';

const nodeColors = {
  input: { gradient: 'from-emerald-500 to-green-600', border: 'border-emerald-500/50' },
  output: { gradient: 'from-rose-500 to-red-600', border: 'border-rose-500/50' },
  llm: { gradient: 'from-violet-500 to-purple-600', border: 'border-violet-500/50' },
  text: { gradient: 'from-amber-500 to-yellow-600', border: 'border-amber-500/50' },
  math: { gradient: 'from-blue-500 to-cyan-600', border: 'border-blue-500/50' },
  api: { gradient: 'from-orange-500 to-amber-600', border: 'border-orange-500/50' },
  condition: { gradient: 'from-indigo-500 to-blue-600', border: 'border-indigo-500/50' },
  date: { gradient: 'from-pink-500 to-rose-600', border: 'border-pink-500/50' },
  memory: { gradient: 'from-teal-500 to-emerald-600', border: 'border-teal-500/50' },
};

const nodeIcons = {
  input: '📥',
  output: '📤',
  llm: '🤖',
  text: '📝',
  math: '🔢',
  api: '🌐',
  condition: '🔀',
  date: '📅',
  memory: '🧠',
};

export const BaseNode = ({ 
  id, 
  title, 
  type = 'text',
  inputs = [], 
  outputs = [], 
  children,
  minWidth = 280,
  selected
}) => {
  const colors = nodeColors[type] || nodeColors.text;
  const icon = nodeIcons[type] || '📦';

  return (
    <div 
      className={`
        bg-slate-800/95 backdrop-blur-sm
        rounded-xl shadow-xl
        border-2 ${colors.border}
        ${selected ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900' : ''}
        transition-all duration-200 ease-in-out
        hover:shadow-2xl hover:shadow-${type === 'input' ? 'emerald' : type === 'output' ? 'rose' : 'violet'}-500/20
      `}
      style={{ minWidth: `${minWidth}px` }}
    >
      {/* Input Handles */}
      <Handles handles={inputs} type="target" nodeId={id} />
      
      {/* Header */}
      <NodeHeader title={title} icon={icon} gradient={colors.gradient} />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {children}
      </div>

      {/* Output Handles */}
      <Handles handles={outputs} type="source" nodeId={id} />
    </div>
  );
};

export default BaseNode;
