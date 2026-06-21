import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const getVariables = (text) => {
  const found = new Set();
  const re = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    found.add(match[1]);
  }
  return [...found];
};

export const TextNode = ({ id, data }) => {
  const defaultText = data?.text || '{{input}}';
  const [text, setText] = useState(defaultText);
  const [variables, setVariables] = useState(() => getVariables(defaultText));
  const textareaRef = useRef(null);
  const updateNodeField = useStore((s) => s.updateNodeField);
  const deleteNode = useStore((s) => s.deleteNode);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);
    updateNodeField(id, 'text', val);
    setVariables(getVariables(val));
  };

  const getHandleTop = (index, total) => {
    if (total === 1) return '50%';
    return `${(100 / (total + 1)) * (index + 1)}%`;
  };

  const longestLine = Math.max(...text.split('\n').map((l) => l.length), 10);
  const nodeWidth = Math.min(Math.max(160, longestLine * 7 + 32), 400);

  return (
    <div className="base-node" style={{ minWidth: nodeWidth, borderTop: '3px solid #34d399' }}>
      {variables.map((v, i) => (
        <Handle
          key={v}
          type="target"
          position={Position.Left}
          id={`${id}-${v}`}
          style={{ top: getHandleTop(i, variables.length) }}
          className="node-handle node-handle--input"
        />
      ))}

      <div className="base-node__header">
        <span className="base-node__title">Text</span>
        <button className="node-delete" onClick={() => deleteNode(id)} title="Delete node">
          ×
        </button>
      </div>

      <div className="base-node__body">
        <div className="node-field">
          <label className="node-label">Text</label>
          <textarea
            ref={textareaRef}
            className="node-textarea"
            value={text}
            onChange={handleChange}
            rows={1}
            spellCheck={false}
          />
        </div>
        {variables.length > 0 && (
          <div className="node-vars">
            {variables.map((v) => (
              <span key={v} className="node-var-tag">{v}</span>
            ))}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className="node-handle node-handle--output"
      />
    </div>
  );
};
