// TextNode.jsx - Text node with dynamic variable detection
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BaseNode } from '../components/BaseNode';
import { useStore } from '../store';
import { parseVariables } from '../utils/parseVariables';

export const TextNode = ({ id, data, selected }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Parse variables whenever text changes
  useEffect(() => {
    const vars = parseVariables(currText);
    setVariables(vars);
    updateNodeField(id, 'variables', vars);
  }, [currText, id, updateNodeField]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(60, textareaRef.current.scrollHeight)}px`;
    }
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
    updateNodeField(id, 'text', e.target.value);
  };

  // Generate dynamic input handles based on variables
  const dynamicInputs = variables.map(varName => ({
    id: varName,
    label: varName
  }));

  // Highlight variables in display
  const renderHighlightedText = useCallback(() => {
    if (!currText) return null;
    
    const parts = currText.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, index) => {
      if (part.match(/\{\{[^}]+\}\}/)) {
        return (
          <span key={index} className="bg-amber-500/30 text-amber-300 px-1 rounded">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  }, [currText]);

  return (
    <BaseNode
      id={id}
      title="Text"
      type="text"
      inputs={dynamicInputs}
      outputs={[{ id: 'output', label: 'Output' }]}
      selected={selected}
      minWidth={300}
    >
      <div className="space-y-3">
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">
            Text Content
          </label>
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500
                       focus:border-transparent resize-none transition-all font-mono"
            placeholder="Enter text with {{variables}}..."
            rows={2}
          />
        </div>
        
        {/* Variable Preview */}
        {variables.length > 0 && (
          <div className="bg-slate-900/50 rounded-lg p-2">
            <div className="text-xs text-slate-500 mb-1">Detected Variables:</div>
            <div className="flex flex-wrap gap-1">
              {variables.map((v, i) => (
                <span 
                  key={i} 
                  className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Preview */}
        <div className="bg-slate-900/30 rounded-lg p-2 text-xs">
          <div className="text-slate-500 mb-1">Preview:</div>
          <div className="text-slate-300 font-mono break-words">
            {renderHighlightedText()}
          </div>
        </div>
      </div>
    </BaseNode>
  );
};

export default TextNode;
