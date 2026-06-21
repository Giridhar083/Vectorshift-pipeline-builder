import { DraggableNode } from './draggableNode';

const nodeTypes = [
  { type: 'customInput',  label: 'Input',  color: '#22d3ee' },
  { type: 'customOutput', label: 'Output', color: '#f472b6' },
  { type: 'llm',          label: 'LLM',    color: '#a78bfa' },
  { type: 'text',         label: 'Text',   color: '#34d399' },
  { type: 'api',          label: 'API',    color: '#fb923c' },
  { type: 'note',         label: 'Note',   color: '#fbbf24' },
];

export const PipelineToolbar = () => (
  <div className="toolbar">
    <span className="toolbar__label">Nodes</span>
    {nodeTypes.map((n) => (
      <DraggableNode key={n.type} type={n.type} label={n.label} color={n.color} />
    ))}
  </div>
);
