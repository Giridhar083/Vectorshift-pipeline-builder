import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const BaseNode = ({
  id,
  title,
  accentColor = '#6366f1',
  inputs = [],
  outputs = [],
  children,
  minWidth = 160,
  style = {},
}) => {
  const deleteNode = useStore((s) => s.deleteNode);

  const getHandleTop = (index, total) => {
    if (total === 1) return '50%';
    return `${(100 / (total + 1)) * (index + 1)}%`;
  };

  return (
    <div
      className="base-node"
      style={{ minWidth, borderTop: `3px solid ${accentColor}`, ...style }}
    >
      {inputs.map((handle, i) => (
        <Handle
          key={handle.id}
          type="target"
          position={Position.Left}
          id={handle.id}
          style={{ top: getHandleTop(i, inputs.length) }}
          className="node-handle node-handle--input"
        />
      ))}

      <div className="base-node__header">
        <span className="base-node__title">{title}</span>
        <button className="node-delete" onClick={() => deleteNode(id)} title="Delete node">
          ×
        </button>
      </div>

      <div className="base-node__body">{children}</div>

      {outputs.map((handle, i) => (
        <Handle
          key={handle.id}
          type="source"
          position={Position.Right}
          id={handle.id}
          style={{ top: getHandleTop(i, outputs.length) }}
          className="node-handle node-handle--output"
        />
      ))}
    </div>
  );
};
