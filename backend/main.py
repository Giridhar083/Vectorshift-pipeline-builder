from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any, Dict

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PipelinePayload(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


def check_is_dag(nodes: list, edges: list) -> bool:
    adj = {n["id"]: [] for n in nodes}
    for edge in edges:
        src, tgt = edge.get("source"), edge.get("target")
        if src in adj and tgt in adj:
            adj[src].append(tgt)

    visited, rec_stack = set(), set()

    def is_cyclic(node_id):
        visited.add(node_id)
        rec_stack.add(node_id)
        for neighbor in adj.get(node_id, []):
            if neighbor not in visited:
                if is_cyclic(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
        rec_stack.remove(node_id)
        return False

    for node in nodes:
        if node["id"] not in visited:
            if is_cyclic(node["id"]):
                return False
    return True


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(payload: PipelinePayload):
    try:
        return {
            "num_nodes": len(payload.nodes),
            "num_edges": len(payload.edges),
            "is_dag": check_is_dag(payload.nodes, payload.edges),
        }
    except Exception as e:
        return {"error": str(e)}
