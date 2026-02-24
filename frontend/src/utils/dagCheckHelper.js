// dagCheckHelper.js - Utility to check if a graph is a DAG (Directed Acyclic Graph)

/**
 * Check if a graph represented by nodes and edges is a valid DAG
 * Uses Kahn's algorithm for topological sorting
 * @param {Array} nodes - Array of node objects with id property
 * @param {Array} edges - Array of edge objects with source and target properties
 * @returns {Object} - Result object with isDAG boolean and analysis details
 */
export const checkDAG = (nodes, edges) => {
  if (!nodes || nodes.length === 0) {
    return {
      isDAG: true,
      numNodes: 0,
      numEdges: 0,
      message: 'Empty graph is a valid DAG',
      cycle: null
    };
  }

  const numNodes = nodes.length;
  const numEdges = edges ? edges.length : 0;

  // Build adjacency list and calculate in-degrees
  const adjacencyList = new Map();
  const inDegree = new Map();
  
  // Initialize
  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
    inDegree.set(node.id, 0);
  });

  // Build graph
  edges.forEach(edge => {
    const source = edge.source;
    const target = edge.target;
    
    if (adjacencyList.has(source)) {
      adjacencyList.get(source).push(target);
    }
    
    if (inDegree.has(target)) {
      inDegree.set(target, inDegree.get(target) + 1);
    }
  });

  // Kahn's algorithm
  const queue = [];
  const sortedOrder = [];

  // Find all nodes with no incoming edges
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId);
    }
  });

  while (queue.length > 0) {
    const currentNode = queue.shift();
    sortedOrder.push(currentNode);

    const neighbors = adjacencyList.get(currentNode) || [];
    neighbors.forEach(neighbor => {
      const newDegree = inDegree.get(neighbor) - 1;
      inDegree.set(neighbor, newDegree);
      
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    });
  }

  // If sorted order doesn't contain all nodes, there's a cycle
  const isDAG = sortedOrder.length === numNodes;

  // Find cycle if exists (for detailed error message)
  let cycle = null;
  if (!isDAG) {
    cycle = findCycle(nodes, edges);
  }

  return {
    isDAG,
    numNodes,
    numEdges,
    message: isDAG 
      ? 'Pipeline is a valid DAG (no cycles detected)' 
      : 'Pipeline contains a cycle and is not a valid DAG',
    topologicalOrder: isDAG ? sortedOrder : null,
    cycle
  };
};

/**
 * Find a cycle in the graph using DFS (for error reporting)
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @returns {Array|null} - Array of node IDs forming a cycle, or null if no cycle
 */
const findCycle = (nodes, edges) => {
  const adjacencyList = new Map();
  nodes.forEach(node => adjacencyList.set(node.id, []));
  edges.forEach(edge => {
    if (adjacencyList.has(edge.source)) {
      adjacencyList.get(edge.source).push(edge.target);
    }
  });

  const visited = new Set();
  const recursionStack = new Set();
  const path = [];

  const dfs = (nodeId) => {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    const neighbors = adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        const result = dfs(neighbor);
        if (result) return result;
      } else if (recursionStack.has(neighbor)) {
        // Found cycle
        const cycleStart = path.indexOf(neighbor);
        return [...path.slice(cycleStart), neighbor];
      }
    }

    path.pop();
    recursionStack.delete(nodeId);
    return null;
  };

  for (const node of nodes) {
    if (!visited.has(node.id)) {
      const cycle = dfs(node.id);
      if (cycle) return cycle;
    }
  }

  return null;
};

/**
 * Get pipeline analysis statistics
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @returns {Object} - Analysis statistics
 */
export const analyzePipeline = (nodes, edges) => {
  const dagResult = checkDAG(nodes, edges);
  
  // Count node types
  const nodeTypes = {};
  nodes.forEach(node => {
    const type = node.type || 'unknown';
    nodeTypes[type] = (nodeTypes[type] || 0) + 1;
  });

  // Find isolated nodes (no connections)
  const connectedNodes = new Set();
  edges.forEach(edge => {
    connectedNodes.add(edge.source);
    connectedNodes.add(edge.target);
  });
  const isolatedNodes = nodes.filter(node => !connectedNodes.has(node.id));

  return {
    ...dagResult,
    nodeTypes,
    isolatedNodes: isolatedNodes.map(n => n.id),
    hasIsolatedNodes: isolatedNodes.length > 0
  };
};

export default checkDAG;
