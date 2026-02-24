from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

app = FastAPI(title="Pipeline API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class Node(BaseModel):
    id: str
    type: str
    position: Dict[str, float]
    data: Dict[str, Any]

class Edge(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

class PipelineAnalysis(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool
    message: str
    node_types: Dict[str, int]
    has_cycle: bool

def check_dag(nodes: List[Node], edges: List[Edge]) -> tuple[bool, Optional[List[str]]]:
    """
    Check if the graph is a DAG using Kahn's algorithm
    Returns (is_dag, cycle_path if found)
    """
    if not nodes:
        return True, None
    
    # Build adjacency list and in-degree count
    adj_list = {node.id: [] for node in nodes}
    in_degree = {node.id: 0 for node in nodes}
    
    for edge in edges:
        if edge.source in adj_list:
            adj_list[edge.source].append(edge.target)
        if edge.target in in_degree:
            in_degree[edge.target] += 1
    
    # Start with nodes having 0 in-degree
    queue = [node_id for node_id, degree in in_degree.items() if degree == 0]
    sorted_order = []
    
    while queue:
        current = queue.pop(0)
        sorted_order.append(current)
        
        for neighbor in adj_list.get(current, []):
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    is_dag = len(sorted_order) == len(nodes)
    return is_dag, None if is_dag else find_cycle(nodes, edges)

def find_cycle(nodes: List[Node], edges: List[Edge]) -> Optional[List[str]]:
    """Find a cycle in the graph using DFS"""
    adj_list = {node.id: [] for node in nodes}
    for edge in edges:
        if edge.source in adj_list:
            adj_list[edge.source].append(edge.target)
    
    visited = set()
    rec_stack = set()
    
    def dfs(node_id: str, path: List[str]) -> Optional[List[str]]:
        visited.add(node_id)
        rec_stack.add(node_id)
        path.append(node_id)
        
        for neighbor in adj_list.get(node_id, []):
            if neighbor not in visited:
                result = dfs(neighbor, path)
                if result:
                    return result
            elif neighbor in rec_stack:
                cycle_start = path.index(neighbor)
                return path[cycle_start:] + [neighbor]
        
        path.pop()
        rec_stack.remove(node_id)
        return None
    
    for node in nodes:
        if node.id not in visited:
            cycle = dfs(node.id, [])
            if cycle:
                return cycle
    return None

@app.get('/')
def read_root():
    return {'Ping': 'Pong', 'status': 'Pipeline API is running'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline) -> PipelineAnalysis:
    """Analyze the pipeline and check if it's a valid DAG"""
    nodes = pipeline.nodes
    edges = pipeline.edges
    
    # Count node types
    node_types: Dict[str, int] = {}
    for node in nodes:
        node_type = node.type
        node_types[node_type] = node_types.get(node_type, 0) + 1
    
    # Check if DAG
    is_dag, cycle = check_dag(nodes, edges)
    
    return PipelineAnalysis(
        num_nodes=len(nodes),
        num_edges=len(edges),
        is_dag=is_dag,
        message="Pipeline is a valid DAG" if is_dag else f"Pipeline contains a cycle: {' -> '.join(cycle) if cycle else 'unknown'}",
        node_types=node_types,
        has_cycle=not is_dag
    )

@app.get('/pipelines/parse')
def parse_pipeline_get(pipeline: str = ""):
    """Legacy GET endpoint for backward compatibility"""
    return {'status': 'parsed', 'message': 'Use POST method for full analysis'}
