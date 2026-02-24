// APINode.jsx - API fetch node
import React, { useState } from 'react';
import { BaseNode } from '../../components/BaseNode';
import { useStore } from '../../store';

export const APINode = ({ id, data, selected }) => {
  const [url, setUrl] = useState(data?.url || 'https://api.example.com');
  const [method, setMethod] = useState(data?.method || 'GET');
  const [headers, setHeaders] = useState(data?.headers || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    updateNodeField(id, 'url', e.target.value);
  };

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
    updateNodeField(id, 'method', e.target.value);
  };

  const handleHeadersChange = (e) => {
    setHeaders(e.target.value);
    updateNodeField(id, 'headers', e.target.value);
  };

  const methodColors = {
    GET: 'text-green-400 bg-green-500/20',
    POST: 'text-blue-400 bg-blue-500/20',
    PUT: 'text-amber-400 bg-amber-500/20',
    DELETE: 'text-red-400 bg-red-500/20',
    PATCH: 'text-purple-400 bg-purple-500/20',
  };

  return (
    <BaseNode
      id={id}
      title="API Call"
      type="api"
      inputs={[
        { id: 'body', label: 'Body' },
        { id: 'params', label: 'Params' }
      ]}
      outputs={[
        { id: 'response', label: 'Response' },
        { id: 'status', label: 'Status' }
      ]}
      selected={selected}
      minWidth={320}
    >
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="w-24">
            <label className="block text-slate-400 text-xs font-medium mb-1">Method</label>
            <select
              value={method}
              onChange={handleMethodChange}
              className={`w-full px-2 py-2 border border-slate-600 rounded-lg
                         text-sm focus:outline-none focus:ring-2 focus:ring-orange-500
                         focus:border-transparent appearance-none cursor-pointer font-bold
                         ${methodColors[method]} bg-slate-700/50`}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-slate-400 text-xs font-medium mb-1">URL</label>
            <input
              type="text"
              value={url}
              onChange={handleUrlChange}
              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                         text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500
                         focus:border-transparent font-mono"
              placeholder="https://api.example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1">
            Headers (JSON)
          </label>
          <textarea
            value={headers}
            onChange={handleHeadersChange}
            className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg
                       text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500
                       focus:border-transparent resize-none font-mono"
            placeholder='{"Authorization": "Bearer token"}'
            rows={2}
          />
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span>Ready to fetch</span>
        </div>
      </div>
    </BaseNode>
  );
};

export default APINode;
