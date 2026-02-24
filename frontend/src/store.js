// store.js - Zustand store for state management
import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},

  // Get unique node ID
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  // Add a new node
  addNode: (node) => {
    set({
      nodes: [...get().nodes, node]
    });
  },

  // Handle node changes (move, select, etc.)
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  // Handle edge changes (select, remove, etc.)
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  // Handle new connections
  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#8b5cf6', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 15,
            height: 15,
            color: '#8b5cf6',
          },
        },
        get().edges
      ),
    });
  },

  // Update a specific field in a node's data
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, [fieldName]: fieldValue }
          };
        }
        return node;
      }),
    });
  },

  // Clear the entire canvas
  clearCanvas: () => {
    set({ nodes: [], edges: [], nodeIDs: {} });
  },

  // Load a pipeline (for import functionality)
  loadPipeline: (pipeline) => {
    if (pipeline.nodes && pipeline.edges) {
      set({
        nodes: pipeline.nodes,
        edges: pipeline.edges,
      });
    }
  },

  // Remove a node by ID
  removeNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },
}));

export default useStore;
