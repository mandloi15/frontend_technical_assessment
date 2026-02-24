// Sidebar.jsx - Draggable node sidebar component
import React, { useState } from 'react';
import { useStore } from '../store';
import { analyzePipeline } from '../utils/dagCheckHelper';

// Node categories with their types
const nodeCategories = [
  {
    name: 'Core',
    nodes: [
      { type: 'customInput', label: 'Input', icon: '📥', color: 'bg-emerald-500' },
      { type: 'customOutput', label: 'Output', icon: '📤', color: 'bg-rose-500' },
      { type: 'text', label: 'Text', icon: '📝', color: 'bg-amber-500' },
    ]
  },
  {
    name: 'AI',
    nodes: [
      { type: 'llm', label: 'LLM', icon: '🤖', color: 'bg-violet-500' },
    ]
  },
  {
    name: 'Logic',
    nodes: [
      { type: 'math', label: 'Math', icon: '🔢', color: 'bg-blue-500' },
      { type: 'condition', label: 'Condition', icon: '🔀', color: 'bg-indigo-500' },
    ]
  },
  {
    name: 'Data',
    nodes: [
      { type: 'api', label: 'API', icon: '🌐', color: 'bg-orange-500' },
      { type: 'date', label: 'Date', icon: '📅', color: 'bg-pink-500' },
      { type: 'memory', label: 'Memory', icon: '🧠', color: 'bg-teal-500' },
    ]
  }
];

// Draggable Node Item
const DraggableNodeItem = ({ type, label, icon, color }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-xl cursor-grab
        bg-slate-800/50 border border-slate-700
        hover:bg-slate-700/50 hover:border-slate-600
        hover:shadow-lg hover:shadow-slate-900/50
        transition-all duration-200 ease-in-out
        active:cursor-grabbing active:scale-95
      `}
      onDragStart={(e) => onDragStart(e, type)}
      onDragEnd={(e) => (e.target.style.cursor = 'grab')}
      draggable
    >
      <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-lg`}>
        {icon}
      </div>
      <span className="text-slate-200 font-medium text-sm">{label}</span>
    </div>
  );
};

// Analysis Modal
const AnalysisModal = ({ isOpen, onClose, analysis }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>📊</span> Pipeline Analysis
        </h2>
        
        <div className="space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{analysis.numNodes}</div>
              <div className="text-slate-400 text-sm">Nodes</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{analysis.numEdges}</div>
              <div className="text-slate-400 text-sm">Edges</div>
            </div>
          </div>

          {/* DAG Status */}
          <div className={`
            rounded-xl p-4 text-center
            ${analysis.isDAG ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-red-500/20 border border-red-500/50'}
          `}>
            <div className="text-4xl mb-2">{analysis.isDAG ? '✅' : '❌'}</div>
            <div className={`font-bold ${analysis.isDAG ? 'text-emerald-400' : 'text-red-400'}`}>
              {analysis.isDAG ? 'Valid DAG' : 'Contains Cycle'}
            </div>
            <div className="text-slate-400 text-sm mt-1">{analysis.message}</div>
          </div>

          {/* Node Types */}
          {Object.keys(analysis.nodeTypes || {}).length > 0 && (
            <div className="bg-slate-900/50 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-2">Node Types:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(analysis.nodeTypes).map(([type, count]) => (
                  <span 
                    key={type}
                    className="px-2 py-1 bg-slate-700 rounded-full text-xs text-slate-300"
                  >
                    {type}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cycle Info */}
          {analysis.cycle && (
            <div className="bg-red-900/30 rounded-xl p-4 border border-red-500/30">
              <div className="text-red-400 text-sm mb-2">Cycle Detected:</div>
              <div className="text-xs text-red-300 font-mono">
                {analysis.cycle.join(' → ')}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl
                     text-white font-medium transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const handleSubmit = async () => {
    const analysis = analyzePipeline(nodes, edges);
    setAnalysisResult(analysis);
    setShowModal(true);

    // Also send to backend
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await response.json();
      console.log('Backend response:', data);
    } catch (error) {
      console.log('Backend not available, using local analysis');
    }
  };

  const handleExport = () => {
    const pipeline = { nodes, edges };
    const blob = new Blob([JSON.stringify(pipeline, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipeline.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const pipeline = JSON.parse(e.target.result);
          // Import logic would go here - need to update store
          console.log('Imported pipeline:', pipeline);
          alert('Pipeline imported! (Feature in development)');
        } catch (error) {
          alert('Invalid pipeline file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <div className="w-72 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">⚡</span> Pipeline Builder
          </h1>
          <p className="text-slate-400 text-sm mt-1">Drag nodes to canvas</p>
        </div>

        {/* Node Categories */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {nodeCategories.map((category) => (
            <div key={category.name}>
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
                {category.name}
              </h3>
              <div className="space-y-2">
                {category.nodes.map((node) => (
                  <DraggableNodeItem key={node.type} {...node} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          {/* Import/Export */}
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-lg
                         text-slate-300 text-sm font-medium transition-colors flex items-center justify-center gap-1"
            >
              <span>💾</span> Export
            </button>
            <label
              className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-lg
                         text-slate-300 text-sm font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>📂</span> Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 
                       hover:from-violet-500 hover:to-purple-500
                       rounded-xl text-white font-semibold text-sm
                       shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
                       transition-all duration-200"
          >
            🚀 Submit Pipeline
          </button>
        </div>
      </div>

      {/* Analysis Modal */}
      <AnalysisModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        analysis={analysisResult || {}} 
      />
    </>
  );
};

export default Sidebar;
