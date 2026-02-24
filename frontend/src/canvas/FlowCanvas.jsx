// FlowCanvas.jsx - Main canvas component for the node-based flow editor
import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  MiniMap,
  BackgroundVariant 
} from 'reactflow';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

// Import all node types
import { InputNode } from '../nodes/InputNode';
import { OutputNode } from '../nodes/OutputNode';
import { LLMNode } from '../nodes/LLMNode';
import { TextNode } from '../nodes/TextNode';
import { MathNode } from '../nodes/custom/MathNode';
import { APINode } from '../nodes/custom/APINode';
import { ConditionNode } from '../nodes/custom/ConditionNode';
import { DateNode } from '../nodes/custom/DateNode';
import { MemoryNode } from '../nodes/custom/MemoryNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Register all node types
const nodeTypes = {
  customInput: InputNode,
  customOutput: OutputNode,
  llm: LLMNode,
  text: TextNode,
  math: MathNode,
  api: APINode,
  condition: ConditionNode,
  date: DateNode,
  memory: MemoryNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

// Custom minimap node color based on type
const nodeColor = (node) => {
  const colors = {
    customInput: '#10b981',
    customOutput: '#f43f5e',
    llm: '#8b5cf6',
    text: '#f59e0b',
    math: '#3b82f6',
    api: '#f97316',
    condition: '#6366f1',
    date: '#ec4899',
    memory: '#14b8a6',
  };
  return colors[node.type] || '#64748b';
};

export const FlowCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    return { id: nodeID, nodeType: type };
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType="smoothstep"
        connectionLineStyle={{ stroke: '#64748b', strokeWidth: 2 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#64748b', strokeWidth: 2 }
        }}
        fitView
        className="bg-slate-900"
      >
        <Background 
          variant={BackgroundVariant.Dots}
          color="#334155" 
          gap={gridSize} 
          size={1}
        />
        <Controls 
          className="!bg-slate-800 !border-slate-700 !shadow-xl"
          showInteractive={false}
        />
        <MiniMap 
          nodeColor={nodeColor}
          maskColor="rgba(15, 23, 42, 0.8)"
          className="!bg-slate-800 !border-slate-700"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
};

export default FlowCanvas;
