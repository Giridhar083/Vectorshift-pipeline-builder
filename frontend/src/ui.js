import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode }  from './nodes/inputNode';
import { OutputNode } from './nodes/outputNode';
import { LLMNode }    from './nodes/llmNode';
import { TextNode }   from './nodes/textNode';
import { ApiNode }    from './nodes/apiNode';
import { NoteNode }   from './nodes/noteNode';
import 'reactflow/dist/style.css';

const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput:  InputNode,
  customOutput: OutputNode,
  llm:          LLMNode,
  text:         TextNode,
  api:          ApiNode,
  note:         NoteNode,
};

const selector = (s) => ({
  nodes:         s.nodes,
  edges:         s.edges,
  getNodeID:     s.getNodeID,
  addNode:       s.addNode,
  onNodesChange: s.onNodesChange,
  onEdgesChange: s.onEdgesChange,
  onConnect:     s.onConnect,
});

export const PipelineUI = () => {
  const wrapper = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const bounds = wrapper.current.getBoundingClientRect();
      const raw = event?.dataTransfer?.getData('application/reactflow');
      if (!raw) return;
      const { nodeType: type } = JSON.parse(raw);
      if (!type) return;
      const position = rfInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
    },
    [rfInstance, getNodeID, addNode] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={wrapper} className="canvas-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[16, 16]}
        connectionLineType="smoothstep"
        fitView
      >
        <Background color="#2a3040" gap={20} size={1} />
        <Controls />
        <MiniMap nodeColor={() => '#2a3040'} maskColor="rgba(15,17,23,0.7)" />
      </ReactFlow>
    </div>
  );
};
