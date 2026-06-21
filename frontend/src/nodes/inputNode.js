import { useState } from 'react';
import { useStore } from '../store';
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const [name, setName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const updateNodeField = useStore((s) => s.updateNodeField);

  return (
    <BaseNode
      id={id}
      title="Input"
      accentColor="#22d3ee"
      outputs={[{ id: `${id}-value`, label: 'Value' }]}
    >
      <div className="node-field">
        <label className="node-label">Name</label>
        <input
          className="node-input"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            updateNodeField(id, 'inputName', e.target.value);
          }}
        />
      </div>
      <div className="node-field">
        <label className="node-label">Type</label>
        <select
          className="node-select"
          value={inputType}
          onChange={(e) => {
            setInputType(e.target.value);
            updateNodeField(id, 'inputType', e.target.value);
          }}
        >
          <option value="Text">Text</option>
          <option value="File">File</option>
          <option value="Image">Image</option>
        </select>
      </div>
    </BaseNode>
  );
};
