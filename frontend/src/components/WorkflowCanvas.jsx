import { useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { useWorkflow } from "../context/WorkflowContext";
import FilterNode from "./nodes/FilterNode";
import SortNode from "./nodes/SortNode";
import LLMNode from "./nodes/LLMNode";
import MergeNode from "./nodes/MergeNode";
import GroupByNode from "./nodes/GroupByNode";
import InputNode from "./nodes/InputNode";
import OutputNode from "./nodes/OutputNode";

const nodeTypes = {
  filterNode: FilterNode,
  sortNode: SortNode,
  llmNode: LLMNode,
  mergeNode: MergeNode,
  groupByNode: GroupByNode,
  inputNode: InputNode,
  outputNode: OutputNode,
};

export default function WorkflowCanvas() {
  const { nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange } =
    useWorkflow();

  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, type: "smoothstep" }, eds));
    },
    [setEdges]
  );

  // Handler to delete edges when clicked
  const onEdgeClick = useCallback(
    (event, edge) => {
      event.stopPropagation();
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    },
    [setEdges]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = {
        x: event.clientX - event.target.getBoundingClientRect().left,
        y: event.clientY - event.target.getBoundingClientRect().top,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type} Node` },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className="workflow-canvas" style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode={["Backspace", "Delete"]}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}